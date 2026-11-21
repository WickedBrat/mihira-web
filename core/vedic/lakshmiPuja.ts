// lib/vedic/lakshmiPuja.ts
// Diwali Lakshmi Puja muhurat for any location: the overlap of Pradosh Kaal
// (first fifth of the night) with Vrishabha (Taurus, a fixed sign) rising,
// on the evening Amavasya prevails. Pure functions — safe on server, web and device.
import { ascendantTropical, norm360, sunTropicalLongitude } from './ephemeris';
import { sunriseSunset, getTithiAt } from './muhurat';

/** Lahiri ayanamsha (degrees). Linear fit, good to ~0.01° for 1950–2050. */
export function lahiri(date: Date): number {
  const years = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400000);
  return 23.853 + years * (50.29 / 3600);
}

function jdUT(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function siderealAscendant(date: Date, lat: number, lng: number): number {
  return norm360(ascendantTropical(jdUT(date), lat, lng) - lahiri(date));
}

export interface LakshmiPujaResult {
  sunset: Date;
  pradoshStart: Date;
  pradoshEnd: Date;
  vrishabhaStart: Date | null;
  vrishabhaEnd: Date | null;
  pujaStart: Date | null;
  pujaEnd: Date | null;
  amavasyaAtSunset: boolean;
}

/**
 * @param dateUTCNoon The Diwali date as 12:00 UTC (e.g. Date.UTC(2026, 10, 8, 12)).
 */
export function getLakshmiPujaMuhurat(dateUTCNoon: Date, lat: number, lng: number): LakshmiPujaResult {
  const { sunset } = sunriseSunset(dateUTCNoon, lat, lng);
  const next = new Date(dateUTCNoon.getTime() + 86400000);
  const { sunrise: nextSunrise } = sunriseSunset(next, lat, lng);
  const night = nextSunrise.getTime() - sunset.getTime();
  const pradoshStart = sunset;
  const pradoshEnd = new Date(sunset.getTime() + night / 5);

  // Scan minute by minute from 2h before sunset to 6h after for Taurus (30°–60°) rising
  const isTaurus = (t: number) => {
    const a = siderealAscendant(new Date(t), lat, lng);
    return a >= 30 && a < 60;
  };
  const from = sunset.getTime() - 2 * 3600000;
  const to = sunset.getTime() + 6 * 3600000;
  let vStart: number | null = null;
  let vEnd: number | null = null;
  for (let t = from; t <= to; t += 60000) {
    const inT = isTaurus(t);
    if (inT && vStart === null && t > from) vStart = refine(t - 60000, t, isTaurus, true);
    if (!inT && vStart !== null) { vEnd = refine(t - 60000, t, isTaurus, false); break; }
  }

  let pujaStart: Date | null = null;
  let pujaEnd: Date | null = null;
  if (vStart !== null && vEnd !== null) {
    const s = Math.max(vStart, pradoshStart.getTime());
    const e = Math.min(vEnd, pradoshEnd.getTime());
    if (e > s) { pujaStart = new Date(s); pujaEnd = new Date(e); }
  }

  return {
    sunset,
    pradoshStart,
    pradoshEnd,
    vrishabhaStart: vStart !== null ? new Date(vStart) : null,
    vrishabhaEnd: vEnd !== null ? new Date(vEnd) : null,
    pujaStart,
    pujaEnd,
    amavasyaAtSunset: getTithiAt(sunset).name === 'Amavasya',
  };
}

/** Binary-search a boundary to ~1s between a (state != want) and b (state == want-ish). */
function refine(a: number, b: number, test: (t: number) => boolean, entering: boolean): number {
  for (let i = 0; i < 12; i++) {
    const m = (a + b) / 2;
    if (test(m) === entering) b = m; else a = m;
  }
  return b;
}

/** Same Pradosh ∩ Vrishabha window for any evening (e.g. Dhanteras). */
export const getVrishabhaPradoshWindow = getLakshmiPujaMuhurat;

/** Moment the Sun enters sidereal Capricorn (Makar Sankranti), searched within ±20 days of `near`. */
export function makarSankrantiInstant(near: Date): Date {
  const sid = (t: number) => norm360(sunTropicalLongitude(t / 86400000 + 2440587.5 + 69 / 86400) - lahiri(new Date(t)));
  let a = near.getTime() - 20 * 86400000;
  let b = near.getTime() + 20 * 86400000;
  // sid(a) < 270 <= sid(b)
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    if (sid(m) < 270) a = m; else b = m;
  }
  return new Date(b);
}
