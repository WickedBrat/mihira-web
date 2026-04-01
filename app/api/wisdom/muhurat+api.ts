// app/api/wisdom/muhurat+api.ts
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';
import { getMuhuratWindowsForRange } from '@/lib/vedic/muhurat';
import { parseModelJson } from '@/lib/ai/parseModelJson';
import { perplexityChat } from '@/lib/ai/perplexity';
import { MUHURAT_SYSTEM, buildMuhuratPrompt } from '@/lib/ai/prompts';

export async function POST(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace, eventDescription, startDate, endDate } = await request.json() as {
      birthDt: string;
      birthPlace: string;
      eventDescription: string;
      startDate: string;
      endDate: string;
    };

    if (!birthDt || !birthPlace || !eventDescription || !startDate || !endDate) {
      return Response.json(
        { error: 'birthDt, birthPlace, eventDescription, startDate, and endDate are required' },
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

    const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    if (days > 14) {
      return Response.json({ error: 'Please choose a date range of 14 days or fewer' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);
    const windows = getMuhuratWindowsForRange(start, end, lat, lng, eventDescription);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: MUHURAT_SYSTEM },
      {
        role: 'user',
        content: buildMuhuratPrompt(eventDescription, chart, windows, startDate, endDate),
      },
    ]);

    let parsed: { recommendation: string; suggestion: string; reasoning: string };
    try {
      parsed = parseModelJson(raw, ['recommendation', 'suggestion', 'reasoning']);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    return Response.json({
      windows,
      recommendation: parsed.recommendation,
      suggestion: parsed.suggestion,
      reasoning: parsed.reasoning,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[muhurat+api]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
