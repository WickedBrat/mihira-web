// S3: Where It Lives
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { Chip } from '@/features/onboarding-new/Chip';
import { GoldCard } from '@/features/onboarding-new/GoldCard';
import { CONTEXTS, buildContextLine, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS3() {
  const stored = getOnboardingNewData();
  const [selected, setSelected] = useState<string[]>(stored.contexts);

  function toggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ contexts: selected });
    router.push('/onboarding-new/step-4');
  }

  const contextLine = buildContextLine(selected);

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-7 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <ScreenLabel>Where it lives</ScreenLabel>
          <Text className="text-center font-serif-medium text-[34px] leading-[41px] text-obn-text">
            Where does it show up most?
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] flex-row flex-wrap justify-between gap-y-3">
          {CONTEXTS.map((c, index) => (
            <Animated.View key={c.id} entering={FadeInDown.delay(index * 60 + 150).duration(380)} style={{ width: '48%' }}>
              <Chip label={c.label} active={selected.includes(c.id)} onPress={() => toggle(c.id)} shape="chip" />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeIn.duration(400)} className="w-full max-w-[360px]">
          <GoldCard label="Sacred timing · for later">
            <Text className="font-manrope text-[14px] leading-[21px] text-obn-text">{contextLine}</Text>
          </GoldCard>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} disabled={selected.length === 0} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
