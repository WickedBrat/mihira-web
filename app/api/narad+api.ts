// app/api/narad+api.ts
import { perplexityChat } from '@/lib/ai/perplexity';
import { NARAD_SYSTEM, buildNaradUserMessage } from '@/lib/ai/prompts';
import type { NaradContext, NaradHistoryEntry, NaradResponse } from '@/features/ask/types';

function extractJson(raw: string): NaradResponse {
  try {
    return JSON.parse(raw) as NaradResponse;
  } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as NaradResponse;
    } catch {}
  }
  throw new Error('Could not parse Narad response as JSON');
}

export async function POST(request: Request): Promise<Response> {
  const { message, history = [], userContext } = await request.json() as {
    message: string;
    history: NaradHistoryEntry[];
    userContext: NaradContext;
  };

  const userMessage = buildNaradUserMessage(message, userContext, history);
  const messages = [
    { role: 'system', content: NARAD_SYSTEM },
    { role: 'user', content: userMessage },
  ];

  try {
    const raw = await perplexityChat('sonar-pro', messages);
    const response = extractJson(raw);
    return Response.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Narad route error';
    const isParse = msg.includes('parse') || msg.includes('JSON');
    return new Response(JSON.stringify({ error: msg }), {
      status: isParse ? 500 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
