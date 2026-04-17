import { generateScriptureGuide } from '@/lib/ai/askService';
import type { AskHistoryTurn, AskResponseMode, AskContextV2 } from '@/features/ask/types';

function isMode(value: unknown): value is AskResponseMode {
  return value === 'quick' || value === 'deep' || value === 'compare';
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      message?: string;
      mode?: AskResponseMode;
      userContext?: AskContextV2;
      history?: AskHistoryTurn[];
    };

    if (!body.message || typeof body.message !== 'string') {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    if (body.message.length > 2000) {
      return Response.json({ error: 'message exceeds 2000 characters' }, { status: 400 });
    }

    if (!isMode(body.mode)) {
      return Response.json({ error: 'mode must be quick, deep, or compare' }, { status: 400 });
    }

    const response = await generateScriptureGuide({
      message: body.message,
      mode: body.mode,
      userContext: body.userContext,
      history: body.history,
    });

    return Response.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ask route error';
    console.error('[ask+api]', message);
    return Response.json({ error: message }, { status: 502 });
  }
}
