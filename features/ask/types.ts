// features/ask/types.ts

export interface ShlokaData {
  devanagari: string;
  transliteration: string;
  meaning: string;
  source: string;
}

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
  bubbleType?: BubbleType;
  visibleAfterMs?: number;
  accentColor?: string;
  deityLabel?: string;
  subtitle?: string;
  shlokaData?: ShlokaData;
}

export type DeityName = 'Krishna' | 'Shiva' | 'Lakshmi' | 'Ram';

export type RealmPhase = 'idle' | 'journeying' | 'deity_reveal' | 'settled';

export type BubbleType =
  | 'narad_greeting'
  | 'narad_journey'
  | 'shloka'
  | 'vani'
  | 'narad_closing';

export type AnimationTrigger =
  | 'gentle_pluck'
  | 'rising_smoke'
  | 'lotus_bloom'
  | 'steady_dawn';

export interface NaradResponse {
  interaction_metadata: {
    consulted_deity: DeityName;
    realm: string;
    ui_vibration_color: string;
    animation_trigger: AnimationTrigger;
  };
  narad_narrative: {
    greeting: string;
    journey_description: string;
  };
  divine_vani: {
    shloka_devanagari: string;
    shloka_transliteration: string;
    shloka_meaning: string;
    wisdom_text: string;
    source_scripture: string;
  };
  narad_closing: string;
}

export interface NaradHistoryEntry {
  query: string;
  wisdom_text: string;
  deity: DeityName;
}

export interface NaradContext {
  userName: string;
  lastDeity: DeityName | null;
  lastTheme: string | null;
  interactionCount: number;
}
