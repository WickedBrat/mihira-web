// lib/onboardingStore.ts
// Module-level store for onboarding flow state, persisted in memory across screens.

export interface OnboardingData {
  painPoints: string[];
  persona: string | null;
  userName: string;
  birthDate: Date;
  birthTime: Date;
  birthPlace: string;
  unknownBirthTime: boolean;
  commitmentTier: string | null;
  firstQuestion: string;
}

const DEFAULT: OnboardingData = {
  painPoints: [],
  persona: null,
  userName: '',
  birthDate: new Date(2000, 0, 1),
  birthTime: new Date(2000, 0, 1, 9, 0),
  birthPlace: '',
  unknownBirthTime: false,
  commitmentTier: null,
  firstQuestion: '',
};

let _data: OnboardingData = { ...DEFAULT };

export function getOnboardingData(): OnboardingData {
  return _data;
}

export function setOnboardingData(partial: Partial<OnboardingData>): void {
  _data = { ..._data, ...partial };
}

export function resetOnboardingData(): void {
  _data = { ...DEFAULT };
}

// ─── Shared colour palette used across all onboarding screens ────────────────
export const OB = {
  bg:            '#07090C',
  saffron:       '#E07A5F',
  saffronDim:    'rgba(224,122,95,0.15)',
  saffronBorder: 'rgba(224,122,95,0.45)',
  gold:          '#D9A06F',
  goldDim:       'rgba(217,160,111,0.12)',
  goldBorder:    'rgba(217,160,111,0.4)',
  text:          '#F0EDE8',
  muted:         '#8E8880',
  card:          'rgba(255,255,255,0.04)',
  cardBorder:    'rgba(255,255,255,0.09)',
  divider:       'rgba(255,255,255,0.07)',
} as const;

// ─── Nakshatra soul insights ─────────────────────────────────────────────────
export const NAKSHATRA_INSIGHTS: Record<string, string> = {
  'Ashwini':            'Speed of a Thousand Horses. Built for pioneering, your path requires a steady hand.',
  'Bharani':            'Bearer of Life\'s Fullness. You carry the power of transformation and deep creation.',
  'Krittika':           'Lit by Celestial Fire. A cutter of illusion and a bearer of fierce clarity.',
  'Rohini':             'The Red Star\'s Grace. Your path is one of abundant creativity and magnetic presence.',
  'Mrigashira':         'The Seeking Deer. Restless brilliance is your gift—channel it into one true north.',
  'Ardra':              'The Storm\'s Eye. Through rupture comes renewal; your depth is your compass.',
  'Punarvasu':          'Return to Light. You are built to restore, revive, and return home to yourself.',
  'Pushya':             'The Nourisher. Your quiet power feeds others; guard that same energy for yourself.',
  'Ashlesha':           'The Coil of Wisdom. Your perception is serpentine—profound and transformative.',
  'Magha':              'The Throne of Ancestors. You carry legacy; walk with honour and fierce intention.',
  'Purva Phalguni':     'The Fig Tree\'s Shade. Pleasure and beauty are your teachers, not your enemies.',
  'Uttara Phalguni':    'The Patron\'s Gift. Steadfast and giving, your bonds define your greatness.',
  'Hasta':              'The Open Hand. Craftsmanship and clarity are your birthright.',
  'Chitra':             'The Brilliant Jewel. You see beauty as architecture; build worlds with your vision.',
  'Swati':              'The Independent Wind. Your freedom is sacred; honour your need for open sky.',
  'Vishakha':           'The Forked Branch. Between two paths lies your greatest strength—choose with fire.',
  'Anuradha':           'The Lotus in Water. Devotion and resilience—you bloom through what would break others.',
  'Jyeshtha':           'The Elder Star. Power and protection are yours; wisdom must temper both.',
  'Mula':               'Root and Dissolution. From deep roots you rise; do not fear the uprooting.',
  'Purva Ashadha':      'The Invincible One. Your drive is primordial; water cannot extinguish what you carry.',
  'Uttara Ashadha':     'The Universal Star. Final victory comes to those who serve a cause greater than self.',
  'Shravana':           'The Listener. Your gift is to hear what others miss—in silence, your power grows.',
  'Dhanishtha':         'The Drum of Abundance. Rhythm and prosperity follow those who march to their own beat.',
  'Shatabhisha':        'The Hundred Healers. Your solitude is research, not retreat; you seek truth alone.',
  'Purva Bhadrapada':   'The Burning Pair. Intensity purifies; let what must transform, transform.',
  'Uttara Bhadrapada':  'The Serpent of Depth. Still waters run deep; your stillness is your greatest strength.',
  'Revati':             'The Final Journey. Compassion and completion are your calling; guide others home.',
};
