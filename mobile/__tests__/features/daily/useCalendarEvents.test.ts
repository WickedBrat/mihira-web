import { getLocalCalendarDateKey } from '@/features/daily/useCalendarEvents';

describe('getLocalCalendarDateKey', () => {
  it('formats a local calendar date for Supabase queries', () => {
    expect(getLocalCalendarDateKey(new Date(2026, 4, 10, 3, 13))).toBe('2026-05-10');
  });

  it('zero-pads month and day', () => {
    expect(getLocalCalendarDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
