import { getLakshmiPujaMuhurat, getVrishabhaPradoshWindow, makarSankrantiInstant } from '@/lib/vedic/lakshmiPuja';

// Independent reference: the 2026-10-07 blog table (ephemeris + Lahiri,
// cross-checked against published Drik-style US city timings).
const CITIES: [string, number, number, string, string, string][] = [
  ['San Jose', 37.3382, -121.8863, 'America/Los_Angeles', '17:21', '19:12'],
  ['Seattle', 47.6062, -122.3321, 'America/Los_Angeles', '16:56', '18:38'],
  ['Dallas', 32.7767, -96.797, 'America/Chicago', '17:51', '19:44'],
  ['Austin', 30.2672, -97.7431, 'America/Chicago', '17:59', '19:54'],
  ['Chicago', 41.8781, -87.6298, 'America/Chicago', '16:54', '18:41'],
  ['Atlanta', 33.749, -84.388, 'America/New_York', '17:59', '19:52'],
  ['Edison', 40.5187, -74.4121, 'America/New_York', '17:04', '18:53'],
  ['Boston', 42.3601, -71.0589, 'America/New_York', '16:46', '18:33'],
];
const hm = (d: Date, tz: string) => d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
const min = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

describe('Lakshmi Puja muhurat, Diwali 2026', () => {
  it.each(CITIES)('%s matches reference within 3 min', (_n, lat, lng, tz, s, e) => {
    const r = getLakshmiPujaMuhurat(new Date(Date.UTC(2026, 10, 8, 12)), lat, lng);
    expect(r.amavasyaAtSunset).toBe(true);
    expect(r.pujaStart && r.pujaEnd).toBeTruthy();
    const gotS = hm(r.pujaStart!, tz), gotE = hm(r.pujaEnd!, tz);
    // eslint-disable-next-line no-console
    console.log(_n, gotS, gotE, 'sunset', hm(r.sunset, tz), 'pradosh end', hm(r.pradoshEnd, tz));
    expect(Math.abs(min(gotS) - min(s))).toBeLessThanOrEqual(3);
    expect(Math.abs(min(gotE) - min(e))).toBeLessThanOrEqual(3);
  });
});

describe('Dhanteras 2026 (Fri Nov 6) puja window', () => {
  it.each([
    ['San Jose', 37.3382, -121.8863, 'America/Los_Angeles', '17:29', '19:20'],
    ['Chicago', 41.8781, -87.6298, 'America/Chicago', '17:02', '18:49'],
    ['Edison', 40.5187, -74.4121, 'America/New_York', '17:12', '19:01'],
  ])('%s', (_n, lat, lng, tz, s, e) => {
    const r = getVrishabhaPradoshWindow(new Date(Date.UTC(2026, 10, 6, 12)), lat as number, lng as number);
    expect(Math.abs(min(hm(r.pujaStart!, tz as string)) - min(s as string))).toBeLessThanOrEqual(3);
    expect(Math.abs(min(hm(r.pujaEnd!, tz as string)) - min(e as string))).toBeLessThanOrEqual(3);
  });
});

describe('Makar Sankranti 2027', () => {
  it('Sun enters sidereal Capricorn on 14 Jan 2027 (UTC)', () => {
    const t = makarSankrantiInstant(new Date(Date.UTC(2027, 0, 14)));
    // eslint-disable-next-line no-console
    console.log('sankranti', t.toISOString());
    expect(t.toISOString().slice(0, 10)).toMatch(/2027-01-1[45]/);
  });
});
