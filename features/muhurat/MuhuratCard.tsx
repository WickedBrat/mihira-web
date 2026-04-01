// features/muhurat/MuhuratCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { VedicReasoningAccordion } from '@/features/horoscope/VedicReasoningAccordion';
import { colors, fonts } from '@/lib/theme';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface Props {
  recommendation: string | null;
  suggestion: string | null;
  reasoning: string | null;
  windows: MuhuratWindow[];
  isLoading: boolean;
  error: string | null;
}

const REC_COLORS: Record<string, string> = {
  Yes:  '#4ade80',
  No:   '#f87171',
  Wait: '#fbbf24',
};

export function MuhuratCard({ recommendation, suggestion, reasoning, windows, isLoading, error }: Props) {
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

  if (!recommendation) return null;

  const recColor = REC_COLORS[recommendation] ?? colors.onSurface;

  return (
    <View style={styles.card}>
      <View style={[styles.badge, { borderColor: recColor }]}>
        <Text style={[styles.badgeText, { color: recColor }]}>{recommendation}</Text>
      </View>

      {suggestion && <Text style={styles.suggestion}>{suggestion}</Text>}

      <Text style={styles.windowsLabel}>Today's Auspicious Windows</Text>
      {windows.filter(w => w.isAuspicious).map((w, i) => (
        <View
          key={i}
          style={[styles.window, w.type === 'abhijit' && styles.windowAbhijit]}
        >
          <Text style={styles.windowTime}>
            {new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' – '}
            {new Date(w.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.windowQuality}>{w.quality}</Text>
        </View>
      ))}

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
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: fonts.headlineExtra, fontSize: 18, letterSpacing: 1 },
  suggestion: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, lineHeight: 24,
  },
  windowsLabel: {
    fontFamily: fonts.label, fontSize: 9, letterSpacing: 2,
    textTransform: 'uppercase', color: colors.secondaryFixed,
  },
  window: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8,
  },
  windowAbhijit: { borderWidth: 1, borderColor: 'rgba(255,159,75,0.4)' },
  windowTime: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurface },
  windowQuality: { fontFamily: fonts.label, fontSize: 9, color: colors.secondaryFixed, letterSpacing: 1 },
  loadingText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', marginTop: 12,
  },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.error, textAlign: 'center' },
});
