import React from 'react';
import {
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { ConstellationLoader } from '@/components/ui/ConstellationLoader';
import { FocusAreaCard } from './FocusAreaCard';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyFocusArea } from '@/lib/dailyAlignmentTypes';

interface Props {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
  isLoading: boolean;
  error: string | null;
}

export function DailyAlignmentCard({ chart, focusAreas, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <View className="py-2">
        <ConstellationLoader
          size={150}
          message="Reading the cosmos…"
        />
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
