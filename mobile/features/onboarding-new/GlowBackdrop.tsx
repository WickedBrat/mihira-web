import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface GlowBackdropProps {
  /** 'top' matches the mock's `ellipse 90% 45% at 50% 0%` header glow; 'center'/'bottom' match reveal-screen glows lower on the page. */
  variant?: 'top' | 'center' | 'bottom';
  intensity?: number;
}

/** Warm ellipse glow behind onboarding-new screens — approximates the HTML mock's CSS radial-gradient header glow using an SVG radial gradient (RN has no CSS radial-gradient equivalent). */
export function GlowBackdrop({ variant = 'top', intensity = 0.3 }: GlowBackdropProps) {
  const { width, height } = useWindowDimensions();
  const cyPct = variant === 'top' ? '0%' : variant === 'bottom' ? '100%' : '35%';
  const gradId = `obnGlow-${variant}`;

  return (
    <View className="absolute inset-0" pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy={cyPct} rx="70%" ry="35%">
            <Stop offset="0%" stopColor="#5A3712" stopOpacity={intensity} />
            <Stop offset="65%" stopColor="#5A3712" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${gradId})`} />
      </Svg>
    </View>
  );
}
