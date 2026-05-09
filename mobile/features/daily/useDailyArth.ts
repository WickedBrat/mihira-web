import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { withTimeout } from '@/lib/withTimeout';
import type { DailyArthReflection } from '@/lib/dailyArthReflectionTypes';
import { isDailyArthReflection } from '@/lib/dailyArthReflectionTypes';

const SUPABASE_TIMEOUT_MS = 15000;

export interface ArthData {
  id: number;
  quote: string;
  source: string;
  dailyReflection: DailyArthReflection | null;
}

export function useDailyArth() {
  const [arth, setArth] = useState<ArthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(async () => {
    return getSupabaseClient();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchArth = async () => {
      try {
        const client = await getClient();
        if (!client) {
            throw new Error('Could not instantiate Supabase client');
        }
        
        // Pick a deterministic quote of the day based on the current date
        const today = new Date();
        const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Fetch up to 1000 quotes to avoid dealing with sequence gaps in ID
        const { data, error: fetchError } = await withTimeout(
          client
            .from('spiritual_quotes')
            .select('id, quote, source, daily_reflection')
            .limit(1000),
          SUPABASE_TIMEOUT_MS,
          'Daily quote request timed out. Check Supabase connectivity.'
        );

        if (fetchError) {
            console.error('[useDailyArth] SUPABASE ERROR:', fetchError);
            throw fetchError;
        }

        if (!isCancelled && data && data.length > 0) {
          // Pick deterministically from whatever is returned
          const index = dateSeed % data.length;
          const quote = data[index];
          setArth({
            id: Number(quote.id),
            quote: quote.quote,
            source: quote.source,
            dailyReflection: isDailyArthReflection(quote.daily_reflection) ? quote.daily_reflection : null,
          });
        } else if (!isCancelled) {
            throw new Error('Table is empty or no data returned');
        }
      } catch (err) {
        if (!isCancelled) {
          console.log(err);
          
          setError(err instanceof Error ? err.message : 'Failed to fetch quote');
          // Provide a fallback quote if the DB fetch fails
          setArth({ 
              id: 0,
              quote: '"You have a right to your actions, but never to their fruits."', 
              source: 'The Bhagavad Gita',
              dailyReflection: null,
          });
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void fetchArth();

    return () => {
      isCancelled = true;
    };
  }, [getClient]);

  return { arth, isLoading, error };
}
