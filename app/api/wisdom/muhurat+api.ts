// app/api/wisdom/muhurat+api.ts
import { parseModelJson } from '@/lib/ai/parseModelJson';
import { perplexityChat } from '@/lib/ai/perplexity';
import { MUHURAT_SYSTEM, buildMuhuratPrompt } from '@/lib/ai/prompts';
import type { MuhuratWindow } from '@/lib/vedic/types';

export async function POST(request: Request): Promise<Response> {
  try {
    const { eventDescription, startDate, endDate } = await request.json() as {
      eventDescription: string;
      startDate: string;
      endDate: string;
    };

    if (!eventDescription || !startDate || !endDate) {
      return Response.json(
        { error: 'eventDescription, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return Response.json({ error: 'Invalid date range' }, { status: 400 });
    }

    if (start.getTime() > end.getTime()) {
      return Response.json({ error: 'Start date must be before end date' }, { status: 400 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (start.getTime() < todayStart.getTime()) {
      return Response.json({ error: 'Start date must be today or a future date' }, { status: 400 });
    }

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: MUHURAT_SYSTEM },
      { role: 'user', content: buildMuhuratPrompt(eventDescription, startDate, endDate) },
    ]);

    let parsed: {
      recommendation: string;
      confidence: string;
      suggestion: string;
      reasoning: string;
      warnings: string;
      rankedWindows?: MuhuratWindow[];
    };
    try {
      parsed = parseModelJson(raw, ['recommendation', 'suggestion', 'reasoning']);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    const rankedWindows = (parsed.rankedWindows ?? [])
      .filter(w => w.isAuspicious)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 10);

    return Response.json({
      rankedWindows,
      recommendation: parsed.recommendation,
      confidence: parsed.confidence ?? 'Medium',
      suggestion: parsed.suggestion,
      reasoning: parsed.reasoning,
      warnings: parsed.warnings ?? 'None',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[muhurat+api]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
