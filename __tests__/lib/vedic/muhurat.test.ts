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
