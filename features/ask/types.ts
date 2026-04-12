// features/ask/types.ts

export type DeityName = 'Krishna' | 'Shiva' | 'Lakshmi' | 'Ram';

export type RealmPhase = 'idle' | 'journeying' | 'deity_reveal' | 'settled';

export type BubbleType =
  | 'narad_greeting'
  | 'narad_journey'
  | 'shloka'
  | 'vani'
  | 'narad_closing';

export interface NaradResponse {
  interaction_metadata: {
    consulted_deity: DeityName;
    realm: string;
    ui_vibration_color: string;
    animation_trigger: string;
  };
  narad_narrative: {
    greeting: string;
    journey_description: string;
  };
  divine_vani: {
    shloka_devanagari: string;
    shloka_transliteration: string;
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
