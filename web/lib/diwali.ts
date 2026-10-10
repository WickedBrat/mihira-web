// lib/diwali.ts — Diwali 2026 Lakshmi Puja timings for US cities, computed
// from the same engine as the app (mobile/lib/vedic). Nothing is hard-coded
// except city coordinates.
import tzlookup from 'tz-lookup';
import { getLakshmiPujaMuhurat } from '@/lib/vedic/lakshmiPuja';

export const DIWALI_2026 = { y: 2026, m: 10, d: 8 } as const; // month is 0-based
export const DIWALI_DATE_LABEL = 'Sunday, November 8, 2026';

export interface DiwaliCity {
  slug: string;
  name: string;      // display name
  region: string;    // e.g. "New Jersey"
  metro?: string;    // e.g. "NYC / New Jersey"
  lat: number;
  lng: number;
}

export const DIWALI_CITIES: DiwaliCity[] = [
  { slug: 'edison-nj', name: 'Edison', region: 'New Jersey', metro: 'NYC / New Jersey', lat: 40.5187, lng: -74.4121 },
  { slug: 'jersey-city-nj', name: 'Jersey City', region: 'New Jersey', metro: 'NYC / New Jersey', lat: 40.7178, lng: -74.0431 },
  { slug: 'new-york-ny', name: 'New York City', region: 'New York', metro: 'NYC / New Jersey', lat: 40.7128, lng: -74.006 },
  { slug: 'san-jose-ca', name: 'San Jose', region: 'California', metro: 'Bay Area', lat: 37.3382, lng: -121.8863 },
  { slug: 'fremont-ca', name: 'Fremont', region: 'California', metro: 'Bay Area', lat: 37.5485, lng: -121.9886 },
  { slug: 'san-francisco-ca', name: 'San Francisco', region: 'California', metro: 'Bay Area', lat: 37.7749, lng: -122.4194 },
  { slug: 'seattle-wa', name: 'Seattle', region: 'Washington', metro: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { slug: 'redmond-wa', name: 'Redmond', region: 'Washington', metro: 'Seattle', lat: 47.674, lng: -122.1215 },
  { slug: 'dallas-tx', name: 'Dallas', region: 'Texas', metro: 'Dallas–Fort Worth', lat: 32.7767, lng: -96.797 },
  { slug: 'frisco-tx', name: 'Frisco', region: 'Texas', metro: 'Dallas–Fort Worth', lat: 33.1507, lng: -96.8236 },
  { slug: 'austin-tx', name: 'Austin', region: 'Texas', metro: 'Austin', lat: 30.2672, lng: -97.7431 },
  { slug: 'houston-tx', name: 'Houston', region: 'Texas', lat: 29.7604, lng: -95.3698 },
  { slug: 'chicago-il', name: 'Chicago', region: 'Illinois', metro: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { slug: 'atlanta-ga', name: 'Atlanta', region: 'Georgia', metro: 'Atlanta', lat: 33.749, lng: -84.388 },
  { slug: 'washington-dc', name: 'Washington, DC', region: 'District of Columbia', lat: 38.9072, lng: -77.0369 },
  { slug: 'boston-ma', name: 'Boston', region: 'Massachusetts', lat: 42.3601, lng: -71.0589 },
  { slug: 'philadelphia-pa', name: 'Philadelphia', region: 'Pennsylvania', lat: 39.9526, lng: -75.1652 },
  { slug: 'raleigh-nc', name: 'Raleigh', region: 'North Carolina', lat: 35.7796, lng: -78.6382 },
  { slug: 'charlotte-nc', name: 'Charlotte', region: 'North Carolina', lat: 35.2271, lng: -80.8431 },
  { slug: 'detroit-mi', name: 'Detroit', region: 'Michigan', lat: 42.3314, lng: -83.0458 },
  { slug: 'minneapolis-mn', name: 'Minneapolis', region: 'Minnesota', lat: 44.9778, lng: -93.265 },
  { slug: 'denver-co', name: 'Denver', region: 'Colorado', lat: 39.7392, lng: -104.9903 },
  { slug: 'phoenix-az', name: 'Phoenix', region: 'Arizona', lat: 33.4484, lng: -112.074 },
  { slug: 'los-angeles-ca', name: 'Los Angeles', region: 'California', lat: 34.0522, lng: -118.2437 },
];

export interface LakshmiPujaTimes {
  timeZone: string;
  tzAbbr: string;
  sunset: string;
  pujaStart: string | null;
  pujaEnd: string | null;
  pradoshEnd: string;
  pujaStartISO: string | null;
  pujaEndISO: string | null;
  durationMin: number | null;
}

function fmt(d: Date, timeZone: string) {
  return d.toLocaleTimeString('en-US', { timeZone, hour: 'numeric', minute: '2-digit' });
}

export function lakshmiPujaFor(lat: number, lng: number): LakshmiPujaTimes {
  const timeZone = tzlookup(lat, lng);
  const r = getLakshmiPujaMuhurat(new Date(Date.UTC(DIWALI_2026.y, DIWALI_2026.m, DIWALI_2026.d, 12)), lat, lng);
  const tzAbbr = r.sunset.toLocaleTimeString('en-US', { timeZone, timeZoneName: 'short' }).split(' ').pop() ?? '';
  return {
    timeZone,
    tzAbbr,
    sunset: fmt(r.sunset, timeZone),
    pujaStart: r.pujaStart ? fmt(r.pujaStart, timeZone) : null,
    pujaEnd: r.pujaEnd ? fmt(r.pujaEnd, timeZone) : null,
    pradoshEnd: fmt(r.pradoshEnd, timeZone),
    pujaStartISO: r.pujaStart?.toISOString() ?? null,
    pujaEndISO: r.pujaEnd?.toISOString() ?? null,
    durationMin: r.pujaStart && r.pujaEnd ? Math.round((r.pujaEnd.getTime() - r.pujaStart.getTime()) / 60000) : null,
  };
}

export function getCity(slug: string) {
  return DIWALI_CITIES.find((c) => c.slug === slug);
}

export function cityLabel(c: Pick<DiwaliCity, 'name' | 'region'>) {
  return c.name === 'Washington, DC' ? c.name : `${c.name}, ${c.region}`;
}

/** Google Calendar "add event" link for the puja window. */
export function googleCalendarLink(label: string, t: LakshmiPujaTimes) {
  if (!t.pujaStartISO || !t.pujaEndISO) return null;
  const z = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Lakshmi Puja muhurat (Diwali 2026)',
    dates: `${z(t.pujaStartISO)}/${z(t.pujaEndISO)}`,
    details: `Lakshmi Puja window for ${label}, computed for your local sunset. Via Mihira — https://www.getmihira.com/diwali`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function whatsappShareText(label: string, t: LakshmiPujaTimes, url: string) {
  return `🪔 Diwali 2026 — Lakshmi Puja in ${label}: ${t.pujaStart} – ${t.pujaEnd} ${t.tzAbbr} on Sunday, Nov 8.\nWorked out for our local sunset, not converted from India time.\nOther cities: ${url}`;
}
