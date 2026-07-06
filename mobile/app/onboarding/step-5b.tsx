// Screen 5b: This Is Ask Mihira
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default function Screen5b() {
  const stored = getOnboardingData();
  const question = stored.firstQuestion.trim();

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/step-6');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <View className="flex-1 items-center justify-center gap-8 px-8">
        {question ? (
          <Animated.View
            entering={FadeIn.delay(120).duration(500)}
            className="w-full max-w-[360px] gap-3 rounded-[20px] border border-ob-card-border bg-ob-card p-5"
          >
            <Text
              numberOfLines={2}
              className="max-w-[88%] self-end rounded-[16px] rounded-br border border-ob-saffron-border bg-ob-saffron-dim px-3.5 py-2.5 font-body text-[12px] leading-[18px] text-ob-text"
            >
              {truncate(question, 90)}
            </Text>
            <View className="gap-2">
              <Text className="font-label text-[9px] uppercase tracking-[2px] text-ob-gold">
                What I'm hearing · Scriptural anchor · For today
              </Text>
              <View className="h-[6px] w-[92%] rounded-full bg-white/10" />
              <View className="h-[6px] w-[78%] rounded-full bg-white/10" />
              <View className="h-[6px] w-[58%] rounded-full bg-white/[0.07]" />
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} className="max-w-[320px] items-center gap-3">
          <Text className="font-label text-[11px] uppercase tracking-[2.5px] text-ob-gold">
            A home for this
          </Text>
          <Text className="text-center font-headline text-[32px] leading-[38px] text-ob-text">
            This is called <Text className="text-ob-gold">Ask Mihira</Text>.
          </Text>
          <Text className="text-center font-body text-[14px] leading-[21px] text-ob-muted">
            It's where you just were. Any question, answered from scripture — waiting in the Guidance tab whenever you need it.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={proceed}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
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
