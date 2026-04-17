import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface CompareTextsViewProps {
  alternateView: string;
}

export function CompareTextsView({ alternateView }: CompareTextsViewProps) {
  return (
    <View className="rounded-[22px] border border-[rgba(160,120,200,0.12)] bg-[rgba(212,190,228,0.12)] p-4 dark:border-[rgba(212,190,228,0.08)] dark:bg-[rgba(212,190,228,0.08)]">
      <Text className="mb-2 font-label text-[11px] uppercase tracking-[1.2px] text-secondary-dim">
        Alternate Reading
      </Text>
      <Text className="font-body text-sm leading-5 text-on-surface">{alternateView}</Text>
    </View>
  );
}
