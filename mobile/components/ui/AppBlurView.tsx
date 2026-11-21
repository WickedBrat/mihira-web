import React from 'react';
import { Platform } from 'react-native';
import { BlurView, type BlurViewProps } from 'expo-blur';
import { cssInterop } from 'nativewind';

// expo-blur ships precompiled JSX, so NativeWind never sees the `className`
// it forwards to its inner View. Register it so `className` (e.g.
// "absolute inset-0") is turned into a style; without this the blur view
// lays out at zero height and nothing is blurred.
const StyledBlurView = cssInterop(BlurView, { className: 'style' });

type AppBlurViewProps = BlurViewProps & { className?: string };

export function AppBlurView(props: AppBlurViewProps) {
  return (
    <StyledBlurView
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      blurReductionFactor={Platform.OS === 'android' ? 2 : undefined}
      {...props}
    />
  );
}
