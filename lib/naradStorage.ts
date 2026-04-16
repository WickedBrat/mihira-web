// lib/naradStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/lib/supabase';
import type { NaradContext, NaradHistoryEntry } from '@/features/ask/types';
import type { Message } from '@/features/ask/types';

const CONTEXT_KEY = 'narad_context';
const HISTORY_KEY = 'narad_history';
const MESSAGES_KEY = 'narad_messages';

export const DEFAULT_NARAD_CONTEXT: NaradContext = {
  userName: 'Seeker',
  lastDeity: null,
  lastTheme: null,
  interactionCount: 0,
};

// ── Context ──────────────────────────────────────────────────────────────────

export async function loadNaradContext(): Promise<NaradContext> {
  try {
    const raw = await AsyncStorage.getItem(CONTEXT_KEY);
    if (!raw) return { ...DEFAULT_NARAD_CONTEXT };
    const parsed = JSON.parse(raw) as Partial<NaradContext>;
    return { ...DEFAULT_NARAD_CONTEXT, ...parsed };
  } catch {
    return { ...DEFAULT_NARAD_CONTEXT };
  }
}

export async function saveNaradContext(ctx: NaradContext): Promise<void> {
  try {
    await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
  } catch (err) {
    console.error('[naradStorage] saveNaradContext error', err);
  }
}

// ── History ───────────────────────────────────────────────────────────────────

export async function loadNaradHistory(): Promise<NaradHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NaradHistoryEntry[];
  } catch {
    return [];
  }
}

export async function appendNaradHistory(entry: NaradHistoryEntry): Promise<void> {
  try {
    const existing = await loadNaradHistory();
    const updated = [...existing, entry].slice(-5);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[naradStorage] appendNaradHistory error', err);
  }
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function loadNaradMessages(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export async function saveNaradMessages(messages: Message[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-60)));
  } catch (err) {
    console.error('[naradStorage] saveNaradMessages error', err);
  }
}

export async function clearNaradMessages(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MESSAGES_KEY);
  } catch (err) {
    console.error('[naradStorage] clearNaradMessages error', err);
  }
}

// ── Supabase background sync ──────────────────────────────────────────────────

export async function syncNaradContextToSupabase(
  ctx: NaradContext,
  userId: string,
  getToken: () => Promise<string | null>,
): Promise<void> {
  try {
    const supabase = getSupabaseClient(getToken);
    const { error } = await supabase.from('user_narad_context').upsert({
      user_id: userId,
      last_deity: ctx.lastDeity,
      last_theme: ctx.lastTheme,
      interaction_count: ctx.interactionCount,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error('[naradStorage] syncNaradContextToSupabase supabase error', error.message);
    }
  } catch (err) {
    console.error('[naradStorage] syncNaradContextToSupabase error', err);
  }
}
