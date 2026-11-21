import { geocode } from '../../vedic/geocode';
import { buildBirthChart } from '../../vedic/chart';
import { getMuhuratWindows, getTithiAt, sunriseSunset } from '../../vedic/muhurat';
import { getTransits } from '../../vedic/transits';
import { parseModelJson } from '../../ai/parseModelJson';
import { claudeChat } from '../../ai/claude';
import {
  DAILY_SCHEMA,
  DAILY_SYSTEM,
  buildDailyPrompt,
  type DailyTodayContext,
  type DailyWindow,
} from '../../ai/prompts';
import { serverErrorResponse } from '../errorResponse';
import { resolveLocation, type LocationHints, type RequestLocation } from '../location';
import type { DailyFocusArea } from '../../dailyAlignmentTypes';
import type { BirthChart, MuhuratWindow, SignName } from '../../vedic/types';

interface DailyBody extends LocationHints {
  birthDt: string;
  birthPlace: string;
  nakshatra?: string;
  rashi?: SignName;
}

interface ModelFocusArea {
  area: string;
  action: string;
  windowId: number | null;
  suggestion: string;
  jyotishBasis: string;
}

const NO_WINDOW_LABEL = 'Any time today';

function shortQuality(w: MuhuratWindow): string {
  if (w.type === 'abhijit') return 'Abhijit';
  return w.quality.replace(' (Auspicious)', '');
}

/**
 * Today's ground truth for the prompt: transits for this moment, and — when we
 * know where the user is — tithi at their sunrise and the auspicious windows
 * still ahead of them today, so every time on the card is a computed one.
 */
export function buildTodayContext(chart: BirthChart, loc: RequestLocation | null, now: Date): DailyTodayContext {
  const transits = getTransits(now, chart.lagna);

  if (!loc) {
    const tithi = getTithiAt(now);
    return {
      dateLabel: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      localTime: null,
      place: null,
      tithi: `${tithi.paksha} ${tithi.name}`,
      sunrise: null,
      sunset: null,
      transits,
      windows: [],
    };
  }

  const tz = loc.timeZone;
  const dateKey = now.toLocaleDateString('en-CA', { timeZone: tz }); // local YYYY-MM-DD
  const day = new Date(`${dateKey}T12:00:00Z`);
  const { sunrise, sunset } = sunriseSunset(day, loc.lat, loc.lng);
  const tithi = getTithiAt(sunrise);
  const time = (d: Date) => d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });
  const localHour = (d: Date) => Number(d.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hourCycle: 'h23' }));

  const windows: DailyWindow[] = getMuhuratWindows(day, loc.lat, loc.lng, '')
    .filter((w) => w.isAuspicious)
    .filter((w) => {
      const start = new Date(w.start);
      return new Date(w.end).getTime() > now.getTime()
        && start.toLocaleDateString('en-CA', { timeZone: tz }) === dateKey
        && localHour(start) < 22;
    })
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((w, id) => ({ id, label: `${time(new Date(w.start))} – ${time(new Date(w.end))}`, quality: shortQuality(w) }));

  return {
    dateLabel: day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    localTime: time(now),
    place: `${loc.label ?? 'the user\'s location'} (${tz})`,
    tithi: `${tithi.paksha} ${tithi.name}`,
    sunrise: time(sunrise),
    sunset: time(sunset),
    transits,
    windows,
  };
}

/** Turns window ids into the exact computed labels; never trusts a model-written time. */
export function toFocusAreas(model: ModelFocusArea[], windows: DailyWindow[]): DailyFocusArea[] {
  const used = new Set<number>();
  return model.slice(0, 3).map((f) => {
    let window = windows.find((w) => w.id === f.windowId);
    if (!window) window = windows.find((w) => !used.has(w.id));
    if (window) used.add(window.id);
    return {
      area: f.area,
      action: f.action.trim(),
      timeRange: window?.label ?? NO_WINDOW_LABEL,
      suggestion: f.suggestion.trim(),
      reasoning: f.jyotishBasis.trim(),
    };
  });
}

export async function handleDailyWisdomRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json() as DailyBody;
    const { birthDt, birthPlace, nakshatra, rashi } = body;

    if (!birthDt || !birthPlace) {
      return Response.json({ error: 'birthDt and birthPlace are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);
    // Natal chart uses the birth place; today's windows use where the user is now.
    const today = buildTodayContext(chart, resolveLocation(body, request.headers), new Date());

    const raw = await claudeChat([
      { role: 'system', content: DAILY_SYSTEM },
      { role: 'user', content: buildDailyPrompt(chart, { nakshatra, rashi }, today) },
    ], { schema: DAILY_SCHEMA });

    let parsed: { focusAreas: ModelFocusArea[] };
    try {
      parsed = parseModelJson(raw, ['focusAreas']);
    } catch {
      return Response.json({ error: 'AI response parse error' }, { status: 502 });
    }

    return Response.json({
      chart,
      focusAreas: Array.isArray(parsed.focusAreas) ? toFocusAreas(parsed.focusAreas, today.windows) : [],
    });
  } catch (err: unknown) {
    return serverErrorResponse('daily', err, 500);
  }
}
