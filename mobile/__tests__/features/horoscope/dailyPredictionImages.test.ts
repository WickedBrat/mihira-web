import { getDailyPredictionImage, normalizeDailyPredictionGender } from '@/features/horoscope/dailyPredictionImages';

describe('daily prediction images', () => {
  it('defaults to girl images', () => {
    expect(getDailyPredictionImage('Focus', undefined).uri).toBe(
      'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira/girl/focus.webp'
    );
  });

  it('uses boy images for male gender values', () => {
    expect(getDailyPredictionImage('Work', 'male').uri).toBe(
      'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira/boy/work.webp'
    );
  });

  it('maps old focus-area names to available mihira image files', () => {
    expect(getDailyPredictionImage('Material Decisions', 'girl').uri).toContain('/mihira/girl/decision.webp');
    expect(getDailyPredictionImage('Partnership', 'boy').uri).toContain('/mihira/boy/partnership.webp');
    expect(getDailyPredictionImage('Domestic matters', 'girl').uri).toContain('/mihira/girl/partnership.webp');
  });

  it('uses girl images for female gender values', () => {
    expect(getDailyPredictionImage('Focus', 'female').uri).toContain('/mihira/girl/focus.webp');
    expect(getDailyPredictionImage('Focus', 'woman').uri).toContain('/mihira/girl/focus.webp');
  });

  it('normalizes unknown gender values to girl', () => {
    expect(normalizeDailyPredictionGender('non-binary')).toBe('girl');
    expect(normalizeDailyPredictionGender(null)).toBe('girl');
  });
});
