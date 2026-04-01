import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { BirthChart } from '@/lib/vedic/types';

interface DailyAlignmentState {
  chart: BirthChart | null;
  guidance: string | null;
  reasoning: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useDailyAlignment(): DailyAlignmentState {
  const { profile } = useProfile();
  const [state, setState] = useState<DailyAlignmentState>({
    chart: null, guidance: null, reasoning: null, isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch('/api/wisdom/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthDt: profile.birth_dt, birthPlace: profile.birth_place }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setState(s => ({ ...s, isLoading: false, error: data.error }));
        } else {
          setState({
            chart: data.chart,
            guidance: data.guidance,
            reasoning: data.reasoning,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => {
        setState(s => ({ ...s, isLoading: false, error: err.message }));
      });
  }, [profile.birth_dt, profile.birth_place]);

  return state;
}
