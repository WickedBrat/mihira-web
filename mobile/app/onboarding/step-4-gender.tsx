// Screen 4b: Gender for Daily Imagery
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const GENDER_OPTIONS = [
  {
    label: 'Woman',
    value: 'female',
    body: 'Mihira will keep your daily guidance feeling personal.',
  },
  {
    label: 'Man',
    value: 'male',
    body: 'Mihira will keep your daily guidance feeling personal.',
  },
  {
    label: 'Prefer not to say',
    value: 'prefer_not_to_say',
    body: 'Mihira will use its default daily guidance experience.',
  },
];

export default function Screen4Gender() {
  const stored = getOnboardingData();
  const [selected, setSelected] = useState(stored.gender || '');

  function proceed() {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ gender: selected });
    router.push('/onboarding/step-5-trust');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 items-center justify-center gap-8 px-8 pt-8">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            What’s your{'\n'}gender?
          </Text>
          <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
            This helps Mihira make your daily guidance feel more personal.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {GENDER_OPTIONS.map((option, index) => {
            const active = selected === option.value;
            return (
              <Animated.View
                key={option.value}
                entering={FadeInDown.delay(index * 90 + 180).duration(420)}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(option.value);
                  }}
                  className={`rounded-[18px] border p-4 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                  style={({ pressed }) => pressed && pressedButtonStyle}
                >
                  <View className="flex-row items-start gap-3">
                    <View className={`mt-0.5 h-7 w-7 items-center justify-center rounded-full ${
                      active ? 'bg-ob-saffron' : 'bg-ob-card-border'
                    }`}>
                      {active ? (
                        <Animated.Text entering={ZoomIn.duration(180)} className="text-xs text-white">
                          ✦
                        </Animated.Text>
                      ) : null}
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className={`font-body-medium text-[16px] leading-6 ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                        {option.label}
                      </Text>
                      <Text className="font-body text-[13px] leading-5 text-ob-muted">
                        {option.body}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(620).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          disabled={!selected}
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            !selected ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
