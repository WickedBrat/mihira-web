// features/muhurat/useMuhurat.ts
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface MuhuratState {
  windows: MuhuratWindow[];
  recommendation: string | null;
  suggestion: string | null;
  reasoning: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMuhurat(eventType: string): MuhuratState {
  const { profile } = useProfile();
  const [state, setState] = useState<MuhuratState>({
    windows: [], recommendation: null, suggestion: null,
    reasoning: null, isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place || !eventType) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch('/api/wisdom/muhurat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDt: profile.birth_dt,
        birthPlace: profile.birth_place,
        eventType,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setState(s => ({ ...s, isLoading: false, error: data.error }));
        } else {
          setState({
            windows: data.windows,
            recommendation: data.recommendation,
            suggestion: data.suggestion,
            reasoning: data.reasoning,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => setState(s => ({ ...s, isLoading: false, error: err.message })));
  }, [profile.birth_dt, profile.birth_place, eventType]);

  return state;
}
