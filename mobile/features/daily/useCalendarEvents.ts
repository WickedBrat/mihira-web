import { useState, useEffect, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/expo';
import { getSupabaseClient } from '@/lib/supabase';

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
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(async () => {
    let token: string | null = null;
    if (isSignedIn && isSessionLoaded && session) {
      token = await session.getToken();
    }
    return getSupabaseClient(async () => token ?? '');
  }, [isSessionLoaded, isSignedIn, session]);

  useEffect(() => {
    if (!isAuthLoaded || !isSessionLoaded) return;

    let isCancelled = false;

    const fetch = async () => {
      try {
        const today = dateOverride ?? new Date().toISOString().split('T')[0];
        const client = await getClient();
        const { data, error: err } = await client
          .from('aksha_calendar')
          .select('*')
          .eq('date', today);

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
  }, [getClient, isAuthLoaded, isSessionLoaded, dateOverride]);

  return { events, isLoading, error };
}

export function useCalendarEventById(id: number | null) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(async () => {
    let token: string | null = null;
    if (isSignedIn && isSessionLoaded && session) {
      token = await session.getToken();
    }
    return getSupabaseClient(async () => token ?? '');
  }, [isSessionLoaded, isSignedIn, session]);

  useEffect(() => {
    if (!isAuthLoaded || !isSessionLoaded || id === null) return;

    let isCancelled = false;

    const fetch = async () => {
      try {
        const client = await getClient();
        const { data, error: err } = await client
          .from('aksha_calendar')
          .select('*')
          .eq('id', id)
          .single();

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
  }, [getClient, isAuthLoaded, isSessionLoaded, id]);

  return { event, isLoading, error };
}
