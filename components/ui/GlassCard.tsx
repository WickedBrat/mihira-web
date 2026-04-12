import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  const { isDark } = useTheme();
  const styles = useThemedStyles((_colors, _glass, _gradients, darkMode) =>
    StyleSheet.create({
      container: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: darkMode ? 'rgba(72, 72, 72, 0.15)' : 'rgba(0, 0, 0, 0.08)',
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: darkMode ? 'rgba(37, 38, 38, 0.5)' : 'rgba(250, 247, 242, 0.6)',
      },
      content: { position: 'relative', zIndex: 1 },
    })
  );

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}
