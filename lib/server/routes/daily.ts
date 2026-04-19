import { geocode } from '../../vedic/geocode';
import { buildBirthChart } from '../../vedic/chart';
import { parseModelJson } from '../../ai/parseModelJson';
import { perplexityChat } from '../../ai/perplexity';
import { DAILY_SYSTEM, buildDailyPrompt } from '../../ai/prompts';
import type { DailyFocusArea } from '../../dailyAlignmentStorage';
import type { SignName } from '../../vedic/types';

export async function handleDailyWisdomRequest(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace, nakshatra, rashi } = await request.json() as {
      birthDt: string;
      birthPlace: string;
      nakshatra?: string;
      rashi?: SignName;
    };

    if (!birthDt || !birthPlace) {
      return Response.json({ error: 'birthDt and birthPlace are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: DAILY_SYSTEM },
      { role: 'user', content: buildDailyPrompt(chart, { nakshatra, rashi }) },
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
    console.error('[daily]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
