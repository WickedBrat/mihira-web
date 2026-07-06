// S18: The Vow — Spoken Sankalpa
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { VOWS, getOnboardingNewData, getVow, setOnboardingNewData, type Vow } from '@/lib/onboardingNewStore';

export default function OnboardingNewS18() {
  const stored = getOnboardingNewData();
  const name = stored.name || 'friend';
  const [vowId, setVowId] = useState<Vow['id']>(stored.vow);
  const vow = getVow(vowId);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ vow: vowId });
    router.push('/onboarding-new/step-19');
  }

  return (
    <OnboardingNewScreen glow="bottom" glowIntensity={0.3}>
      <View className="flex-1 items-center justify-center gap-9 px-8">
        <Animated.View entering={FadeInDown.duration(500)}>
          <ScreenLabel>Your sankalpa</ScreenLabel>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text className="text-center font-serif-medium text-[32px] leading-[46px] text-obn-text">
            I, <Text className="font-serif-medium-italic text-obn-gold">{name}</Text>, will keep{' '}
            <Text className="font-serif-medium-italic text-obn-gold">{vow.name}</Text> — {vow.min} minutes a day — for my
            first <Text className="font-serif-medium-italic text-obn-gold">21 days</Text>.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View className="w-full flex-row flex-wrap justify-center gap-2">
          {VOWS.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setVowId(v.id);
              }}
              className={`rounded-full border px-3.5 py-2.5 ${
                vowId === v.id ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'
              }`}
            >
              <Text className={`font-manrope-semibold text-[13px] ${vowId === v.id ? 'text-obn-text' : 'text-obn-muted'}`}>
                {v.short} · {v.min} min
              </Text>
            </Pressable>
          ))}
          </View>
        </Animated.View>

        <Text className="max-w-[300px] text-center font-manrope text-[13px] leading-[20px] text-obn-muted-dim">
          In the old practice, a vow was bounded — a season, not forever. This one ends in 21 days, unless you renew it.
        </Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Speak the vow →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
