// lib/onboardingNewStore.ts
// Module-level store for the onboarding-new (hook-model redesign) flow.
// Kept fully separate from lib/onboardingStore.ts so the two flows never interfere.

import { getSupabaseClient } from '@/lib/supabase';
import { USER_DETAILS_TABLE, USER_DETAILS_USER_ID_COLUMN } from '@/lib/userDetails';
import { NAKSHATRA_INSIGHTS } from '@/lib/onboardingStore';
import type { SignName } from '@/lib/vedic/types';

export const RASHI_SANSKRIT: Record<SignName, string> = {
  Aries: 'Mesha',
  Taurus: 'Vrishabha',
  Gemini: 'Mithuna',
  Cancer: 'Karka',
  Leo: 'Simha',
  Virgo: 'Kanya',
  Libra: 'Tula',
  Scorpio: 'Vrishchika',
  Sagittarius: 'Dhanu',
  Capricorn: 'Makara',
  Aquarius: 'Kumbha',
  Pisces: 'Meena',
};

export interface ChartResult {
  nakshatra: string;
  rashi: SignName;
  rashiSanskrit: string;
  moonHouse: number | null;
  insight: string;
}

const FALLBACK_CHART: ChartResult = {
  nakshatra: 'Uttara Phalguni',
  rashi: 'Leo',
  rashiSanskrit: 'Simha',
  moonHouse: 9,
  insight: NAKSHATRA_INSIGHTS['Uttara Phalguni'] ?? 'Turn loyalty inward.',
};

export function buildChartResult(nakshatra: string, rashi: SignName, moonHouse: number | null): ChartResult {
  return {
    nakshatra,
    rashi,
    rashiSanskrit: RASHI_SANSKRIT[rashi] ?? rashi,
    moonHouse,
    insight: NAKSHATRA_INSIGHTS[nakshatra] ?? FALLBACK_CHART.insight,
  };
}

export function getFallbackChart(): ChartResult {
  return FALLBACK_CHART;
}

export interface Ache {
  id: 'burnout' | 'direction' | 'restless' | 'reconnect';
  label: string;
  ack: string;
  noun: string;
  title: string;
}

export const ACHES: Ache[] = [
  { id: 'burnout', label: 'Burned out', ack: 'That takes more out of you than people know.', noun: 'burnout', title: 'Burnout' },
  { id: 'direction', label: 'Seeking direction', ack: "Not knowing which way to face is its own kind of tired.", noun: 'a search for direction', title: 'A search for direction' },
  { id: 'restless', label: "Mind won't settle", ack: "A mind that won't settle is asking for rhythm, not more effort.", noun: 'a restless mind', title: 'A restless mind' },
  { id: 'reconnect', label: 'Want to reconnect with myself', ack: "You can't be far from something that lives in you.", noun: 'a distance from yourself', title: 'A distance from self' },
];

export interface Context {
  id: 'work' | 'family' | 'relationship' | 'spiritual' | 'identity' | 'money' | 'health' | 'notsure';
  label: string;
}

export const CONTEXTS: Context[] = [
  { id: 'work', label: 'Work' },
  { id: 'family', label: 'Family' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'spiritual', label: 'Spiritual practice' },
  { id: 'identity', label: 'Identity' },
  { id: 'money', label: 'Money' },
  { id: 'health', label: 'Health' },
  { id: 'notsure', label: 'Not sure' },
];

export interface Vow {
  id: 'seed' | 'growth' | 'mastery';
  emoji: string;
  name: string;
  short: string;
  min: number;
  line: string;
  recommended?: boolean;
}

export const VOWS: Vow[] = [
  { id: 'seed', emoji: '🌱', name: 'The Seed', short: 'Seed', min: 3, line: 'A single alignment, read with attention.' },
  { id: 'growth', emoji: '🌿', name: 'The Growth', short: 'Growth', min: 10, line: 'Alignment, one reflection, one timing check.', recommended: true },
  { id: 'mastery', emoji: '🪷', name: 'The Mastery', short: 'Mastery', min: 20, line: 'The full practice — alignment, Saarthi, study.' },
];

export const MAPPING_CRUMBS = [
  'Finding the moon where it stood the day you arrived…',
  'Locating your nakshatra…',
  'Cross-referencing four timing systems used across the Puranas…',
  'Preparing what this means for how you live now…',
];

export const GENDERS = ['Woman', 'Man', 'Prefer not to say'] as const;

export interface OnboardingNewData {
  aches: string[];
  lastAche: string | null;
  contexts: string[];
  name: string;
  firstQuestion: string;
  gender: string;
  birthDate: Date;
  birthTime: Date;
  unknownBirthTime: boolean;
  birthPlace: string;
  vow: Vow['id'];
  alignMode: 'suggested' | 'fresh';
  alignMinutes: number;
  reservedPages: number;
  chart: ChartResult | null;
}

const DEFAULT: OnboardingNewData = {
  aches: [],
  lastAche: null,
  contexts: [],
  name: '',
  firstQuestion: '',
  gender: '',
  birthDate: new Date(2000, 0, 1),
  birthTime: new Date(2000, 0, 1, 9, 0),
  unknownBirthTime: false,
  birthPlace: '',
  vow: 'growth',
  alignMode: 'suggested',
  alignMinutes: 374,
  reservedPages: 20,
  chart: null,
};

let _data: OnboardingNewData = { ...DEFAULT };

export function getOnboardingNewData(): OnboardingNewData {
  return _data;
}

export function setOnboardingNewData(partial: Partial<OnboardingNewData>): void {
  _data = { ..._data, ...partial };
}

export function resetOnboardingNewData(): void {
  _data = { ...DEFAULT };
}

// ─── Shared derived-copy helpers (ported 1:1 from the HTML mock's DCLogic) ────

export function buildContextLine(selectedContextIds: string[]): string {
  const selectedLabels = CONTEXTS.filter((c) => selectedContextIds.includes(c.id)).map((c) => c.label);
  if (selectedLabels.length === 0) {
    return "Choose where it shows up. There's a right window for what you're carrying — Mihira can find it.";
  }
  const words = selectedLabels.filter((label) => label !== 'Not sure').map((label) => label.toLowerCase());
  if (words.length === 0) {
    return "There's a right window for what you're carrying. We'll need your birth rhythm to find it.";
  }
  const phrase = words.length > 1 ? `${words[0]} and ${words[1]}` : words[0];
  return `There's a right window for what you're carrying in ${phrase}. We'll need your birth rhythm to find it.`;
}

export function buildTimingHeadline(selectedContextIds: string[]): string {
  const selectedLabels = CONTEXTS.filter((c) => selectedContextIds.includes(c.id)).map((c) => c.label);
  const words = selectedLabels.filter((label) => label !== 'Not sure').map((label) => label.toLowerCase());
  const ctxWord = words[0] || 'your days';
  return `You told Mihira it lives in ${ctxWord}.`;
}

export function formatMinutesAsClock(mins: number): string {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function getFirstSelectedAche(data: OnboardingNewData): Ache {
  const first = ACHES.find((a) => data.aches.includes(a.id));
  return first ?? ACHES[0];
}

export function getVow(id: Vow['id']): Vow {
  return VOWS.find((v) => v.id === id) ?? VOWS[1];
}

// ─── Persistence — writes into the existing user_details.onboarding_data jsonb column ──
// No schema changes: this reuses the same table/column the legacy onboarding flow
// (lib/onboardingStatus.ts) already writes to, just with onboarding-new's own data shape.

function serializeOnboardingNewData(data: OnboardingNewData) {
  return {
    flow: 'onboarding-new',
    aches: data.aches,
    contexts: data.contexts,
    firstQuestion: data.firstQuestion,
    vow: data.vow,
    alignMode: data.alignMode,
    alignMinutes: data.alignMinutes,
    chart: data.chart,
  };
}

export async function saveOnboardingNewCompletion(userId: string, data: OnboardingNewData): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from(USER_DETAILS_TABLE)
    .upsert(
      {
        user_id: userId,
        onboarding_completed: true,
        onboarding_step: 'completed',
        onboarding_data: serializeOnboardingNewData(data),
        updated_at: new Date().toISOString(),
      },
      { onConflict: USER_DETAILS_USER_ID_COLUMN }
    );

  if (error) throw error;
}
