import { parseModelJson } from '../../ai/parseModelJson';
import { claudeChat } from '../../ai/claude';
import {
  MUHURAT_SYSTEM,
  MUHURAT_SCHEMA,
  MUHURAT_ESTIMATE_WARNING,
  buildMuhuratPrompt,
  MUHURAT_RANK_SYSTEM,
  MUHURAT_RANK_SCHEMA,
  buildMuhuratRankPrompt,
  type MuhuratCandidate,
  type MuhuratDayContext,
} from '../../ai/prompts';
import { serverErrorResponse } from '../errorResponse';
import { resolveLocation, type LocationHints, type RequestLocation } from '../location';
import { getMuhuratWindowsForRange, getTithiAt, sunriseSunset } from '../../vedic/muhurat';
import type { MuhuratWindow } from '../../vedic/types';

export { resolveLocation };
export type MuhuratLocation = RequestLocation;

/** Ranges up to this length send every auspicious window to the model. */
const FULL_DETAIL_RANGE_DAYS = 31;
/** Longest range computed locally; longer requests are clamped (and the user told). */
const MAX_LOCAL_RANGE_DAYS = 120;

interface MuhuratBody extends LocationHints {
  eventDescription: string;
  startDate: string;
  endDate: string;
}

interface RankPayload extends Record<string, unknown> {
  recommendation: string;
  confidence?: string;
  suggestion: string;
  technicalBasis: string;
  warnings?: string;
  festivalNote?: string | null;
  ranked?: { id: number; score: number }[];
}

interface EstimatePayload extends Record<string, unknown> {
  recommendation: string;
  confidence?: string;
  suggestion: string;
  technicalBasis: string;
  warnings?: string;
  festivalNote?: string | null;
  rankedWindows?: Omit<MuhuratWindow, 'isAuspicious'>[];
}

function localLabel(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function localDateKey(date: Date, timeZone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone }); // YYYY-MM-DD
}

function joinWarnings(...parts: (string | null | undefined)[]): string {
  const real = parts.filter((p): p is string => Boolean(p && p.trim() && p.trim() !== 'None'));
  return real.length ? real.join(' ') : 'None';
}

const QUALITY_BASE: Record<string, number> = { Amrit: 8, Abhijit: 8, Shubh: 7, Labh: 7, Char: 5 };

function baseScore(w: MuhuratWindow): number {
  if (w.type === 'abhijit') return QUALITY_BASE.Abhijit;
  const key = Object.keys(QUALITY_BASE).find((k) => w.quality.startsWith(k));
  const night = w.quality.includes('(Night)') ? -1 : 0; // most rites prefer daylight
  return (key ? QUALITY_BASE[key] : 4) + night;
}

/** For long ranges, keep only each day's strongest windows so the prompt stays small. */
function capPerDay(windows: MuhuratWindow[], perDay: number, timeZone: string): MuhuratWindow[] {
  const byDay = new Map<string, MuhuratWindow[]>();
  for (const w of windows) {
    const key = localDateKey(new Date(w.start), timeZone);
    byDay.set(key, [...(byDay.get(key) ?? []), w]);
  }
  return [...byDay.values()]
    .flatMap((day) => [...day].sort((a, b) => baseScore(b) - baseScore(a) || a.start.localeCompare(b.start)).slice(0, perDay))
    .sort((a, b) => a.start.localeCompare(b.start));
}

async function computeLocal(body: MuhuratBody, start: Date, end: Date, loc: RequestLocation, clampNote: string | null) {
  const now = Date.now();
  const rangeDays = (end.getTime() - start.getTime()) / 86400000;
  let all = getMuhuratWindowsForRange(start, end, loc.lat, loc.lng, body.eventDescription)
    .filter((w) => w.isAuspicious && new Date(w.end).getTime() > now);
  if (rangeDays > FULL_DETAIL_RANGE_DAYS) {
    all = capPerDay(all, rangeDays > 62 ? 2 : 3, loc.timeZone);
  }

  // Day context: tithi at local sunrise for each date in range
  const days: MuhuratDayContext[] = [];
  const cursor = new Date(start);
  cursor.setUTCHours(12, 0, 0, 0);
  const last = new Date(end);
  last.setUTCHours(12, 0, 0, 0);
  while (cursor.getTime() <= last.getTime()) {
    const { sunrise, sunset } = sunriseSunset(new Date(cursor), loc.lat, loc.lng);
    const tithi = getTithiAt(sunrise);
    days.push({
      date: localDateKey(sunrise, loc.timeZone),
      weekday: sunrise.toLocaleDateString('en-US', { timeZone: loc.timeZone, weekday: 'long' }),
      tithi: `${tithi.paksha} ${tithi.name}`,
      sunrise: sunrise.toLocaleTimeString('en-US', { timeZone: loc.timeZone, hour: 'numeric', minute: '2-digit' }),
      sunset: sunset.toLocaleTimeString('en-US', { timeZone: loc.timeZone, hour: 'numeric', minute: '2-digit' }),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const candidates: MuhuratCandidate[] = all.map((w, i) => ({
    id: i,
    local: `${localLabel(w.start, loc.timeZone)} – ${new Date(w.end).toLocaleTimeString('en-US', { timeZone: loc.timeZone, hour: 'numeric', minute: '2-digit' })}`,
    date: localDateKey(new Date(w.start), loc.timeZone),
    quality: w.quality,
    baseScore: baseScore(w),
  }));

  const fallback = () => [...all]
    .map((w) => ({ ...w, score: baseScore(w) }))
    .sort((a, b) => b.score - a.score || a.start.localeCompare(b.start))
    .slice(0, 10);

  let rankedWindows: MuhuratWindow[] = fallback();
  let narrative = {
    recommendation: 'Yes',
    confidence: 'Medium',
    suggestion: rankedWindows[0]
      ? `The strongest window in your range is ${localLabel(rankedWindows[0].start, loc.timeZone)} (${rankedWindows[0].quality}).`
      : 'No auspicious windows remain in this range — try extending the dates.',
    reasoning: 'Windows are Chaughadiya and Abhijit periods computed from your local sunrise and sunset.',
    warnings: 'None',
    festivalNote: null as string | null,
  };

  if (candidates.length) {
    try {
      const raw = await claudeChat([
        { role: 'system', content: MUHURAT_RANK_SYSTEM },
        { role: 'user', content: buildMuhuratRankPrompt(body.eventDescription, loc.label, loc.timeZone, days, candidates, clampNote ?? undefined) },
      ], { schema: MUHURAT_RANK_SCHEMA });
      const parsed = parseModelJson<RankPayload>(raw, ['recommendation', 'suggestion', 'technicalBasis']);
      const seen = new Set<number>();
      const picked = (parsed.ranked ?? [])
        .filter((r) => Number.isInteger(r.id) && all[r.id] && !seen.has(r.id) && seen.add(r.id))
        .map((r) => ({ ...all[r.id], score: Math.max(1, Math.min(10, Math.round(r.score))) }))
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 10);
      if (picked.length) rankedWindows = picked;
      narrative = {
        recommendation: parsed.recommendation,
        confidence: parsed.confidence ?? 'Medium',
        suggestion: parsed.suggestion,
        reasoning: parsed.technicalBasis,
        warnings: parsed.warnings ?? 'None',
        festivalNote: parsed.festivalNote ?? null,
      };
    } catch (err) {
      console.error('[muhurat] ranking failed, using computed order', err);
    }
  }

  return Response.json({
    rankedWindows,
    ...narrative,
    warnings: joinWarnings(clampNote, narrative.warnings),
    location: { label: loc.label, timeZone: loc.timeZone, source: loc.source },
    computedLocally: true,
  });
}

export async function handleMuhuratWisdomRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json() as MuhuratBody;
    const { eventDescription, startDate, endDate } = body;

    if (!eventDescription || !startDate || !endDate) {
      return Response.json(
        { error: 'eventDescription, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    let end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return Response.json({ error: 'Invalid date range' }, { status: 400 });
    }

    if (start.getTime() > end.getTime()) {
      return Response.json({ error: 'Start date must be before end date' }, { status: 400 });
    }

    // Allow up to 14h of slack: clients send local noon, and the server runs in UTC.
    if (start.getTime() < Date.now() - 36 * 3600000) {
      return Response.json({ error: 'Start date must be today or a future date' }, { status: 400 });
    }

    const loc = resolveLocation(body, request.headers);
    if (loc) {
      let clampNote: string | null = null;
      if ((end.getTime() - start.getTime()) / 86400000 > MAX_LOCAL_RANGE_DAYS) {
        end = new Date(start.getTime() + MAX_LOCAL_RANGE_DAYS * 86400000);
        clampNote = `Only the first ${MAX_LOCAL_RANGE_DAYS} days of your range were searched, through ${end.toLocaleDateString('en-US', { timeZone: loc.timeZone, month: 'long', day: 'numeric', year: 'numeric' })}.`;
      }
      return await computeLocal(body, start, end, loc, clampNote);
    }

    // No location at all (e.g. local dev without IP headers): model-estimated, IST-based.
    const raw = await claudeChat([
      { role: 'system', content: MUHURAT_SYSTEM },
      { role: 'user', content: buildMuhuratPrompt(eventDescription, startDate, endDate) },
    ], { schema: MUHURAT_SCHEMA });

    let parsed: EstimatePayload;
    try {
      parsed = parseModelJson<EstimatePayload>(raw, ['recommendation', 'suggestion', 'technicalBasis']);
    } catch {
      return Response.json({ error: 'AI response parse error' }, { status: 502 });
    }

    const rankedWindows: MuhuratWindow[] = (parsed.rankedWindows ?? [])
      .map((window) => ({ ...window, isAuspicious: true }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 10);

    return Response.json({
      rankedWindows,
      recommendation: parsed.recommendation,
      confidence: parsed.confidence ?? 'Medium',
      suggestion: parsed.suggestion,
      reasoning: parsed.technicalBasis,
      warnings: joinWarnings(MUHURAT_ESTIMATE_WARNING, parsed.warnings),
      festivalNote: parsed.festivalNote ?? null,
      computedLocally: false,
    });
  } catch (err: unknown) {
    return serverErrorResponse('muhurat', err, 500);
  }
}
