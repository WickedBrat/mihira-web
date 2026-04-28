// Screen 9: Daily Horoscope Suggestions — Homepage Feature Tease
import React from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

const FOCUS_AREAS = [
  {
    area: 'Focus',
    time: 'Morning',
    action: 'Do the one thing that needs your full mind.',
    suggestion: 'Start before messages and noise shape the day.',
    accentColor: OB.gold,
  },
  {
    area: 'Decisions',
    time: 'Midday',
    action: 'Handle the conversation you have been delaying.',
    suggestion: 'A steadier window for judgment and follow-through.',
    accentColor: OB.saffron,
  },
  {
    area: 'Rest',
    time: 'Evening',
    action: 'Close loops instead of opening new ones.',
    suggestion: 'Let the day settle before choosing what comes next.',
    accentColor: 'rgba(255,255,255,0.35)',
  },
];

export default function Screen9() {
  async function continueToNextStep() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/step-10');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 justify-center gap-6 px-8 pt-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-label text-xs uppercase tracking-[3px] text-ob-saffron">
            Based on your horoscope
          </Text>
          <Text className="text-center font-headline text-[34px] leading-10 tracking-[-0.8px] text-ob-text">
            Three places to put{'\n'}your energy today
          </Text>
          <Text className="text-center font-body text-sm leading-[22px] text-ob-muted">
            On the homepage, Mihira turns your chart and the day's transits into three practical suggestions you can actually use.
          </Text>
        </Animated.View>

        <View className="gap-3">
          {FOCUS_AREAS.map((item, index) => (
            <Animated.View
              key={item.area}
              entering={FadeInDown.delay(180 + index * 120).duration(420)}
              className="overflow-hidden rounded-[24px] border border-ob-card-border bg-ob-card"
            >
              <View className="flex-row items-stretch">
                <View className="w-1.5" style={{ backgroundColor: item.accentColor }} />
                <View className="flex-1 gap-3 p-4">
                  <View className="flex-row items-start justify-between gap-4">
                    <View className="gap-0.5">
                      <Text className="font-headline-extra text-[28px] leading-[32px] tracking-[-0.4px] text-ob-text">
                        {item.area}
                      </Text>
                      <Text className="font-body text-xs text-ob-muted">{item.time}</Text>
                    </View>
                    <View className="rounded-full border border-ob-gold-border bg-ob-gold-dim px-3 py-1">
                      <Text className="font-body-medium text-[10px] uppercase tracking-[1.4px] text-ob-gold">
                        Suggestion
                      </Text>
                    </View>
                  </View>

                  <View className="gap-1.5">
                    <Text className="font-headline text-[19px] leading-[24px] tracking-[-0.2px] text-ob-text">
                      {item.action}
                    </Text>
                    <Text className="font-body text-[13px] leading-[20px] text-ob-muted">
                      {item.suggestion}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(620).duration(420)}
          className="rounded-[20px] border border-ob-saffron-border bg-ob-saffron-dim p-4"
        >
          <Text className="text-center font-body text-[13px] leading-[21px] text-ob-text">
            Each card explains what to lean into, when to act, and why that area is being highlighted.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(500)} className="items-center gap-3.5 p-8 pb-11">
        <Pressable
          onPress={continueToNextStep}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">
            Continue →
          </Text>
        </Pressable>
        <Pressable onPress={continueToNextStep}>
          <Text className="text-center font-body text-sm text-ob-muted">Skip for now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
