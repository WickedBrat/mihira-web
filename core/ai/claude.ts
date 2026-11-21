// Thin client for the Claude Messages API over fetch (no SDK dependency).

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
const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
const BETAS = 'server-side-fallback-2026-07-01';
const DEFAULT_MAX_TOKENS = 8192;

interface ContentBlock { type: string; text?: string }

function headers(): Record<string, string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return {
    'x-api-key': apiKey,
    'anthropic-version': API_VERSION,
    'anthropic-beta': BETAS,
    'content-type': 'application/json',
  };
}

// Callers pass OpenAI-style messages; Claude takes system prompts separately
// and the conversation must start with a user turn.
function toClaudeBody(messages: Message[], options: ClaudeOptions = {}, stream = false) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const turns = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));
  while (turns.length && turns[0].role !== 'user') turns.shift();

  return {
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    ...(system ? { system } : {}),
    messages: turns,
    output_config: {
      effort: options.effort ?? 'low',
      ...(options.schema ? { format: { type: 'json_schema', schema: options.schema } } : {}),
    },
    fallbacks: 'default',
    ...(stream ? { stream: true } : {}),
  };
}

async function post(body: unknown): Promise<Response> {
  const res = await fetch(API_URL, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Claude API error ${res.status}: ${text.slice(0, 500)}`);
  }
  return res;
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
  const res = await post(toClaudeBody(messages, options));
  const data = await res.json() as { content?: ContentBlock[]; stop_reason?: string | null };
  checkStop(data.stop_reason, Boolean(options.schema));
  return (data.content ?? [])
    .map((block) => (block.type === 'text' ? block.text ?? '' : ''))
    .join('');
}

/** Streams text deltas from the Messages API's server-sent events. */
export async function claudeStream(
  messages: Message[],
  onChunk: (token: string) => void,
  options: Omit<ClaudeOptions, 'schema'> = {},
): Promise<void> {
  const res = await post(toClaudeBody(messages, options, true));
  if (!res.body) throw new Error('Claude stream returned no body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let stopReason: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      let event: {
        type?: string;
        delta?: { type?: string; text?: string; stop_reason?: string | null };
        error?: { message?: string };
      };
      try {
        event = JSON.parse(line.slice(5).trim());
      } catch {
        continue;
      }
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta' && event.delta.text) {
        onChunk(event.delta.text);
      } else if (event.type === 'message_delta' && event.delta?.stop_reason) {
        stopReason = event.delta.stop_reason;
      } else if (event.type === 'error') {
        throw new Error(`Claude stream error: ${event.error?.message ?? 'unknown'}`);
      }
    }
  }
  checkStop(stopReason, false);
}
