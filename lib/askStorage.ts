import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AskChatItem,
  AskContextV2,
  AskHistoryTurn,
  AskResponseMode,
  AskSavedPassage,
} from '@/features/ask/types';

const ASK_CONTEXT_KEY = 'ask_v2_context';
const ASK_MESSAGES_KEY = 'ask_v2_messages';
const ASK_MODE_KEY = 'ask_v2_mode';
const ASK_SAVED_PASSAGES_KEY = 'ask_v2_saved_passages';
const ASK_HISTORY_KEY = 'ask_v2_history';

export const DEFAULT_ASK_CONTEXT: AskContextV2 = {
  userName: 'Seeker',
  interactionCount: 0,
  lastMode: 'quick',
  lastTopic: null,
  lastQuestion: null,
};

function reviveAskItem(raw: Omit<AskChatItem, 'timestamp'> & { timestamp: string }): AskChatItem {
  return {
    ...raw,
    timestamp: new Date(raw.timestamp),
  } as AskChatItem;
}

export async function loadAskContext(): Promise<AskContextV2> {
  try {
    const raw = await AsyncStorage.getItem(ASK_CONTEXT_KEY);
    if (!raw) return { ...DEFAULT_ASK_CONTEXT };
    return { ...DEFAULT_ASK_CONTEXT, ...(JSON.parse(raw) as Partial<AskContextV2>) };
  } catch {
    return { ...DEFAULT_ASK_CONTEXT };
  }
}

export async function saveAskContext(context: AskContextV2): Promise<void> {
  try {
    await AsyncStorage.setItem(ASK_CONTEXT_KEY, JSON.stringify(context));
  } catch (err) {
    console.error('[askStorage] saveAskContext error', err);
  }
}

export async function loadAskMessages(): Promise<AskChatItem[]> {
  try {
    const raw = await AsyncStorage.getItem(ASK_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<AskChatItem, 'timestamp'> & { timestamp: string }>;
    return parsed.map(reviveAskItem);
  } catch {
    return [];
  }
}

export async function saveAskMessages(messages: AskChatItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ASK_MESSAGES_KEY, JSON.stringify(messages.slice(-80)));
  } catch (err) {
    console.error('[askStorage] saveAskMessages error', err);
  }
}

export async function loadAskMode(): Promise<AskResponseMode> {
  try {
    const raw = await AsyncStorage.getItem(ASK_MODE_KEY);
    return raw === 'deep' || raw === 'compare' ? raw : 'quick';
  } catch {
    return 'quick';
  }
}

export async function saveAskMode(mode: AskResponseMode): Promise<void> {
  try {
    await AsyncStorage.setItem(ASK_MODE_KEY, mode);
  } catch (err) {
    console.error('[askStorage] saveAskMode error', err);
  }
}

export async function loadSavedPassages(): Promise<AskSavedPassage[]> {
  try {
    const raw = await AsyncStorage.getItem(ASK_SAVED_PASSAGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AskSavedPassage[];
  } catch {
    return [];
  }
}

export async function saveSavedPassages(passages: AskSavedPassage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ASK_SAVED_PASSAGES_KEY, JSON.stringify(passages));
  } catch (err) {
    console.error('[askStorage] saveSavedPassages error', err);
  }
}

export async function loadAskHistory(): Promise<AskHistoryTurn[]> {
  try {
    const raw = await AsyncStorage.getItem(ASK_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AskHistoryTurn[];
  } catch {
    return [];
  }
}

export async function saveAskHistory(history: AskHistoryTurn[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ASK_HISTORY_KEY, JSON.stringify(history.slice(-8)));
  } catch (err) {
    console.error('[askStorage] saveAskHistory error', err);
  }
}

export async function clearAskConversation(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ASK_MESSAGES_KEY, ASK_HISTORY_KEY]);
  } catch (err) {
    console.error('[askStorage] clearAskConversation error', err);
  }
}

export async function clearAskState(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      ASK_CONTEXT_KEY,
      ASK_MESSAGES_KEY,
      ASK_MODE_KEY,
      ASK_SAVED_PASSAGES_KEY,
      ASK_HISTORY_KEY,
    ]);
  } catch (err) {
    console.error('[askStorage] clearAskState error', err);
  }
}
