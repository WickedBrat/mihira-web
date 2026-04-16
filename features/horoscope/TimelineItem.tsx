import React from 'react';
import { View, Text } from 'react-native';
import { View as MotiView } from 'moti/build/components/view';
import { LinearGradient } from 'expo-linear-gradient';
import type { TimelineEntry } from './types';

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ entry, index, isLast = false }: TimelineItemProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 120, damping: 18 }}
      className="flex-row items-stretch gap-4"
    >
      <View className="w-12 items-center">
        <LinearGradient
          colors={entry.gradientColors}
          className="z-[2] mt-1 h-12 w-12 items-center justify-center rounded-full"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text className="text-xl">{entry.emoji}</Text>
        </LinearGradient>
        {!isLast && <View className="z-[1] mb-[-4px] mt-1 w-0.5 flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />}
      </View>

      <View className="mb-4 flex-1 rounded-3xl border border-black/[0.06] bg-[rgba(232,225,212,0.6)] p-5 dark:border-white/[0.05] dark:bg-[rgba(37,38,38,0.6)]">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-headline text-base tracking-[-0.2px] text-on-surface">{entry.label}</Text>
            <Text className="mt-[3px] font-label text-[9px] uppercase tracking-[2px] text-primary-dim">{entry.subtitle}</Text>
          </View>
          <Text className="text-right font-body text-xs text-on-surface/30">{entry.timeRange}</Text>
        </View>
        <Text className="font-body text-sm italic leading-5 text-on-surface-variant">{entry.quote}</Text>
      </View>
    </MotiView>
  );
}
