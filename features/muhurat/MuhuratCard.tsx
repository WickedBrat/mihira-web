// features/muhurat/MuhuratCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { VedicReasoningAccordion } from '@/features/horoscope/VedicReasoningAccordion';
import { colors, fonts } from '@/lib/theme';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface Props {
  hasRequested: boolean;
  recommendation: string | null;
  confidence: string | null;
  suggestion: string | null;
  reasoning: string | null;
  warnings: string | null;
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
  rankedWindows,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Calculating auspicious timings…</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.card}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (!hasRequested) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>
          Describe your situation and select a date range to see the strongest auspicious windows.
        </Text>
      </View>
    );
  }

  if (!recommendation) return null;

  const recColor = REC_COLORS[recommendation] ?? colors.onSurface;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { borderColor: recColor }]}>
          <Text style={[styles.badgeText, { color: recColor }]}>{recommendation}</Text>
        </View>
        {confidence && (
          <Text style={styles.confidence}>Confidence: {confidence}</Text>
        )}
      </View>

      {suggestion && <Text style={styles.suggestion}>{suggestion}</Text>}

      {warnings && warnings !== 'None' && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{warnings}</Text>
        </View>
      )}

      {rankedWindows.length > 0 && (
        <>
          <Text style={styles.windowsLabel}>Top Auspicious Windows · Highest Score First</Text>
          {rankedWindows.map((w, i) => (
            <View
              key={i}
              style={[styles.window, w.type === 'abhijit' && styles.windowAbhijit]}
            >
              <View style={styles.windowCopy}>
                <Text style={styles.windowDate}>
                  {new Date(w.start).toLocaleDateString([], {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.windowTime}>
                  {new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {new Date(w.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.windowQuality}>{w.quality}</Text>
              </View>
              {w.score != null && (
                <View style={[styles.scoreBadge, { borderColor: scoreColor(w.score) }]}>
                  <Text style={[styles.scoreText, { color: scoreColor(w.score) }]}>{w.score}</Text>
                  <Text style={styles.scoreDenom}>/10</Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: fonts.headlineExtra, fontSize: 18, letterSpacing: 1 },
  confidence: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
  },
  suggestion: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, lineHeight: 24,
  },
  warningBox: {
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  warningText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#fbbf24',
    lineHeight: 20,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  windowsLabel: {
    fontFamily: fonts.label, fontSize: 9, letterSpacing: 2,
    textTransform: 'uppercase', color: colors.secondaryFixed,
  },
  window: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8,
    gap: 12,
  },
  windowAbhijit: { borderWidth: 1, borderColor: 'rgba(255,159,75,0.4)' },
  windowCopy: {
    flex: 1,
    gap: 4,
  },
  windowDate: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.secondaryFixed,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  windowTime: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurface },
  windowQuality: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 1,
  },
  scoreText: {
    fontFamily: fonts.headlineExtra,
    fontSize: 16,
  },
  scoreDenom: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  loadingText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', marginTop: 12,
  },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.error, textAlign: 'center' },
});
