import { parseModelJson } from '../../ai/parseModelJson';
import { geminiChat } from '../../ai/gemini';
import {
  MUHURAT_SYSTEM,
  buildMuhuratPrompt,
  MUHURAT_RANK_SYSTEM,
  buildMuhuratRankPrompt,
  type MuhuratCandidate,
  type MuhuratDayContext,
} from '../../ai/prompts';
import { serverErrorResponse } from '../errorResponse';
import { getMuhuratWindowsForRange, getTithiAt, sunriseSunset } from '../../vedic/muhurat';
import type { MuhuratWindow } from '../../vedic/types';

const MAX_LOCAL_RANGE_DAYS = 31;

export interface MuhuratLocation {
  lat: number;
  lng: number;
  timeZone: string;
  label: string | null;
  source: 'client' | 'ip';
}

interface MuhuratBody {
  eventDescription: string;
  startDate: string;
  endDate: string;
  lat?: number;
  lng?: number;
  timeZone?: string;
  locationLabel?: string;
}

function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function isValidCoord(lat: unknown, lng: unknown): boolean {
  return typeof lat === 'number' && typeof lng === 'number' &&
    Number.isFinite(lat) && Number.isFinite(lng) &&
    Math.abs(lat) <= 66 && Math.abs(lng) <= 180; // beyond ~66° there may be no sunrise
}

/**
 * Where to compute for. Prefer coordinates the app sends; otherwise fall back
 * to Vercel's IP geolocation headers so existing app builds (which send no
 * location) still get times for where the user actually is, not India.
 */
export function resolveLocation(body: MuhuratBody, headers: Headers): MuhuratLocation | null {
  if (isValidCoord(body.lat, body.lng)) {
    const tz = isValidTimeZone(body.timeZone) ? body.timeZone : (headers.get('x-vercel-ip-timezone') ?? 'UTC');
    return {
      lat: body.lat as number,
      lng: body.lng as number,
      timeZone: isValidTimeZone(tz) ? tz : 'UTC',
      label: body.locationLabel?.slice(0, 120) ?? null,
      source: 'client',
    };
  }

  const ipLat = parseFloat(headers.get('x-vercel-ip-latitude') ?? '');
  const ipLng = parseFloat(headers.get('x-vercel-ip-longitude') ?? '');
  const ipTz = headers.get('x-vercel-ip-timezone');
  if (isValidCoord(ipLat, ipLng) && isValidTimeZone(ipTz)) {
    const city = headers.get('x-vercel-ip-city');
    const region = headers.get('x-vercel-ip-country-region');
    const label = city ? [decodeURIComponent(city), region].filter(Boolean).join(', ') : null;
    return { lat: ipLat, lng: ipLng, timeZone: ipTz, label, source: 'ip' };
  }
  return null;
}

function localLabel(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function localDateKey(date: Date, timeZone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone }); // YYYY-MM-DD
}

const QUALITY_BASE: Record<string, number> = { Amrit: 8, Abhijit: 8, Shubh: 7, Labh: 7, Char: 5 };

function baseScore(w: MuhuratWindow): number {
  if (w.type === 'abhijit') return QUALITY_BASE.Abhijit;
  const key = Object.keys(QUALITY_BASE).find((k) => w.quality.startsWith(k));
  const night = w.quality.includes('(Night)') ? -1 : 0; // most rites prefer daylight
  return (key ? QUALITY_BASE[key] : 4) + night;
}

async function computeLocal(body: MuhuratBody, start: Date, end: Date, loc: MuhuratLocation) {
  const now = Date.now();
  const all = getMuhuratWindowsForRange(start, end, loc.lat, loc.lng, body.eventDescription)
    .filter((w) => w.isAuspicious && new Date(w.end).getTime() > now);

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
      const raw = await geminiChat('gemini-2.5-flash', [
        { role: 'system', content: MUHURAT_RANK_SYSTEM },
        { role: 'user', content: buildMuhuratRankPrompt(body.eventDescription, loc.label, loc.timeZone, days, candidates) },
      ]);
      const parsed = parseModelJson(raw, ['recommendation', 'suggestion', 'reasoning']) as {
        recommendation: string; confidence?: string; suggestion: string; reasoning: string;
        warnings?: string; festivalNote?: string | null; ranked?: { id: number; score: number }[];
      };
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
        reasoning: parsed.reasoning,
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
    const end = new Date(endDate);
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
    const rangeDays = (end.getTime() - start.getTime()) / 86400000;
    if (loc && rangeDays <= MAX_LOCAL_RANGE_DAYS) {
      return await computeLocal(body, start, end, loc);
    }

    // Legacy path: no location available (or very long range). Model-estimated, IST-based.
    const raw = await geminiChat('gemini-2.5-flash', [
      { role: 'system', content: MUHURAT_SYSTEM },
      { role: 'user', content: buildMuhuratPrompt(eventDescription, startDate, endDate) },
    ]);

    let parsed: {
      recommendation: string;
      confidence: string;
      suggestion: string;
      reasoning: string;
      warnings: string;
      festivalNote?: string | null;
      rankedWindows?: MuhuratWindow[];
    };
    try {
      parsed = parseModelJson(raw, ['recommendation', 'suggestion', 'reasoning']);
    } catch {
      return Response.json({ error: 'AI response parse error' }, { status: 502 });
    }

    const rankedWindows = (parsed.rankedWindows ?? [])
      .filter((window) => window.isAuspicious)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 10);

    return Response.json({
      rankedWindows,
      recommendation: parsed.recommendation,
      confidence: parsed.confidence ?? 'Medium',
      suggestion: parsed.suggestion,
      reasoning: parsed.reasoning,
      warnings: parsed.warnings ?? 'None',
      festivalNote: parsed.festivalNote ?? null,
      computedLocally: false,
    });
  } catch (err: unknown) {
    return serverErrorResponse('muhurat', err, 500);
  }
}
