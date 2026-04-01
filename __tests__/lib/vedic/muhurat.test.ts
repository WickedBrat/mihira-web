import { getChaughadiya, CHAUGHADIYA_SEQ, DAY_START } from '@/lib/vedic/muhurat';

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
