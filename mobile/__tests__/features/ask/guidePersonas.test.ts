import { GUIDES, getGuide } from '@/features/ask/guidePersonas';

describe('guidePersonas', () => {
  it('has exactly 9 guides', () => {
    expect(GUIDES).toHaveLength(9);
  });

  it('every guide has required fields', () => {
    for (const g of GUIDES) {
      expect(typeof g.name).toBe('string');
      expect(typeof g.emoji).toBe('string');
      expect(typeof g.essence).toBe('string');
      expect(typeof g.commitmentVerb).toBe('string');
      expect(typeof g.initialMessage).toBe('string');
    }
  });

  it('getGuide returns the matching guide', () => {
    const g = getGuide('Krishna');
    expect(g.name).toBe('Krishna');
    expect(g.emoji).toBe('🦚');
  });

  it('getGuide falls back to Krishna for unknown name', () => {
    const g = getGuide('Unknown');
    expect(g.name).toBe('Krishna');
  });
});
