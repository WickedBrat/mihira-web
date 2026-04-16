import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FocusAreaCard } from './FocusAreaCard';
import { useTheme } from '@/lib/theme-context';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';

interface Props {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
  isLoading: boolean;
  error: string | null;
}

export function DailyAlignmentCard({ chart, focusAreas, isLoading, error }: Props) {
  const { colors } = useTheme();
  if (isLoading) {
    return (
      <View className="items-center gap-3 py-6">
        <ActivityIndicator color={colors.primary} />
        <Text className="font-body text-sm text-on-surface-variant">Reading the cosmos…</Text>
      </View>
    );
  }

  if (error) {
    return <Text className="text-center font-body text-sm text-error">{error}</Text>;
  }

  if (focusAreas.length === 0) {
    return (
      <Text className="text-center font-body text-sm leading-[22px] text-on-surface-variant">
        Add your birth details in Profile to unlock your daily alignment.
      </Text>
    );
  }

  return (
    <View>
      {chart && (
        <Text className="mb-5 font-label text-[9px] uppercase tracking-[2px] text-secondary-fixed">
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
