// S20: When Mihira Finds You
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { formatMinutesAsClock, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';
import { scheduleDailyDayPreviewNotificationAsync } from '@/lib/notifications';

export default function OnboardingNewS20() {
  const stored = getOnboardingNewData();
  const [alignMinutes, setAlignMinutes] = useState(stored.alignMinutes);
  const [alignMode, setAlignMode] = useState<'suggested' | 'fresh'>(stored.alignMode);

  const label = alignMode === 'fresh' ? 'Fresh daily' : formatMinutesAsClock(alignMinutes);
  const notifLine =
    (alignMode === 'fresh' ? "Today's window opens at " : 'Your window opens at ') +
    formatMinutesAsClock(alignMinutes) +
    ' — Mercury favors the conversation you\'ve been postponing.';

  function adjust(delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAlignMinutes((m) => Math.min(720, Math.max(240, m + delta)));
    setAlignMode('suggested');
  }

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ alignMinutes, alignMode });

    if (alignMode === 'suggested') {
      const hour = Math.floor(alignMinutes / 60);
      const minute = alignMinutes % 60;
      void scheduleDailyDayPreviewNotificationAsync(hour, minute).catch((err) => {
        console.error('[onboarding-new] notification scheduling failed', err);
      });
    }

    router.push('/onboarding-new/step-21');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-8 px-8 pt-10">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-2">
          <ScreenLabel>When Mihira finds you</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">
            Your alignment window isn't arbitrary.
          </Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            It's calculated from your chart — this one feels right for you.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="w-full max-w-[340px] items-center gap-7">
          <View className="flex-row items-center justify-center gap-6">
            <Pressable onPress={() => adjust(-15)} className="h-12 w-12 items-center justify-center rounded-full border border-obn-card-border bg-obn-card">
              <Text className="font-manrope text-xl text-obn-text-soft">−</Text>
            </Pressable>
            <Text className="min-w-[190px] text-center font-serif-medium text-[52px] text-obn-text">{label}</Text>
            <Pressable onPress={() => adjust(15)} className="h-12 w-12 items-center justify-center rounded-full border border-obn-card-border bg-obn-card">
              <Text className="font-manrope text-xl text-obn-text-soft">+</Text>
            </Pressable>
          </View>

          <View className="w-full gap-2.5">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAlignMode('suggested');
              }}
              className={`rounded-full border px-4 py-3.5 ${alignMode === 'suggested' ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'}`}
            >
              <Text className="text-center font-manrope-semibold text-[14px] text-obn-text-soft">Use this window every day</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAlignMode('fresh');
              }}
              className={`rounded-full border px-4 py-3.5 ${alignMode === 'fresh' ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'}`}
            >
              <Text className="text-center font-manrope-semibold text-[14px] text-obn-text-soft">Let Mihira decide it fresh each day</Text>
            </Pressable>
          </View>

          <View className="w-full flex-row items-start gap-3.5 rounded-[20px] border border-obn-card-border bg-obn-card px-4 py-4">
            <View className="h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-obn-gold-border">
              <Text className="font-serif-semibold text-[20px] text-obn-gold">म</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <View className="flex-row justify-between gap-2.5">
                <Text className="font-manrope-bold text-[13px] text-obn-text">Mihira</Text>
                <Text className="font-manrope text-[11px] text-obn-muted-dim">now</Text>
              </View>
              <Text className="font-manrope text-[13px] leading-[20px] text-obn-text-soft">{notifLine}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Set my window →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
