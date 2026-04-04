export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Rahu' | 'Ketu';

export type SignName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const SIGNS: SignName[] = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
];

export interface PlanetPosition {
  name: PlanetName;
  longitude: number;   // 0–360 sidereal degrees
  sign: SignName;
  house: number;       // 1–12 Whole Sign
  isRetrograde?: boolean;
}

export interface BirthChart {
  lagna: SignName;
  lagnaLongitude: number;
  planets: PlanetPosition[];
  nakshatra: string;    // Moon's nakshatra name
  currentDasha: string; // e.g. "Jupiter-Mars"
}

export type ChaughadiyaQuality =
  'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Udveg' | 'Rog' | 'Kaal';

export interface MuhuratWindow {
  start: string;  // ISO datetime
  end: string;
  quality: string;
  type: 'abhijit' | 'chaughadiya';
  isAuspicious: boolean;
  score?: number;  // 1–10, assigned by AI ranking
}
