import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/lib/theme';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowCard({
  children,
  style,
  glowColor = colors.primaryFixedDim,
  glowIntensity = 0.2,
}: GlowCardProps) {
  const hexOpacity = Math.round(glowIntensity * 255)
    .toString(16)
    .padStart(2, '0');
  const glowColorWithAlpha = `${glowColor}${hexOpacity}`;
  const glowColorTransparent = `${glowColor}00`;

  return (
    <View style={[styles.container, style]}>
      {/* Decorative glow behind card — LinearGradient approximation */}
      <LinearGradient
        colors={[glowColorWithAlpha, glowColorTransparent]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.glowCanvas, { pointerEvents: 'none' }]}
      />
      <View style={[styles.card, { borderColor: `${glowColor}33` }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowCanvas: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    zIndex: 0,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(25, 26, 26, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
});
