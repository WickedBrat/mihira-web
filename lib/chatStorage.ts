import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Message } from '@/features/chat/useChatState';

const KEY = 'aksha_chat_history';

export async function getHistory(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export async function saveHistory(messages: Message[]): Promise<void> {
  try {
    const trimmed = messages.slice(-50);
    await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('[chatStorage] save error', err);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (err) {
    console.error('[chatStorage] clear error', err);
  }
}
