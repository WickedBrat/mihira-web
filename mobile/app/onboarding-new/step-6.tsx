// S6: This Is Ask Mihira
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData } from '@/lib/onboardingNewStore';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default function OnboardingNewS6() {
  const question = getOnboardingNewData().firstQuestion.trim();

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-7');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center justify-center gap-7 px-8">
        {question ? (
          <Animated.View entering={FadeIn.delay(120).duration(500)} className="w-full max-w-[360px] gap-3 rounded-[20px] border border-obn-gold-border-soft bg-obn-gold-dim p-5">
            <Text
              numberOfLines={2}
              style={{ maxWidth: '88%' }}
              className="self-end rounded-[16px] rounded-br-sm border border-obn-card-border bg-obn-card px-3.5 py-2.5 font-manrope text-[12px] leading-[18px] text-obn-text-soft"
            >
              {truncate(question, 90)}
            </Text>
            <View className="gap-2">
              <Text className="font-manrope-bold text-[9px] uppercase tracking-[2px] text-obn-gold">
                What I'm hearing · Scriptural anchor · For today
              </Text>
              <View style={{ width: '92%' }} className="h-[6px] rounded-full bg-white/10" />
              <View style={{ width: '78%' }} className="h-[6px] rounded-full bg-white/10" />
              <View style={{ width: '58%' }} className="h-[6px] rounded-full bg-white/[0.07]" />
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} className="max-w-[320px] items-center gap-3">
          <ScreenLabel>A home for this</ScreenLabel>
          <Text className="text-center font-serif-medium text-[34px] leading-[41px] text-obn-text">
            This is called <Text className="font-serif-medium-italic text-obn-gold">Ask Mihira</Text>.
          </Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            It's where you just were. Any question, answered from scripture — waiting in the Guidance tab whenever you need it.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
