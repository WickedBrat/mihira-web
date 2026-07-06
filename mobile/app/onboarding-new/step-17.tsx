// S17: Today, Unfinished
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS17() {
  const name = getOnboardingNewData().name || 'friend';
  const [reflectOpen, setReflectOpen] = useState(false);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-18');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-6 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <ScreenLabel>Today, unfinished</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">
            Today was prepared for you, {name}.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] gap-3.5">
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="gap-2 rounded-[22px] border border-obn-gold-border-soft bg-obn-card px-5 py-4">
            <View className="flex-row items-baseline justify-between gap-2.5">
              <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">Partnership</Text>
              <Text className="font-manrope text-[12px] text-obn-muted-dim">8:00 – 10:00 AM</Text>
            </View>
            <Text className="font-manrope text-[14px] leading-[21px] text-obn-text-soft">
              Say the difficult thing gently — the window favors honesty held with care.
            </Text>
            <Text className="font-manrope text-[12px] text-obn-muted-dim">Bhagavad Gita 2.47</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(280).duration(400)} className="gap-2 rounded-[22px] border border-obn-gold-border-soft bg-obn-card px-5 py-4">
            <View className="flex-row items-baseline justify-between gap-2.5">
              <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">Daily quote</Text>
              <Text className="font-manrope text-[12px] text-obn-muted-dim">free, every day</Text>
            </View>
            <Text className="font-serif-regular-italic text-[17px] leading-[24px] text-obn-text">
              "Let a person lift themselves by their own self; let them not lower themselves."
            </Text>
            <Text className="font-manrope text-[12px] text-obn-muted-dim">Bhagavad Gita 6.5</Text>

            {!reflectOpen ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setReflectOpen(true);
                }}
                className="mt-1 self-start rounded-full border border-obn-gold-border bg-obn-gold-dim px-5 py-2"
              >
                <Text className="font-manrope-bold text-[13px] text-obn-gold">Reflect</Text>
              </Pressable>
            ) : (
              <Animated.View entering={FadeIn.duration(400)} className="gap-2 border-t border-obn-gold-border-soft pt-2.5">
                <View className="gap-0.5">
                  <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-gold">Meaning</Text>
                  <Text className="font-manrope text-[13px] leading-[20px] text-obn-text-soft">
                    The self is the only instrument you fully hold. Raising it is nobody else's job.
                  </Text>
                </View>
                <View className="gap-0.5">
                  <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-gold">One step</Text>
                  <Text className="font-manrope text-[13px] leading-[20px] text-obn-text-soft">
                    Name one habit that lowers you. Skip it once today, deliberately.
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="overflow-hidden rounded-[22px]">
            <View className="gap-2 border border-obn-gold-border-soft bg-obn-card px-5 py-4">
              <View className="flex-row items-baseline justify-between gap-2.5">
                <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">Rest &amp; recovery</Text>
                <Text className="font-manrope text-[12px] text-obn-muted-dim">9:00 – 10:00 PM</Text>
              </View>
              <Text className="font-manrope text-[14px] leading-[21px] text-obn-text-soft">
                Close the day without a screen — let the mind settle like water.
              </Text>
              <Text className="font-manrope text-[12px] text-obn-muted-dim">Katha Upanishad 1.3.13</Text>
            </View>
            <BlurView intensity={30} tint="dark" className="absolute inset-0 items-center justify-center px-6">
              <Text className="text-center font-manrope-semibold text-[14px] leading-[21px] text-obn-text">
                One more layer of today is ready — it opens the moment your vow is set.
              </Text>
            </BlurView>
          </Animated.View>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Make my vow →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
