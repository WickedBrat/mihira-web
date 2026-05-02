// features/muhurat/useMuhurat.ts
import { useState, useEffect } from 'react';
import type { MuhuratWindow } from '@/lib/vedic/types';
import { apiUrl } from '@/lib/apiUrl';

export interface MuhuratRequest {
  eventDescription: string;
  startDate: string;
  endDate: string;
}

interface MuhuratState {
  rankedWindows: MuhuratWindow[];
  recommendation: string | null;
  confidence: string | null;
  suggestion: string | null;
  reasoning: string | null;
  warnings: string | null;
  festivalNote: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMuhurat(request: MuhuratRequest | null): MuhuratState {
  const [state, setState] = useState<MuhuratState>({
    rankedWindows: [], recommendation: null, confidence: null,
    suggestion: null, reasoning: null, warnings: null, festivalNote: null,
    isLoading: false, error: null,
  });

  useEffect(() => {
    if (!request) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch(apiUrl('/api/wisdom/muhurat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
            rankedWindows: data.rankedWindows ?? [],
            recommendation: data.recommendation,
            confidence: data.confidence ?? null,
            suggestion: data.suggestion,
            reasoning: data.reasoning,
            warnings: data.warnings ?? null,
            festivalNote: data.festivalNote ?? null,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => setState(s => ({ ...s, isLoading: false, error: err.message })));
  }, [request]);

  return state;
}
