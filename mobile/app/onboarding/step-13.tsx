// Screen 13: Social Proof — You're Not Alone
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const TESTIMONIALS = [
  {
    quote: 'I started using Mihira during one of the hardest months of my career. The daily alignment became the first thing I looked at every morning.',
    name: 'Priya S.',
    context: 'Mumbai → London',
  },
  {
    quote: 'I had drifted from anything spiritual for years. Mihira made it feel accessible again — not superstitious, just grounded.',
    name: 'Arjun M.',
    context: 'Bangalore',
  },
  {
    quote: 'The Saarthi guidance is unlike anything I have used. It actually listens and responds to where I am, not just my birth chart.',
    name: 'Ananya R.',
    context: 'New York',
  },
];

export default function Screen13() {
  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="plan" />
      </View>

      <View className="flex-1 justify-center gap-7 px-8 pt-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-label text-xs uppercase tracking-[3px] text-ob-saffron">
            You're in good company
          </Text>
          <Text className="text-center font-headline text-[34px] leading-[40px] tracking-[-0.8px] text-ob-text">
            50,000+ seekers{'\n'}have found their rhythm.
          </Text>
          <Text className="text-center font-body text-sm leading-[22px] text-ob-muted">
            People who were carrying exactly what you're carrying.
          </Text>
        </Animated.View>

        <View className="gap-3">
          {TESTIMONIALS.map((item, index) => (
            <Animated.View
              key={item.name}
              entering={FadeInDown.delay(180 + index * 120).duration(420)}
              className="rounded-[22px] border border-ob-card-border bg-ob-card p-5 gap-3"
            >
              <Text className="font-body text-[14px] leading-[23px] text-ob-text">
                "{item.quote}"
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="h-[5px] w-[5px] rounded-full bg-ob-saffron" />
                <Text className="font-body-medium text-[13px] text-ob-muted">
                  {item.name}
                </Text>
                <Text className="font-body text-[12px] text-ob-muted opacity-60">
                  · {item.context}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(700).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-14');
          }}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">
            See your plan →
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
