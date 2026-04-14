import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import MuhuratAsset from '@/assets/muhurat.svg';

interface MuhuratSvgProps extends SvgProps {
  width?: number;
  height?: number;
  /** Fill color applied to all paths (the SVG has no inline fills). */
  fill?: string;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'none' | 'auto' | 'box-none' | 'box-only';
}

export function MuhuratSvg({ width = 400, height = 400, fill = '#ffffffff', style, pointerEvents, ...rest }: MuhuratSvgProps) {
  return (
    <MuhuratAsset
      width={width}
      height={height}
      fill={fill}
      style={style as any}
      pointerEvents={pointerEvents}
      {...rest}
    />
  );
}
