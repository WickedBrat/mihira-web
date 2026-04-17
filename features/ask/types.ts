export type AskResponseMode = 'quick' | 'deep' | 'compare';

export type AskTopic =
  | 'career_dharma'
  | 'relationships'
  | 'family'
  | 'grief'
  | 'anger'
  | 'fear'
  | 'discipline'
  | 'self_worth'
  | 'purpose'
  | 'wealth'
  | 'devotion'
  | 'general';

export type AskSafetyEscalationType =
  | 'self_harm'
  | 'medical'
  | 'legal'
  | 'financial'
  | 'abuse'
  | 'mental_health';

export interface AskSafetyBoundary {
  has_boundary: boolean;
  note?: string;
  escalation_type?: AskSafetyEscalationType;
}

export interface ScriptureSource {
  id: string;
  scripture: string;
  book?: string;
  chapter?: string;
  verse?: string;
  citation_label: string;
  original_text?: string;
  transliteration?: string;
  translation: string;
  relevance_reason: string;
  confidence: 'high' | 'medium' | 'low';
  themes: string[];
  life_topics: string[];
}

export interface ScriptureGuideResponse {
  mode: AskResponseMode;
  topic: AskTopic;
  answer: {
    title?: string;
    summary: string;
    practical_guidance: string;
  };
  sources: ScriptureSource[];
  interpretation: {
    synthesis: string;
    alternate_view?: string;
  };
  action_steps: string[];
  follow_up_prompts: string[];
  safety: AskSafetyBoundary;
}

export interface AskContextV2 {
  userName: string;
  interactionCount: number;
  lastMode: AskResponseMode;
  lastTopic: AskTopic | null;
  lastQuestion: string | null;
}

export interface AskHistoryTurn {
  question: string;
  summary: string;
  mode: AskResponseMode;
  topic: AskTopic;
  sourceIds: string[];
}

export interface AskSavedPassage {
  source: ScriptureSource;
  savedAt: string;
}

export interface AskUserMessage {
  id: string;
  kind: 'user_message';
  role: 'user';
  text: string;
  timestamp: Date;
}

export interface AskAssistantMessage {
  id: string;
  kind: 'assistant_response';
  role: 'ai';
  prompt: string;
  timestamp: Date;
  response: ScriptureGuideResponse;
}

export type AskChatItem = AskUserMessage | AskAssistantMessage;

// Legacy Ask/Narad types kept for compatibility during the transition.

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
