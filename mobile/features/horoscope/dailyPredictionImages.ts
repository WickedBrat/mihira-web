export type DailyPredictionGender = 'boy' | 'girl';

const BASE_URL = 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira';

const IMAGE_BY_AREA: Record<string, string> = {
  // Ambition / Career
  Ambition: 'ambition',
  Work: 'work',
  Career: 'work',
  'Public presence': 'public-presence',
  'Public Presence': 'public-presence',
  Networking: 'networking',
  Community: 'community',

  // Mind / Knowledge
  Knowledge: 'knowledge',
  Learning: 'knowledge',
  Reading: 'reading',
  Writing: 'writing',
  Speaking: 'speaking',
  'Problem solving': 'problem-solving',
  'Problem Solving': 'problem-solving',
  Focus: 'focus',

  // Decisions / Finance
  Decisions: 'decision',
  Decision: 'decision',
  'Material decisions': 'decision',
  'Material Decisions': 'decision',
  Financial: 'financial',
  Money: 'money',
  Negotiations: 'negotiations',
  Correspondence: 'writing',

  // Relationships
  Romance: 'romance',
  Partnership: 'partnership',
  'Social bonds': 'social-bonds',
  'Social Bonds': 'social-bonds',

  // Family / Home
  Home: 'partnership',
  'Domestic matters': 'partnership',
  'Domestic Matters': 'partnership',
  Domestic: 'partnership',
  Lineage: 'lineage',

  // Self-care / Wellness
  Rest: 'rest',
  Health: 'health',
  Body: 'physical-vitality',
  Routines: 'rest',
  Routine: 'rest',
  Exercise: 'exercise',
  Healing: 'healing',
  'Physical vitality': 'physical-vitality',
  'Physical Vitality': 'physical-vitality',
  Movement: 'movement',
  Meditation: 'meditation',

  // Creativity / Spirit
  Art: 'art',
  Making: 'art',
  Ritual: 'ritual',
};

const FALLBACK_IMAGE = 'focus';

export function normalizeDailyPredictionGender(gender: string | null | undefined): DailyPredictionGender {
  const normalized = gender?.trim().toLowerCase();

  if (normalized === 'boy' || normalized === 'male' || normalized === 'man' || normalized === 'masculine') {
    return 'boy';
  }

  if (normalized === 'girl' || normalized === 'female' || normalized === 'woman' || normalized === 'feminine') {
    return 'girl';
  }

  return 'girl';
}

export function getDailyPredictionImage(area: string, gender: string | null | undefined) {
  const imageName = IMAGE_BY_AREA[area] ?? FALLBACK_IMAGE;
  const imageGender = normalizeDailyPredictionGender(gender);

  return { uri: `${BASE_URL}/${imageGender}/${imageName}.webp` };
}
