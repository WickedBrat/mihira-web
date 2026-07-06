// S2: Naming the Ache
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel, GoldDivider } from '@/features/onboarding-new/PrimaryButton';
import { Chip } from '@/features/onboarding-new/Chip';
import { ACHES, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

const DEFAULT_ACK = 'Take your time. Nothing here is graded.';

export default function OnboardingNewS2() {
  const stored = getOnboardingNewData();
  const [selected, setSelected] = useState<string[]>(stored.aches);
  const [lastAche, setLastAche] = useState<string | null>(stored.lastAche);

  function toggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    setLastAche(id);
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ aches: selected, lastAche });
    router.push('/onboarding-new/step-3');
  }

  const ackText = selected.length === 0 ? DEFAULT_ACK : ACHES.find((a) => a.id === lastAche)?.ack ?? DEFAULT_ACK;

  return (
    <OnboardingNewScreen>
      <ScrollView contentContainerClassName="items-center gap-7 px-8 pt-11 pb-6" keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <ScreenLabel>Naming the ache</ScreenLabel>
          <Text className="text-center font-serif-medium text-[34px] leading-[41px] text-obn-text">
            What brings you here?
          </Text>
          <Text className="text-center font-manrope text-[15px] text-obn-muted">
            Choose everything that feels true right now.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {ACHES.map((ache, i) => (
            <Animated.View key={ache.id} entering={FadeInDown.delay(i * 70 + 200).duration(380)}>
              <Chip label={ache.label} active={selected.includes(ache.id)} onPress={() => toggle(ache.id)} shape="pill" />
            </Animated.View>
          ))}
        </View>

        <Animated.View key={lastAche ?? 'default'} entering={FadeIn.duration(400)} className="w-full max-w-[300px] items-center gap-2.5 pt-2">
          <GoldDivider />
          <Text className="text-center font-serif-medium-italic text-[19px] leading-[27px] text-obn-text">
            {ackText}
          </Text>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} disabled={selected.length === 0} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
