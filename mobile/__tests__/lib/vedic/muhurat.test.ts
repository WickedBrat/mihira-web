import { getChaughadiya, getMuhuratWindowsForRange } from '@/lib/vedic/muhurat';

describe('getChaughadiya', () => {
  it('Sunday day period 0 is Udveg', () => {
    const result = getChaughadiya(0, 0, false);
    expect(result.quality).toBe('Udveg');
    expect(result.isAuspicious).toBe(false);
  });
  it('Sunday day period 1 is Char', () => {
    expect(getChaughadiya(0, 1, false).quality).toBe('Char');
  });
  it('Monday day period 0 is Amrit (auspicious)', () => {
    const result = getChaughadiya(1, 0, false);
    expect(result.quality).toBe('Amrit');
    expect(result.isAuspicious).toBe(true);
  });
  it('Wednesday day period 0 is Labh (auspicious)', () => {
    expect(getChaughadiya(3, 0, false).isAuspicious).toBe(true);
    expect(getChaughadiya(3, 0, false).quality).toBe('Labh');
  });
});

describe('getMuhuratWindowsForRange', () => {
  it('returns windows across every day in the requested range', () => {
    const start = new Date(Date.UTC(2026, 3, 1, 12));
    const end = new Date(Date.UTC(2026, 3, 2, 12));

    const windows = getMuhuratWindowsForRange(start, end, 28.6139, 77.209, 'Travel planning');

    const uniqueDates = new Set(
      windows.map((window) => new Date(window.start).toISOString().slice(0, 10))
    );

    expect(uniqueDates.size).toBe(2);
    expect(windows.length).toBeGreaterThan(20);
  });
});

describe('sunriseSunset accuracy (refraction-corrected)', () => {
  const { sunriseSunset, getTithiAt } = require('@/lib/vedic/muhurat');
  const fmt = (d: Date, tz: string) =>
    d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: false });
  const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

  it('Edison NJ, 8 Nov 2026 is within 3 min of NOAA (06:36 / 16:43 EST)', () => {
    const { sunrise, sunset } = sunriseSunset(new Date(Date.UTC(2026, 10, 8, 12)), 40.5187, -74.4121);
    expect(Math.abs(toMin(fmt(sunrise, 'America/New_York')) - toMin('06:36'))).toBeLessThanOrEqual(3);
    expect(Math.abs(toMin(fmt(sunset, 'America/New_York')) - toMin('16:43'))).toBeLessThanOrEqual(3);
  });

  it('Diwali 2026 evening in the US falls on Amavasya', () => {
    // 8 Nov 2026, ~6pm EST = 23:00 UTC
    expect(getTithiAt(new Date(Date.UTC(2026, 10, 8, 23))).name).toBe('Amavasya');
  });
});

describe('resolveLocation', () => {
  const { resolveLocation } = require('@/lib/server/routes/muhurat');
  const base = { eventDescription: 'x', startDate: '', endDate: '' };

  it('prefers client coordinates', () => {
    const loc = resolveLocation({ ...base, lat: 47.6, lng: -122.3, timeZone: 'America/Los_Angeles' }, new Headers());
    expect(loc).toMatchObject({ source: 'client', timeZone: 'America/Los_Angeles' });
  });

  it('falls back to Vercel IP headers for old app builds', () => {
    const h = new Headers({
      'x-vercel-ip-latitude': '32.78', 'x-vercel-ip-longitude': '-96.80',
      'x-vercel-ip-timezone': 'America/Chicago', 'x-vercel-ip-city': 'Dallas', 'x-vercel-ip-country-region': 'TX',
    });
    expect(resolveLocation(base, h)).toMatchObject({ source: 'ip', label: 'Dallas, TX', timeZone: 'America/Chicago' });
  });

  it('returns null with no location signal', () => {
    expect(resolveLocation(base, new Headers())).toBeNull();
  });
});
