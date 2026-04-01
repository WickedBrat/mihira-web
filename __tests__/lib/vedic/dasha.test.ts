import { getCurrentDasha, getNakshatraLord } from '@/lib/vedic/dasha';

describe('getNakshatraLord', () => {
  it('Ashwini (idx 0) → Ketu', () => expect(getNakshatraLord(0)).toBe('Ketu'));
  it('Bharani (idx 1) → Venus', () => expect(getNakshatraLord(1)).toBe('Venus'));
  it('Magha (idx 9) → Ketu', () => expect(getNakshatraLord(9)).toBe('Ketu'));
});

describe('getCurrentDasha', () => {
  it('returns a string in "X-Y" format', () => {
    const result = getCurrentDasha(10, new Date('1990-01-01'), new Date('2024-01-01'));
    expect(result).toMatch(/^\w+-\w+$/);
  });
  it('returns valid lords only', () => {
    const LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
    const [maha, antar] = getCurrentDasha(0, new Date('1990-01-01'), new Date('1991-01-01')).split('-');
    expect(LORDS).toContain(maha);
    expect(LORDS).toContain(antar);
  });
});
