import Anthropic from '@anthropic-ai/sdk';

export interface Message { role: string; content: string }

/** JSON Schema for structured output. Every object needs `additionalProperties: false`. */
export type JsonSchema = Record<string, unknown>;

export interface ClaudeOptions {
  /**
   * When set, Claude's reply is constrained to this JSON schema
   * (output_config.format), so the text is always parseable JSON.
   */
  schema?: JsonSchema;
  /** Output cap for this call. Thinking (if any) counts toward it. */
  maxTokens?: number;
  /** Lower is faster and cheaper; raise it where depth matters. */
  effort?: 'low' | 'medium' | 'high';
}

export const CLAUDE_MODEL = 'claude-opus-5-5';
const DEFAULT_MAX_TOKENS = 8192;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  client ??= new Anthropic({ apiKey });
  return client;
}

// Callers pass OpenAI-style messages; Claude takes system prompts separately
// and the conversation must start with a user turn.
function toClaudeParams(messages: Message[], options: ClaudeOptions = {}) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const turns = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  while (turns.length && turns[0].role !== 'user') turns.shift();

  return {
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    ...(system ? { system } : {}),
    messages: turns,
    output_config: {
      effort: options.effort ?? ('low' as const),
      ...(options.schema ? { format: { type: 'json_schema' as const, schema: options.schema } } : {}),
    },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default' as const,
  };
}

function checkStop(stopReason: string | null | undefined, structured: boolean) {
  if (stopReason === 'refusal') throw new Error('Claude declined the request');
  // A truncated structured reply is invalid JSON; fail loudly rather than parse garbage.
  if (structured && stopReason === 'max_tokens') {
    throw new Error('Claude response truncated at max_tokens');
  }
}

/**
 * One-shot completion. With `options.schema`, the returned text is JSON that
 * matches the schema; callers still run it through parseModelJson.
 */
export async function claudeChat(messages: Message[], options: ClaudeOptions = {}): Promise<string> {
  const res = await getClient().beta.messages.create(toClaudeParams(messages, options));
  checkStop(res.stop_reason, Boolean(options.schema));
  return res.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('');
}

export async function claudeStream(
  messages: Message[],
  onChunk: (token: string) => void,
  options: Omit<ClaudeOptions, 'schema'> = {},
): Promise<void> {
  const stream = getClient().beta.messages.stream(toClaudeParams(messages, options));
  stream.on('text', (token) => {
    if (token) onChunk(token);
  });
  const final = await stream.finalMessage();
  checkStop(final.stop_reason, false);
}
