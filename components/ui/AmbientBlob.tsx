import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { RadialGradient, Defs, Rect, Stop } from 'react-native-svg';

interface AmbientBlobProps {
  color?: string;
  top?: number;
  left?: number;
  size?: number;
}

export function AmbientBlob({
  color = 'rgba(212, 190, 228, 0.08)',
  top = -100,
  left = -100,
  size = 400,
}: AmbientBlobProps) {
  // Parse rgba into stopColor + stopOpacity for SVG
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  const stopColor = match
    ? `rgb(${match[1]}, ${match[2]}, ${match[3]})`
    : '#d4bee4';
  const stopOpacity = match?.[4] ?? '0.08';

  return (
    <View
      style={[styles.blob, { top, left, width: size, height: size }]}
      pointerEvents="none"
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={stopColor} stopOpacity={stopOpacity} />
            <Stop offset="100%" stopColor={stopColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={size} height={size} fill="url(#grad)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    zIndex: -1,
  },
});
