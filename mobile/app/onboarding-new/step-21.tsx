// S21: Book of You — Open Spread
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getFirstSelectedAche, getOnboardingNewData, getVow } from '@/lib/onboardingNewStore';

const PAGE_NUMBERS = Array.from({ length: 19 }, (_, i) => i + 3);

export default function OnboardingNewS21() {
  const stored = getOnboardingNewData();
  const name = stored.name || 'friend';
  const ache = getFirstSelectedAche(stored);
  const vow = getVow(stored.vow);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-22');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-6 px-7 pt-10">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <ScreenLabel>The Book of You</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">
            Page one is already written.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="w-full max-w-[340px] flex-row gap-0.5">
          <View className="flex-1 gap-3.5 rounded-l-2xl rounded-r border border-obn-gold-border-soft bg-obn-gold-dim px-4 py-5">
            <Text className="font-manrope-bold text-[9px] uppercase tracking-[2px] text-obn-gold">Page one</Text>
            <View className="gap-2.5">
              <View>
                <Text className="font-manrope-bold text-[10px] tracking-[1.5px] text-obn-muted-dim">NAME</Text>
                <Text className="font-serif-medium text-[17px] text-obn-text">{name}</Text>
              </View>
              <View>
                <Text className="font-manrope-bold text-[10px] tracking-[1.5px] text-obn-muted-dim">CARRYING</Text>
                <Text className="font-serif-medium text-[17px] text-obn-text">{ache.title}</Text>
              </View>
              <View>
                <Text className="font-manrope-bold text-[10px] tracking-[1.5px] text-obn-muted-dim">BORN UNDER</Text>
                <Text className="font-serif-medium text-[17px] text-obn-text">Uttara Phalguni</Text>
              </View>
              <View>
                <Text className="font-manrope-bold text-[10px] tracking-[1.5px] text-obn-muted-dim">VOW</Text>
                <Text className="font-serif-medium text-[17px] text-obn-text">{vow.name} · 21 days</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 gap-3.5 rounded-r-2xl rounded-l border border-obn-card-border bg-obn-card px-4 py-5">
            <Text className="font-manrope-bold text-[9px] uppercase tracking-[2px] text-obn-muted-dim">Page two — reserved</Text>
            <View className="gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} className="h-px bg-white/10" />
              ))}
            </View>
            <Text className="mt-auto font-serif-regular-italic text-[13px] text-obn-muted-dim">tomorrow, after your window</Text>
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(350).duration(500)} className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
          This is page one. <Text className="font-manrope-bold text-obn-gold">{PAGE_NUMBERS.length + 1} pages</Text> are already reserved for the rhythm you just chose.
        </Animated.Text>

        <View className="w-full max-w-[320px] flex-row flex-wrap justify-center gap-1.5">
          {PAGE_NUMBERS.map((p) => (
            <View key={p} className="h-8 w-[26px] items-center justify-center rounded border border-obn-card-border">
              <Text className="font-manrope text-[10px] text-obn-muted-dim">{p}</Text>
            </View>
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Keep my book →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
