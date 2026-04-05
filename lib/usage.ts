// lib/usage.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/clerk-expo';
import { getSupabaseClient } from '@/lib/supabase';

export type Feature = 'muhurat' | 'ask';

export const LIMITS: Record<Feature, number> = {
  muhurat: 5,
  ask: 20,
};

interface UsageRow {
  user_id: string;
  muhurat_count: number;
  ask_count: number;
  period_start: string;
  period_end: string;
}

interface UseUsageReturn {
  count: number;
  limit: number;
  isNearLimit: boolean;
  isAtLimit: boolean;
  isLoaded: boolean;
  increment: () => Promise<void>;
}

function isExpired(periodEnd: string): boolean {
  return new Date() > new Date(periodEnd);
}

function newPeriod() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return { period_start: now.toISOString(), period_end: end.toISOString() };
}

export function useUsage(feature: Feature): UseUsageReturn {
  const { isSignedIn, userId } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const limit = LIMITS[feature];

  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getClient = useCallback(async () => {
    if (!isSignedIn || !userId || !isSessionLoaded) return null;
    try {
      let token = await session?.getToken();
      if (!token) token = await session?.getToken({ template: 'supabase' });
      if (!token) return null;
      return getSupabaseClient(async () => token);
    } catch {
      return null;
    }
  }, [isSignedIn, userId, isSessionLoaded, session]);

  useEffect(() => {
    if (!isSignedIn || !userId) {
      setCount(0);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    async function load() {
      const client = await getClient();
      if (!client || cancelled) return;

      const { data } = await client
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single<UsageRow>();

      if (cancelled) return;

      if (!data || isExpired(data.period_end)) {
        setCount(0);
      } else {
        setCount(data[`${feature}_count` as keyof UsageRow] as number);
      }

      setIsLoaded(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, userId, feature, getClient]);

  const increment = useCallback(async () => {
    if (!isSignedIn || !userId) return;

    const client = await getClient();
    if (!client) return;

    const { data: existing } = await client
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single<UsageRow>();

    const expired = !existing || isExpired(existing.period_end);
    const baseCount = expired ? 0 : (existing[`${feature}_count` as keyof UsageRow] as number);
    const newCount = baseCount + 1;

    const period = expired ? newPeriod() : {
      period_start: existing.period_start,
      period_end: existing.period_end,
    };

    const upsertRow = {
      user_id: userId,
      muhurat_count: existing?.muhurat_count ?? 0,
      ask_count: existing?.ask_count ?? 0,
      ...period,
      [`${feature}_count`]: newCount,
      updated_at: new Date().toISOString(),
    };

    setCount(newCount); // optimistic

    const { error } = await client
      .from('user_usage')
      .upsert(upsertRow, { onConflict: 'user_id' });

    if (error) {
      console.error('[useUsage] increment error', error);
    }
  }, [isSignedIn, userId, feature, getClient]);

  return {
    count,
    limit,
    isNearLimit: count === limit - 1,
    isAtLimit: count >= limit,
    isLoaded,
    increment,
  };
}
