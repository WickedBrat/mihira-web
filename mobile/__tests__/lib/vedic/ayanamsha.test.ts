import { toJDE, lahiriAyanamsha, toSidereal, parseBirthDt } from '@/lib/vedic/ayanamsha';

describe('toJDE', () => {
  it('returns 2451545.0 for J2000.0 (2000-Jan-1.5 UT)', () => {
    expect(toJDE(2000, 1, 1, 12)).toBeCloseTo(2451545.0, 1);
  });
  it('returns 2446895.5 for 1987-Apr-10 0h UT', () => {
    expect(toJDE(1987, 4, 10, 0)).toBeCloseTo(2446895.5, 1);
  });
});

describe('lahiriAyanamsha', () => {
  it('returns ~23.85 at J2000.0', () => {
    expect(lahiriAyanamsha(2451545.0)).toBeCloseTo(23.85, 1);
  });
});

describe('parseBirthDt', () => {
  it('parses DD/MM/YYYY, HH:MM AM format', () => {
    expect(parseBirthDt('15/08/1947, 12:00 AM')).toEqual({
      year: 1947, month: 8, day: 15, hour: 0, minute: 0,
    });
  });
  it('parses PM time correctly', () => {
    expect(parseBirthDt('01/01/1990, 03:30 PM')).toEqual({
      year: 1990, month: 1, day: 1, hour: 15, minute: 30,
    });
  });
  it('handles 12:00 PM as noon (12)', () => {
    expect(parseBirthDt('01/01/1990, 12:00 PM')).toMatchObject({ hour: 12 });
  });
  it('handles 12:00 AM as midnight (0)', () => {
    expect(parseBirthDt('01/01/1990, 12:00 AM')).toMatchObject({ hour: 0 });
  });
});
