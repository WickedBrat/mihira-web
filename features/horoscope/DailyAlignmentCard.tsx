import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FocusAreaCard } from './FocusAreaCard';
import { colors, fonts } from '@/lib/theme';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';

interface Props {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
  isLoading: boolean;
  error: string | null;
}

export function DailyAlignmentCard({ chart, focusAreas, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Reading the cosmos…</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (focusAreas.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Add your birth details in Profile to unlock your daily alignment.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {chart && (
        <Text style={styles.lagnaLabel}>
          {chart.lagna} Rising · {chart.nakshatra} Moon · {chart.currentDasha}
        </Text>
      )}
      {focusAreas.map((area, index) => (
        <FocusAreaCard
          key={area.area}
          focusArea={area}
          isLast={index === focusAreas.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  lagnaLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
    marginBottom: 20,
  },
  center: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
