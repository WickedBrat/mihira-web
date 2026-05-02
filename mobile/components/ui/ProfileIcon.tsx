import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ProfileIconProps {
  size?: number;
  color?: string;
}

export function ProfileIcon({ size = 24, color = '#000' }: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960" fill="none">
      <Path
        fill={color}
        d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
      />
    </Svg>
  );
}
