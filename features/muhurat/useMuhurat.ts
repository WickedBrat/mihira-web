// features/muhurat/useMuhurat.ts
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { MuhuratWindow } from '@/lib/vedic/types';

export interface MuhuratRequest {
  eventDescription: string;
  startDate: string;
  endDate: string;
}

interface MuhuratState {
  windows: MuhuratWindow[];
  recommendation: string | null;
  suggestion: string | null;
  reasoning: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMuhurat(request: MuhuratRequest | null): MuhuratState {
  const { profile } = useProfile();
  const [state, setState] = useState<MuhuratState>({
    windows: [], recommendation: null, suggestion: null,
    reasoning: null, isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place || !request) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch('/api/wisdom/muhurat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDt: profile.birth_dt,
        birthPlace: profile.birth_place,
        eventDescription: request.eventDescription,
        startDate: request.startDate,
        endDate: request.endDate,
      }),
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type') ?? '';

        if (!contentType.includes('application/json')) {
          const raw = await response.text();
          throw new Error(
            `Muhurat API returned ${contentType || 'non-JSON content'} (${response.status}). ` +
            `Check Expo API routes config; response started with: ${raw.slice(0, 80)}`
          );
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? `Muhurat API failed with status ${response.status}`);
        }

        return data;
      })
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
  }, [profile.birth_dt, profile.birth_place, request]);

  return state;
}
