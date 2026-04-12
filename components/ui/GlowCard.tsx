import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedStyles } from '@/lib/theme-context';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowCard({ children, style, glowColor, glowIntensity = 0.2 }: GlowCardProps) {
  const hexOpacity = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');

  const { resolvedGlowColor, styles } = useThemedStyles((colors) => {
    const glow = glowColor ?? colors.primaryFixedDim;
    return {
      resolvedGlowColor: glow,
      styles: StyleSheet.create({
        container: { position: 'relative' as const },
        glowCanvas: {
          position: 'absolute' as const,
          top: -40,
          left: 0,
          right: 0,
          zIndex: 0,
          alignItems: 'center' as const,
        },
        card: {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: 24,
          borderWidth: 1,
          overflow: 'hidden' as const,
          zIndex: 1,
          borderColor: `${glow}33`,
        },
      }),
    };
  });

  const glowColorWithAlpha = `${resolvedGlowColor}${hexOpacity}`;
  const glowColorTransparent = `${resolvedGlowColor}00`;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[glowColorWithAlpha, glowColorTransparent]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.glowCanvas, { pointerEvents: 'none' }]}
      />
      <View style={[styles.card, { borderColor: `${resolvedGlowColor}33` }]}>
        {children}
      </View>
    </View>
  );
}
