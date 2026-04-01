// lib/vedic/muhurat.ts
import type { ChaughadiyaQuality, MuhuratWindow } from './types';
import { sunTropicalLongitude } from './ephemeris';
import { toJDE } from './ayanamsha';

export const CHAUGHADIYA_SEQ: ChaughadiyaQuality[] =
  ['Udveg','Char','Labh','Amrit','Kaal','Shubh','Rog'];

// Day starting index per weekday (0=Sun … 6=Sat)
export const DAY_START = [0, 3, 6, 2, 5, 1, 4];

const AUSPICIOUS: ChaughadiyaQuality[] = ['Amrit','Shubh','Labh','Char'];

/** Get Chaughadiya quality for a given period index. isNight=true uses night sequence. */
export function getChaughadiya(
  weekday: number,
  periodIndex: number,
  isNight: boolean
): { quality: ChaughadiyaQuality; isAuspicious: boolean } {
  const dayStart = DAY_START[weekday];
  const startIdx = isNight ? (dayStart + 5) % 7 : dayStart;
  const quality = CHAUGHADIYA_SEQ[(startIdx + periodIndex) % 7];
  return { quality, isAuspicious: AUSPICIOUS.includes(quality) };
}

function sunriseSunset(date: Date, lat: number, lng: number): { sunrise: Date; sunset: Date } {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const jde = toJDE(year, month, day, 12);
  const T = (jde - 2451545.0) / 36525;

  const sunLng = sunTropicalLongitude(jde);
  const eps = (23.439291 - 0.013004 * T) * Math.PI / 180;
  const declination = Math.asin(Math.sin(eps) * Math.sin(sunLng * Math.PI / 180));
  const latRad = lat * Math.PI / 180;

  const cosH = -Math.tan(latRad) * Math.tan(declination);
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;

  const L = (280.46646 + 36000.76983 * T) * Math.PI / 180;
  const M = (357.52911 + 35999.05029 * T) * Math.PI / 180;
  const e = 0.016708634 - 0.000042037 * T;
  const y = Math.pow(Math.tan(eps / 2), 2);
  const EoT = (y * Math.sin(2*L) - 2*e*Math.sin(M) + 4*e*y*Math.sin(M)*Math.cos(2*L)
    - 0.5*y*y*Math.sin(4*L) - 1.25*e*e*Math.sin(2*M)) * (180/Math.PI) * 4;

  const noon = 12 - (lng / 15) - (EoT / 60);
  const riseUT = noon - H / 15;
  const setUT  = noon + H / 15;

  const riseMs = Date.UTC(year, month-1, day) + riseUT * 3600000;
  const setMs  = Date.UTC(year, month-1, day) + setUT  * 3600000;
  return { sunrise: new Date(riseMs), sunset: new Date(setMs) };
}

/** Returns all MuhuratWindow[] for a given date + location. */
export function getMuhuratWindows(
  date: Date,
  lat: number,
  lng: number,
  _eventType: string
): MuhuratWindow[] {
  const { sunrise, sunset } = sunriseSunset(date, lat, lng);
  const weekday = date.getUTCDay();
  const windows: MuhuratWindow[] = [];

  const dayDuration = sunset.getTime() - sunrise.getTime();
  const periodMs = dayDuration / 8;

  for (let i = 0; i < 8; i++) {
    const { quality, isAuspicious } = getChaughadiya(weekday, i, false);
    const start = new Date(sunrise.getTime() + i * periodMs);
    const end   = new Date(sunrise.getTime() + (i + 1) * periodMs);
    windows.push({
      start: start.toISOString(), end: end.toISOString(),
      quality: `${quality} (${isAuspicious ? 'Auspicious' : 'Inauspicious'})`,
      type: 'chaughadiya', isAuspicious,
    });
  }

  const nextSunrise = new Date(sunrise.getTime() + 24 * 3600000);
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const nightPeriodMs = nightDuration / 8;
  for (let i = 0; i < 8; i++) {
    const { quality, isAuspicious } = getChaughadiya(weekday, i, true);
    const start = new Date(sunset.getTime() + i * nightPeriodMs);
    const end   = new Date(sunset.getTime() + (i + 1) * nightPeriodMs);
    windows.push({
      start: start.toISOString(), end: end.toISOString(),
      quality: `${quality} (Night)`,
      type: 'chaughadiya', isAuspicious,
    });
  }

  // Abhijit Muhurat: solar noon ± 24 min (skip Wednesday)
  if (weekday !== 3) {
    const dayDur = sunset.getTime() - sunrise.getTime();
    const noon = new Date(sunrise.getTime() + dayDur / 2);
    windows.push({
      start: new Date(noon.getTime() - 24 * 60000).toISOString(),
      end:   new Date(noon.getTime() + 24 * 60000).toISOString(),
      quality: 'Excellent (Abhijit Muhurat)',
      type: 'abhijit', isAuspicious: true,
    });
  }

  return windows;
}
