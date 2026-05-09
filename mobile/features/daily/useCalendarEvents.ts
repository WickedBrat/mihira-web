import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { withTimeout } from '@/lib/withTimeout';

const SUPABASE_TIMEOUT_MS = 15000;

export function getLocalCalendarDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  tag: string | null;
  short_description: string | null;
  significance: string | null;
  mantra: string | null;
  rituals: string[] | null;
  image_url: string | null;
}

export function useCalendarEvents(dateOverride?: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(async () => {
    return getSupabaseClient();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetch = async () => {
      try {
        const today = dateOverride ?? getLocalCalendarDateKey();
        const client = await getClient();
        const { data, error: err } = await withTimeout(
          client
            .from('aksha_calendar')
            .select('*')
            .eq('date', today),
          SUPABASE_TIMEOUT_MS,
          'Calendar request timed out. Check Supabase connectivity.'
        );

        if (err) throw err;
        if (!isCancelled) setEvents(data ?? []);
      } catch (e) {
        if (!isCancelled) setError(e instanceof Error ? e.message : 'Failed to fetch events');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void fetch();
    return () => { isCancelled = true; };
  }, [getClient, dateOverride]);

  return { events, isLoading, error };
}

export function useCalendarEventById(id: number | null) {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(async () => {
    return getSupabaseClient();
  }, []);

  useEffect(() => {
    if (id === null) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetch = async () => {
      try {
        const client = await getClient();
        const { data, error: err } = await withTimeout(
          client
            .from('aksha_calendar')
            .select('*')
            .eq('id', id)
            .single(),
          SUPABASE_TIMEOUT_MS,
          'Calendar detail request timed out. Check Supabase connectivity.'
        );

        if (err) throw err;
        if (!isCancelled) setEvent(data);
      } catch (e) {
        if (!isCancelled) setError(e instanceof Error ? e.message : 'Failed to fetch event');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void fetch();
    return () => { isCancelled = true; };
  }, [getClient, id]);

  return { event, isLoading, error };
}
