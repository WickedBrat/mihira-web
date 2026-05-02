// features/muhurat/MuhuratCard.tsx
import React from 'react';
import {
  View,
} from 'react-native';
import { ConstellationLoader } from '@/components/ui/ConstellationLoader';
import { Text } from '@/components/ui/Text';
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

function scoreOpacity(score: number): number {
  if (score >= 9) return 1;
  if (score >= 7) return 0.78;
  if (score >= 5) return 0.58;
  return 0.42;
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
        <ConstellationLoader
          size={150}
          message="Calculating auspicious timings…"
        />
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

  const recColor = colors.secondaryFixed;

  return (
    <View className="gap-3.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-5 dark:border-white/[0.06]">
      <View className="flex-row items-center gap-3">
        <View className="self-start rounded-lg border px-3 py-1" style={{ borderColor: `${recColor}AA`, backgroundColor: `${recColor}14` }}>
          <Text className="font-label text-sm tracking-[0.5px]" style={{ color: recColor }}>{recommendation}</Text>
        </View>
        {confidence && (
          <Text className="font-label text-[11px] uppercase tracking-[1.2px] text-on-surface-variant">Confidence: {confidence}</Text>
        )}
      </View>

      {festivalNote && (
        <View className="flex-row items-start gap-2 rounded-[10px] border px-3.5 py-2.5" style={{ borderColor: `${colors.secondaryFixed}45`, backgroundColor: `${colors.secondaryFixed}10` }}>
          <Text className="mt-px text-sm text-secondary-fixed">✦</Text>
          <Text className="flex-1 font-body text-sm leading-5 text-on-surface-variant">{festivalNote}</Text>
        </View>
      )}

      {suggestion && <Text className="font-body text-base leading-6 text-on-surface">{suggestion}</Text>}

      {warnings && warnings !== 'None' && (
        <View className="rounded-[10px] border px-3.5 py-2.5" style={{ borderColor: `${colors.secondaryFixed}32`, backgroundColor: `${colors.secondaryFixed}0F` }}>
          <Text className="font-body text-sm leading-5 text-on-surface-variant">{warnings}</Text>
        </View>
      )}

      {rankedWindows.length > 0 && (
        <>
          <Text className="font-label text-[9px] uppercase tracking-[2px] text-secondary-fixed">
            Top Auspicious Windows · Highest Score First
          </Text>
          {rankedWindows.map((w, i) => {
            const isTopWindow = i < 3;
            const scoreAlpha = w.score == null ? 0.45 : scoreOpacity(w.score);

            return (
            <View
              key={i}
              className="flex-row items-center justify-between gap-3 rounded-xl border px-3 py-2.5"
              style={{
                borderColor: isTopWindow ? `${colors.secondaryFixed}55` : `${colors.onSurfaceVariant}18`,
                backgroundColor: isTopWindow ? `${colors.secondaryFixed}0F` : `${colors.onSurfaceVariant}08`,
              }}
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
                <View
                  className="flex-row items-baseline gap-px rounded-lg border px-2 py-1"
                  style={{
                    borderColor: `${colors.secondaryFixed}${Math.round(scoreAlpha * 255).toString(16).padStart(2, '0')}`,
                    backgroundColor: `${colors.secondaryFixed}0D`,
                  }}
                >
                  <Text className="font-headline-extra text-base" style={{ color: colors.secondaryFixed, opacity: scoreAlpha }}>{w.score}</Text>
                  <Text className="font-label text-[9px] tracking-[0.5px] text-on-surface-variant">/10</Text>
                </View>
              )}
            </View>
            );
          })}
        </>
      )}

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}
