import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/theme-context';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowCard({ children, style, glowColor, glowIntensity = 0.2 }: GlowCardProps) {
  const { colors } = useTheme();
  const hexOpacity = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');
  const resolvedGlowColor = glowColor ?? colors.primaryFixedDim;
  const glowColorWithAlpha = `${resolvedGlowColor}${hexOpacity}`;
  const glowColorTransparent = `${resolvedGlowColor}00`;

  return (
    <View className="relative" style={style}>
      <LinearGradient
        pointerEvents="none"
        colors={[glowColorWithAlpha, glowColorTransparent]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="absolute -top-10 left-0 right-0 z-0 items-center"
      />
      <View
        className="z-[1] overflow-hidden rounded-3xl border bg-surface-container-low"
        style={{ borderColor: `${resolvedGlowColor}33` }}
      >
        {children}
      </View>
    </View>
  );
}
