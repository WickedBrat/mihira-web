// app/api/wisdom/muhurat+api.ts
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';
import { getMuhuratWindows } from '@/lib/vedic/muhurat';
import { perplexityChat } from '@/lib/ai/perplexity';
import { MUHURAT_SYSTEM, buildMuhuratPrompt } from '@/lib/ai/prompts';

export async function POST(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace, eventType, date } = await request.json() as {
      birthDt: string;
      birthPlace: string;
      eventType: string;
      date?: string;
    };

    if (!birthDt || !birthPlace || !eventType) {
      return Response.json({ error: 'birthDt, birthPlace, and eventType are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);
    const targetDate = date ? new Date(date) : new Date();
    const windows = getMuhuratWindows(targetDate, lat, lng, eventType);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: MUHURAT_SYSTEM },
      { role: 'user',   content: buildMuhuratPrompt(eventType, chart, windows) },
    ]);

    let parsed: { recommendation: string; suggestion: string; reasoning: string };
    try {
      parsed = JSON.parse(raw);
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
