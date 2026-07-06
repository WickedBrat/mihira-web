// S15: Social Proof
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';

const TESTIMONIALS = [
  { quote: "It's the first app that quotes the source before it advises me.", author: 'Priya · London' },
  { quote: 'The timing windows finally gave my mornings a shape.', author: 'Arnav · Austin' },
  { quote: "Feels like my grandmother's counsel, minus the guilt.", author: 'Meera · Toronto' },
];

export default function OnboardingNewS15() {
  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-16');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-7 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <ScreenLabel>In good company</ScreenLabel>
          <Text className="font-serif-medium text-[62px] leading-[64px] text-obn-text">1,842</Text>
          <Text className="max-w-[280px] text-center font-manrope text-[15px] leading-[22px] text-obn-muted">
            people who share your nakshatra are keeping a rhythm this month.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] justify-center gap-3.5">
          {TESTIMONIALS.map((t, i) => (
            <Animated.View key={t.author} entering={FadeInDown.delay(i * 100 + 200).duration(400)} className="gap-2 rounded-[20px] border border-obn-gold-border-soft bg-obn-card px-[22px] py-[18px]">
              <Text className="font-serif-regular-italic text-[18px] leading-[26px] text-obn-text-soft">"{t.quote}"</Text>
              <Text className="font-manrope-bold text-[12px] uppercase tracking-[1.5px] text-obn-muted-dim">{t.author}</Text>
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
