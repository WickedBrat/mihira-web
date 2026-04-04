import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { BirthChart } from '@/lib/vedic/types';
import {
  getCachedDailyAlignment,
  getDailyAlignmentProfileKey,
  saveCachedDailyAlignment,
  type DailyFocusArea,
} from '@/lib/dailyAlignmentStorage';

interface DailyAlignmentState {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
  isLoading: boolean;
  error: string | null;
}

export function useDailyAlignment(): DailyAlignmentState {
  const { profile } = useProfile();
  const [state, setState] = useState<DailyAlignmentState>({
    chart: null, focusAreas: [], isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place) return;

    const profileKey = getDailyAlignmentProfileKey(profile.birth_dt, profile.birth_place);
    let isCancelled = false;

    const loadDailyAlignment = async () => {
      const cached = await getCachedDailyAlignment(profileKey);
      if (cached) {
        if (!isCancelled) {
          setState({
            chart: cached.chart,
            focusAreas: cached.focusAreas ?? [],
            isLoading: false,
            error: null,
          });
        }
        return;
      }

      if (!isCancelled) {
        setState((current) => ({ ...current, isLoading: true, error: null }));
      }

      try {
        const response = await fetch('/api/wisdom/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ birthDt: profile.birth_dt, birthPlace: profile.birth_place }),
        });
        const contentType = response.headers.get('content-type') ?? '';

        if (!contentType.includes('application/json')) {
          const raw = await response.text();
          throw new Error(
            `Daily API returned ${contentType || 'non-JSON content'} (${response.status}). ` +
            `Check Expo API routes config; response started with: ${raw.slice(0, 80)}`
          );
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? `Daily API failed with status ${response.status}`);
        if (data.error) throw new Error(data.error);

        const nextState = {
          chart: data.chart,
          focusAreas: Array.isArray(data.focusAreas) ? data.focusAreas : [],
        };

        await saveCachedDailyAlignment(profileKey, nextState);

        if (!isCancelled) {
          setState({ ...nextState, isLoading: false, error: null });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Daily alignment unavailable';
        if (!isCancelled) {
          setState((current) => ({ ...current, isLoading: false, error: message }));
        }
      }
    };

    void loadDailyAlignment();
    return () => { isCancelled = true; };
  }, [profile.birth_dt, profile.birth_place]);

  return state;
}
