// app/api/narad+api.ts
import { perplexityChat } from '@/lib/ai/perplexity';
import { NARAD_SYSTEM, buildNaradUserMessage } from '@/lib/ai/prompts';
import { parseModelJson } from '@/lib/ai/parseModelJson';
import type { NaradContext, NaradHistoryEntry, NaradResponse } from '@/features/ask/types';

const VALID_DEITIES = new Set(['Krishna', 'Shiva', 'Lakshmi', 'Ram']);
const VALID_TRIGGERS = new Set(['gentle_pluck', 'rising_smoke', 'lotus_bloom', 'steady_dawn']);

function validateNaradResponse(parsed: NaradResponse): void {
  if (!VALID_DEITIES.has(parsed.interaction_metadata.consulted_deity)) {
    throw new Error(`Invalid consulted_deity: ${parsed.interaction_metadata.consulted_deity}`);
  }
  if (!VALID_TRIGGERS.has(parsed.interaction_metadata.animation_trigger)) {
    throw new Error(`Invalid animation_trigger: ${parsed.interaction_metadata.animation_trigger}`);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: { message: string; history: NaradHistoryEntry[]; userContext: NaradContext };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, history = [], userContext } = body;

  if (!message || typeof message !== 'string' || !userContext) {
    return Response.json(
      { error: 'message and userContext are required' },
      { status: 400 },
    );
  }

  if (message.length > 2000) {
    return Response.json({ error: 'message exceeds 2000 characters' }, { status: 400 });
  }

  const boundedHistory = Array.isArray(history) ? history.slice(-20) : [];
  const userMessage = buildNaradUserMessage(message, userContext, boundedHistory);
  const messages = [
    { role: 'system', content: NARAD_SYSTEM },
    { role: 'user', content: userMessage },
  ];

  try {
    const raw = await perplexityChat('sonar-pro', messages);
    const parsed = parseModelJson<Record<string, unknown>>(raw, [
      'interaction_metadata',
      'narad_narrative',
      'divine_vani',
      'narad_closing',
    ]) as unknown as NaradResponse;
    validateNaradResponse(parsed);
    return Response.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Narad route error';
    console.error('[narad]', msg);
    return Response.json({ error: msg }, { status: 502 });
  }
}
