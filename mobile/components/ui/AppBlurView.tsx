import React from 'react';
import { Platform } from 'react-native';
import { BlurView, type BlurViewProps } from 'expo-blur';

export function AppBlurView(props: BlurViewProps) {
  return (
    <BlurView
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      blurReductionFactor={Platform.OS === 'android' ? 2 : undefined}
      {...props}
    />
  );
}
