import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { Canvas, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import { colors } from '@/lib/theme';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function GlowCard({
  children,
  style,
  glowColor = colors.primaryFixedDim,
  glowIntensity = 0.2,
}: GlowCardProps) {
  const canvasWidth = SCREEN_WIDTH - 48; // 24px padding each side
  const canvasHeight = 80;

  // Convert glowIntensity (0-1) to hex opacity
  const hexOpacity = Math.round(glowIntensity * 255)
    .toString(16)
    .padStart(2, '0');
  const glowColorWithAlpha = `${glowColor}${hexOpacity}`;
  const glowColorTransparent = `${glowColor}00`;

  return (
    <View style={[styles.container, style]}>
      {/* Skia radial glow — decorative, sits behind content */}
      <View style={styles.glowCanvas} pointerEvents="none">
        <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
          <Rect x={0} y={0} width={canvasWidth} height={canvasHeight}>
            <RadialGradient
              c={vec(canvasWidth / 2, 0)}
              r={canvasWidth * 0.6}
              colors={[glowColorWithAlpha, glowColorTransparent]}
            />
          </Rect>
        </Canvas>
      </View>
      <View
        style={[
          styles.card,
          { borderColor: `${glowColor}33` },
        ]}
      >
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
