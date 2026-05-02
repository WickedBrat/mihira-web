export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimelineEntry {
  id: TimeOfDay;
  label: string;
  subtitle: string;
  timeRange: string;
  quote: string;
  emoji: string;
  gradientColors: readonly [string, string];
}
