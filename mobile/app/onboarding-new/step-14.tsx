// S14: Sacred Timing, Revealed
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { buildTimingHeadline, getOnboardingNewData } from '@/lib/onboardingNewStore';

const TAGS = ['Events', 'Travel', 'Ceremonies', 'Big decisions'];

export default function OnboardingNewS14() {
  const timingHeadline = buildTimingHeadline(getOnboardingNewData().contexts);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-15');
  }

  return (
    <OnboardingNewScreen glowIntensity={0.28}>
      <View className="flex-1 items-center justify-center gap-6 px-8">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-2">
          <ScreenLabel>Sacred timing</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">{timingHeadline}</Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            Here's Sacred Timing — the window for your next move.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="w-full max-w-[340px] items-center gap-2.5 rounded-[26px] border border-obn-gold-border bg-obn-gold-dim px-6 py-7">
          <Text className="font-manrope-bold text-[10px] uppercase tracking-[2.5px] text-obn-gold">Best window · Next 7 days</Text>
          <Text className="font-serif-medium text-[42px] leading-[46px] text-obn-text">Thu · 10:42 AM</Text>
          <Text className="font-manrope text-[13px] text-obn-muted">until 12:15 PM · Mercury steadies speech</Text>
          <View className="my-1 h-px w-9 bg-obn-gold-border" />
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-text-soft">
            Favorable for the conversation you've been postponing — or the decision you keep deferring.
          </Text>
        </Animated.View>

        <View className="flex-row flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <View key={tag} className="rounded-full border border-obn-card-border px-4 py-2">
              <Text className="font-manrope-semibold text-[12px] text-obn-muted">{tag}</Text>
            </View>
          ))}
        </View>
        <Text className="text-center font-manrope text-[12px] text-obn-muted-dim">Computed from the chart you just unlocked.</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
