// S13: Cosmic Signature — Star Ledger
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData } from '@/lib/onboardingNewStore';

const LEDGER = [
  { label: 'Rashi', value: 'Simha' },
  { label: 'Moon', value: 'Ninth house' },
  { label: 'This season', value: 'Turn loyalty inward' },
];

export default function OnboardingNewS13() {
  const name = getOnboardingNewData().name || 'Friend';

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-14');
  }

  return (
    <OnboardingNewScreen glow="top" glowIntensity={0.16}>
      <View className="flex-1 items-center justify-center gap-8 px-8">
        <Animated.View entering={FadeIn.delay(150).duration(600)} className="items-center gap-3.5">
          <Text className="font-manrope-bold text-[10px] uppercase tracking-[4px] text-obn-gold">
            {name} · recorded at birth
          </Text>
          <Text className="text-center font-serif-medium text-[46px] leading-[50px] text-obn-text">
            Uttara{'\n'}
            <Text className="font-serif-medium-italic text-obn-gold">Phalguni</Text>
          </Text>
          <Text className="font-serif-regular-italic text-[16px] text-obn-muted">the star of steady generosity</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500).duration(600)} className="w-full max-w-[300px]">
          {LEDGER.map((row, i) => (
            <View key={row.label} className={`flex-row items-baseline justify-between border-t border-obn-gold-border-soft py-[11px] ${i === LEDGER.length - 1 ? 'border-b' : ''}`}>
              <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-muted-dim">{row.label}</Text>
              <Text className="font-serif-medium text-[18px] text-obn-text">{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(750).duration(600)} className="text-center font-serif-regular-italic text-[17px] leading-[24px] text-obn-gold">
          This is the first page of your book.{'\n'}There will be more.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
