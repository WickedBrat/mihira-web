import { getCalendarImageUri } from '@/features/daily/calendarImageUrl';

describe('getCalendarImageUri', () => {
  it('converts GitHub blob URLs to raw image URLs', () => {
    expect(
      getCalendarImageUri('https://github.com/WickedBrat/images/blob/master/mihira/calendar/24.webp')
    ).toBe('https://raw.githubusercontent.com/WickedBrat/images/master/mihira/calendar/24.webp');
  });

  it('leaves direct image URLs unchanged', () => {
    expect(getCalendarImageUri('https://example.com/calendar/24.webp')).toBe(
      'https://example.com/calendar/24.webp'
    );
  });

  it('returns null for missing image URLs', () => {
    expect(getCalendarImageUri(null)).toBeNull();
  });
});
