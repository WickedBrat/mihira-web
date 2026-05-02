import { wholeSignHouse, signIndex } from '@/lib/vedic/houses';

describe('signIndex', () => {
  it('returns 0 for 0°', () => expect(signIndex(0)).toBe(0));
  it('returns 0 for 29.9°', () => expect(signIndex(29.9)).toBe(0));
  it('returns 1 for 30°', () => expect(signIndex(30)).toBe(1));
  it('returns 11 for 350°', () => expect(signIndex(350)).toBe(11));
});

describe('wholeSignHouse', () => {
  it('lagna and planet in same sign → house 1', () => {
    expect(wholeSignHouse(0, 0)).toBe(1);
  });
  it('planet 1 sign ahead of lagna → house 2', () => {
    expect(wholeSignHouse(1, 0)).toBe(2);
  });
  it('wraps correctly: planet at Pisces (11), lagna at Aries (0) → house 12', () => {
    expect(wholeSignHouse(11, 0)).toBe(12);
  });
  it('planet at Aries (0), lagna at Taurus (1) → house 12', () => {
    expect(wholeSignHouse(0, 1)).toBe(12);
  });
});
