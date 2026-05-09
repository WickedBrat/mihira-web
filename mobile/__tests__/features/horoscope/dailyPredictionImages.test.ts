import { getDailyPredictionImage, normalizeDailyPredictionGender } from '@/features/horoscope/dailyPredictionImages';

describe('daily prediction images', () => {
  it('defaults to girl images', () => {
    expect(getDailyPredictionImage('Focus', undefined).uri).toBe(
      'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira/girl/focus.png'
    );
  });

  it('uses boy images for male gender values', () => {
    expect(getDailyPredictionImage('Work', 'male').uri).toBe(
      'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira/boy/work.png'
    );
  });

  it('maps old focus-area names to available mihira image files', () => {
    expect(getDailyPredictionImage('Material Decisions', 'girl').uri).toContain('/mihira/girl/decision.png');
    expect(getDailyPredictionImage('Partnership', 'boy').uri).toContain('/mihira/boy/partnership.png');
    expect(getDailyPredictionImage('Domestic matters', 'girl').uri).toContain('/mihira/girl/partnership.png');
  });

  it('normalizes unknown gender values to girl', () => {
    expect(normalizeDailyPredictionGender('non-binary')).toBe('girl');
    expect(normalizeDailyPredictionGender(null)).toBe('girl');
  });
});
