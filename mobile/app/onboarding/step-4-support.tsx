// Screen 4a: Support Type
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const SUPPORT_TYPES = [
  {
    title: 'A calmer morning',
    subtitle: 'Start the day with direction before the noise begins.',
  },
  {
    title: 'Better timing',
    subtitle: 'Find steadier windows for decisions and important actions.',
  },
  {
    title: 'Scripture I can apply',
    subtitle: 'Get wisdom translated into practical next steps.',
  },
  {
    title: 'A private practice',
    subtitle: 'Build a ritual that fits modern life without feeling heavy.',
  },
  {
    title: 'Help with uncertainty',
    subtitle: 'Think through stress, duty, ambition, and relationships.',
  },
];

export default function Screen4Support() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ supportTypes: selected });
    router.push('/onboarding/step-4-synthesis');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-7 px-8 py-8"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            What kind of support{'\n'}would feel useful?
          </Text>
          <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
            Choose more than one. Most people come with more than one thread.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {SUPPORT_TYPES.map((item, index) => {
            const active = selected.includes(item.title);
            return (
              <Animated.View key={item.title} entering={FadeInDown.delay(index * 80 + 180).duration(420)}>
                <Pressable
                  onPress={() => toggle(item.title)}
                  className={`rounded-[18px] border p-4 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
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
                    <View className="flex-1 gap-1.5">
                      <Text className={`font-headline text-[20px] leading-6 ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                        {item.title}
                      </Text>
                      <Text className="font-body text-[13px] leading-5 text-ob-muted">
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <View className="h-[120px]" />
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(680).duration(500)}
        className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11"
      >
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            selected.length === 0 ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Shape my guidance →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
