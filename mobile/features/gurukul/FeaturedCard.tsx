import React from 'react';
import {
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { useTheme } from '@/lib/theme-context';

interface FeaturedCardProps {
  title: string;
  description: string;
  duration: string;
  onBegin: () => void;
}

export function FeaturedCard({ title, description, duration, onBegin }: FeaturedCardProps) {
  const { colors } = useTheme();
  const bgGradientColors: [string, string] = [colors.surfaceContainerHigh, colors.surface];
  const fadeGradientColors: ['transparent', string] = ['transparent', colors.surface];

  return (
    <View className="h-[280px] justify-end overflow-hidden rounded-[28px] border border-black/[0.08] dark:border-[rgba(37,38,38,0.6)]">
      <LinearGradient
        colors={bgGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={fadeGradientColors}
        className="absolute bottom-0 left-0 right-0 h-[70%]"
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View className="gap-2.5 p-8">
        <View className="mb-1.5 flex-row items-center gap-1.5">
          <Sparkles size={12} color={colors.primary} />
          <Text className="font-label text-[9px] uppercase tracking-[2px] text-primary">Featured Wisdom</Text>
        </View>
        <Text className="font-headline text-[26px] leading-8 tracking-[-0.4px] text-on-surface">{title}</Text>
        <Text className="font-body text-sm leading-[18px] text-on-surface-variant">{description}</Text>
        <Text className="font-label text-[9px] uppercase tracking-[2px] text-on-surface-variant opacity-60">{duration}</Text>
        <SacredButton label="Begin Session" onPress={onBegin} style={{ alignSelf: 'flex-start', marginTop: 10 }} />
      </View>
    </View>
  );
}
