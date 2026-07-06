// S19: The Closed Door — Gurukul
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { BookOpenIcon } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData, getVow } from '@/lib/onboardingNewStore';

export default function OnboardingNewS19() {
  const vow = getVow(getOnboardingNewData().vow);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-20');
  }

  return (
    <OnboardingNewScreen glow="bottom" glowIntensity={0.3}>
      <View className="flex-1 items-center justify-center gap-8 px-8">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[300px] items-center gap-2">
          <ScreenLabel>One room stays closed</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">
            Gurukul opens once you've kept this rhythm.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="w-full max-w-[320px] items-center gap-3.5 rounded-[26px] border border-obn-card-border bg-obn-card px-7 py-8">
          <BookOpenIcon size={26} color="#E8A33D" />
          <Text className="font-serif-semibold text-[28px] text-obn-text">Gurukul</Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            A guided library of wisdom, breathwork and philosophy — sealed until your {vow.short} season is kept.
          </Text>
          <View className="rounded-full border border-obn-gold-border px-[18px] py-2">
            <Text className="font-manrope-bold text-[11px] uppercase tracking-[1.5px] text-obn-gold">Opens with a kept rhythm</Text>
          </View>
        </Animated.View>

        <Text className="max-w-[300px] text-center font-manrope text-[13px] leading-[20px] text-obn-muted-dim">
          There's no key to buy. The vow you just made is the only way in.
        </Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
