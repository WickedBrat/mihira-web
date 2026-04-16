import React from 'react';
import { View } from 'react-native';
import Svg, { RadialGradient, Defs, Rect, Stop } from 'react-native-svg';

interface AmbientBlobProps {
  /** Color in rgba(...) or #rrggbbaa format */
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
  // Parse rgba(r,g,b,a) format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  // Parse #rrggbbaa or #rrggbb format
  const hexMatch = !rgbaMatch && color.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);

  let stopColor = '#d4bee4';
  let stopOpacity = '0.08';

  if (rgbaMatch) {
    stopColor = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
    stopOpacity = rgbaMatch[4] ?? '0.08';
  } else if (hexMatch) {
    stopColor = `#${hexMatch[1]}`;
    stopOpacity = hexMatch[2]
      ? (parseInt(hexMatch[2], 16) / 255).toFixed(2)
      : '1';
  }

  return (
    <View
      className="absolute -z-10"
      style={{ top, left, width: size, height: size }}
      pointerEvents="none"
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="40%">
            <Stop offset="0%" stopColor={stopColor} stopOpacity={stopOpacity} />
            <Stop offset="100%" stopColor={stopColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={size} height={size} fill="url(#grad)" />
      </Svg>
    </View>
  );
}
