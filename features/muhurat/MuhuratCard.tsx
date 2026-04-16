// features/muhurat/MuhuratCard.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { VedicReasoningAccordion } from '@/features/horoscope/VedicReasoningAccordion';
import { useTheme } from '@/lib/theme-context';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface Props {
  hasRequested: boolean;
  recommendation: string | null;
  confidence: string | null;
  suggestion: string | null;
  reasoning: string | null;
  warnings: string | null;
  festivalNote: string | null;
  rankedWindows: MuhuratWindow[];
  isLoading: boolean;
  error: string | null;
}

const REC_COLORS: Record<string, string> = {
  Yes:  '#4ade80',
  No:   '#f87171',
  Wait: '#fbbf24',
};

function scoreColor(score: number): string {
  if (score >= 9) return '#4ade80';
  if (score >= 7) return '#86efac';
  if (score >= 5) return '#fbbf24';
  return '#94a3b8';
}

export function MuhuratCard({
  hasRequested,
  recommendation,
  confidence,
  suggestion,
  reasoning,
  warnings,
  festivalNote,
  rankedWindows,
  isLoading,
  error,
}: Props) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View className="gap-3.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-5 dark:border-white/[0.06]">
        <ActivityIndicator color={colors.primary} />
        <Text className="mt-3 text-center font-body text-sm text-on-surface-variant">Calculating auspicious timings…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="gap-3.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-5 dark:border-white/[0.06]">
        <Text className="text-center font-body text-sm text-error">{error}</Text>
      </View>
    );
  }

  if (!hasRequested) {
    return (
      <View className="gap-3.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-5 dark:border-white/[0.06]">
        <Text className="text-center font-body text-sm leading-[22px] text-on-surface-variant">
          Describe your situation and select a date range to see the strongest auspicious windows.
        </Text>
      </View>
    );
  }

  if (!recommendation) return null;

  const recColor = REC_COLORS[recommendation] ?? colors.onSurface;

  return (
    <View className="gap-3.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-5 dark:border-white/[0.06]">
      <View className="flex-row items-center gap-3">
        <View className="self-start rounded-lg border-[1.5px] px-3 py-1" style={{ borderColor: recColor }}>
          <Text className="font-headline-extra text-lg tracking-[1px]" style={{ color: recColor }}>{recommendation}</Text>
        </View>
        {confidence && (
          <Text className="font-label text-xs uppercase tracking-[1.5px] text-on-surface-variant">Confidence: {confidence}</Text>
        )}
      </View>

      {festivalNote && (
        <View className="flex-row items-start gap-2 rounded-[10px] border border-[rgba(251,191,36,0.45)] bg-[rgba(251,191,36,0.10)] px-3.5 py-2.5">
          <Text className="mt-px text-sm text-[#fbbf24]">✦</Text>
          <Text className="flex-1 font-body text-sm leading-5 text-[#fde68a]">{festivalNote}</Text>
        </View>
      )}

      {suggestion && <Text className="font-body text-base leading-6 text-on-surface">{suggestion}</Text>}

      {warnings && warnings !== 'None' && (
        <View className="rounded-[10px] border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.08)] px-3.5 py-2.5">
          <Text className="font-body text-sm leading-5 text-[#fbbf24]">{warnings}</Text>
        </View>
      )}

      {rankedWindows.length > 0 && (
        <>
          <Text className="font-label text-[9px] uppercase tracking-[2px] text-secondary-fixed">
            Top Auspicious Windows · Highest Score First
          </Text>
          {rankedWindows.map((w, i) => (
            <View
              key={i}
              className={`flex-row items-center justify-between gap-3 rounded-lg bg-black/[0.03] px-3 py-2 dark:bg-white/[0.03] ${
                w.type === 'abhijit'
                    ? 'border border-[rgba(255,159,75,0.4)]'
                    : ''
              }`}
            >
              <View className="flex-1 gap-1">
                <Text className="font-label text-[9px] uppercase tracking-[1.1px] text-secondary-fixed">
                  {new Date(w.start).toLocaleDateString([], {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
                <Text className="font-body text-sm text-on-surface">
                  {new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {new Date(w.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text className="font-label text-[9px] tracking-[1px] text-on-surface-variant">{w.quality}</Text>
              </View>
              {w.score != null && (
                <View className="flex-row items-baseline gap-px rounded-lg border-[1.5px] px-2 py-1" style={{ borderColor: scoreColor(w.score) }}>
                  <Text className="font-headline-extra text-base" style={{ color: scoreColor(w.score) }}>{w.score}</Text>
                  <Text className="font-label text-[9px] tracking-[0.5px] text-on-surface-variant">/10</Text>
                </View>
              )}
            </View>
          ))}
        </>
      )}

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}
