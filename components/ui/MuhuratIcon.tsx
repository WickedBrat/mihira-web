import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

interface MuhuratIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export function MuhuratIcon({
  size = 24,
  color = '#000',
  strokeWidth = 1.5,
}: MuhuratIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Outer circle */}
      <Circle cx="100" cy="100" r="90" stroke={color} strokeWidth={strokeWidth * 3} fill="none" />

      {/* Center figure (meditating) */}
      <Circle cx="100" cy="88" r="5" stroke={color} strokeWidth={strokeWidth * 2} fill="none" />
      <Path
        d="M100 93 C95 100 90 108 92 110 C94 112 100 107 100 107 C100 107 106 112 108 110 C110 108 105 100 100 93Z"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        fill="none"
      />

      {/* Center circle ring */}
      <Circle cx="100" cy="100" r="22" stroke={color} strokeWidth={strokeWidth * 2} fill="none" />

      {/* Spokes — 6 lines radiating outward */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x1 = 100 + 22 * Math.cos(rad);
        const y1 = 100 + 22 * Math.sin(rad);
        const x2 = 100 + 62 * Math.cos(rad);
        const y2 = 100 + 62 * Math.sin(rad);
        return (
          <Line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={strokeWidth * 2}
          />
        );
      })}

      {/* Outer symbols — alternating suns and moons at spoke ends */}
      {[0, 120, 240].map((angle) => {
        // Sun symbols (circle with rays)
        const rad = (angle - 90) * (Math.PI / 180);
        const cx = 100 + 68 * Math.cos(rad);
        const cy = 100 + 68 * Math.sin(rad);
        return (
          <G key={`sun-${angle}`}>
            <Circle cx={cx} cy={cy} r="12" stroke={color} strokeWidth={strokeWidth * 2} fill="none" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rayAngle) => {
              const rRad = rayAngle * (Math.PI / 180);
              const rx1 = cx + 12 * Math.cos(rRad);
              const ry1 = cy + 12 * Math.sin(rRad);
              const rx2 = cx + 17 * Math.cos(rRad);
              const ry2 = cy + 17 * Math.sin(rRad);
              return (
                <Line
                  key={rayAngle}
                  x1={rx1}
                  y1={ry1}
                  x2={rx2}
                  y2={ry2}
                  stroke={color}
                  strokeWidth={strokeWidth * 1.5}
                />
              );
            })}
          </G>
        );
      })}

      {[60, 180, 300].map((angle) => {
        // Crescent moon symbols
        const rad = (angle - 90) * (Math.PI / 180);
        const cx = 100 + 68 * Math.cos(rad);
        const cy = 100 + 68 * Math.sin(rad);
        return (
          <G key={`moon-${angle}`}>
            <Circle cx={cx} cy={cy} r="10" stroke={color} strokeWidth={strokeWidth * 2} fill="none" />
            <Circle cx={cx + 4} cy={cy - 2} r="8" fill={color} stroke="none" opacity={0.15} />
          </G>
        );
      })}
    </Svg>
  );
}
