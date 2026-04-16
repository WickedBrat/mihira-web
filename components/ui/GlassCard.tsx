import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/lib/theme-context';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  const { isDark } = useTheme();

  return (
    <View
      className="overflow-hidden rounded-3xl border border-black/[0.08] dark:border-outline-variant/[0.15]"
      style={style}
    >
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
      <View className="absolute inset-0 bg-[rgba(250,247,242,0.6)] dark:bg-[rgba(37,38,38,0.5)]" />
      <View className="relative z-[1]">{children}</View>
    </View>
  );
}
