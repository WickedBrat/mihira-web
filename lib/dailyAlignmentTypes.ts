import type { BirthChart } from '@/lib/vedic/types';

export interface DailyFocusArea {
  area: string;
  action: string;
  timeRange: string;
  suggestion: string;
  reasoning: string;
}

export interface DailyAlignmentPayload {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
}
