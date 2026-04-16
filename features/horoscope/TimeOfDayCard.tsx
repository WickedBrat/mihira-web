import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/lib/theme-context';
import type { TimelineEntry } from './types';

const BG_IMAGES: Record<string, ReturnType<typeof require>> = {
  morning: require('@/assets/time-of-the-day/morning.png'),
  afternoon: require('@/assets/time-of-the-day/afternoon.png'),
  evening: require('@/assets/time-of-the-day/night.png'),
  night: require('@/assets/time-of-the-day/night.png'),
};

interface Props {
  entry: TimelineEntry;
  isLast?: boolean;
}

export function TimeOfDayCard({ entry, isLast = false }: Props) {
  const { isDark } = useTheme();
  const image = BG_IMAGES[entry.id] ?? BG_IMAGES.morning;

  return (
    <View className="items-center">
      <ImageBackground
        source={image ?? ''}
        className="min-h-[190px] self-stretch overflow-hidden rounded-3xl"
        imageStyle={{ borderRadius: 24 }}
        resizeMode="cover"
      >
        <BlurView intensity={8} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.6)']}
          className="min-h-[190px] flex-1 justify-end gap-1.5 p-5"
        >
          <View className="flex-row items-center gap-1.5">
            <Text className="font-label text-xs uppercase tracking-[3px] text-white/65">{entry.subtitle}</Text>
            <View className="h-[5px] w-[5px] rounded-full bg-black/20 dark:bg-white/25" />
            {entry.timeRange ? (
              <Text className="font-label text-xs uppercase tracking-[3px] text-white/65">{entry.timeRange}</Text>
            ) : null}
          </View>
          <Text className="font-headline text-2xl leading-7 tracking-[-0.4px] text-white">{entry.label}</Text>
          <Text className="mt-1 font-body text-sm italic leading-[22px] text-white/80">{entry.quote}</Text>
        </LinearGradient>
      </ImageBackground>

      {!isLast && (
        <View className="h-8 items-center gap-1 py-1">
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/[0.12]" />
          <View className="h-[5px] w-[5px] rounded-full bg-black/20 dark:bg-white/25" />
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/[0.12]" />
        </View>
      )}
    </View>
  );
}
