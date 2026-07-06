// S7: Personalization
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { Chip } from '@/features/onboarding-new/Chip';
import { GENDERS, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS7() {
  const stored = getOnboardingNewData();
  const [gender, setGender] = useState(stored.gender || GENDERS[0]);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ gender });
    router.push('/onboarding-new/step-8');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center justify-center gap-8 px-8">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-3">
          <ScreenLabel>Personalization</ScreenLabel>
          <Text className="text-center font-serif-medium text-[34px] leading-[41px] text-obn-text">
            Who is this guidance for?
          </Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            This shapes the voice and imagery of your daily guidance — not your guidance itself.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] gap-3">
          {GENDERS.map((g, i) => (
            <Animated.View key={g} entering={FadeInDown.delay(i * 80 + 200).duration(380)}>
              <Chip
                label={g}
                active={gender === g}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGender(g);
                }}
                shape="pill"
                showCheck={false}
              />
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
