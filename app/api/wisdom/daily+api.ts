// app/api/wisdom/daily+api.ts
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';
import { parseModelJson } from '@/lib/ai/parseModelJson';
import { perplexityChat } from '@/lib/ai/perplexity';
import { DAILY_SYSTEM, buildDailyPrompt } from '@/lib/ai/prompts';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';

export async function POST(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace } = await request.json() as {
      birthDt: string;
      birthPlace: string;
    };

    if (!birthDt || !birthPlace) {
      return Response.json({ error: 'birthDt and birthPlace are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: DAILY_SYSTEM },
      { role: 'user',   content: buildDailyPrompt(chart) },
    ]);

    let parsed: { focusAreas: DailyFocusArea[] };
    try {
      parsed = parseModelJson(raw, ['focusAreas']);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    return Response.json({
      chart,
      focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[daily+api]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
