import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { GlowBackdrop } from './GlowBackdrop';
import { OnboardingNewStarField } from './StarField';

interface ScreenProps {
  children: React.ReactNode;
  glow?: 'top' | 'center' | 'bottom';
  glowIntensity?: number;
}

/** Shared screen shell for onboarding-new: dark bg, warm glow, starfield, dev back button — no progress bar (the HTML mock has none). */
export function OnboardingNewScreen({ children, glow = 'top', glowIntensity = 0.3 }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-obn-bg">
      <OnboardingDevBackButton />
      <GlowBackdrop variant={glow} intensity={glowIntensity} />
      <OnboardingNewStarField />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
