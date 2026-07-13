import type { SupabaseClient } from '@supabase/supabase-js';
import type { AskQueryLogEntry } from '../../features/ask/types';

export async function logAskQuery(
  supabase: SupabaseClient,
  userId: string,
  entry: AskQueryLogEntry,
): Promise<void> {
  try {
    const { data, error: selectError } = await supabase
      .from('user_ask_queries')
      .select('queries')
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('[askQueryLog] select error', selectError.message);
      return;
    }

    const existing = (data?.queries as AskQueryLogEntry[] | undefined) ?? [];
    const nextQueries = [...existing, entry];

    const { error: upsertError } = await supabase.from('user_ask_queries').upsert(
      {
        user_id: userId,
        queries: nextQueries,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (upsertError) {
      console.error('[askQueryLog] upsert error', upsertError.message);
    }
  } catch (err) {
    console.error('[askQueryLog] error', err);
  }
}
