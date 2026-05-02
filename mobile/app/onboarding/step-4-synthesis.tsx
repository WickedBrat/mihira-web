// Screen 4b: Synthesis
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

export default function Screen4Synthesis() {
  const data = getOnboardingData();
  const focus = [...data.painPoints, ...data.guidanceContext, ...data.supportTypes].slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 items-center justify-center gap-8 px-8">
        <Animated.View entering={FadeInDown.duration(520)} className="max-w-[360px] items-center gap-3">
          <Text className="text-center font-label text-xs uppercase tracking-[3px] text-ob-saffron">
            We heard you
          </Text>
          <Text className="text-center font-headline text-[38px] leading-[44px] tracking-[-1px] text-ob-text">
            Mihira will shape{'\n'}around this.
          </Text>
          <Text className="text-center font-body text-[15px] leading-[24px] text-ob-muted">
            Your daily rhythm should feel specific to the season you are living through.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(220).duration(500)}
          className="w-full max-w-[360px] rounded-[26px] border border-ob-gold-border bg-ob-gold-dim p-5"
        >
          <View className="gap-3">
            {focus.map((item, index) => (
              <View key={`${item}-${index}`} className="flex-row items-center gap-3">
                <View className="h-2 w-2 rounded-full bg-ob-gold" />
                <Text className="flex-1 font-body-medium text-[15px] leading-6 text-ob-text">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(420).duration(500)}
          className="w-full max-w-[360px] rounded-[20px] border border-ob-card-border bg-ob-card p-4"
        >
          <Text className="text-center font-body text-[13px] leading-[21px] text-ob-muted">
            Next, Mihira needs your birth details to turn this intent into timing, alignment, and guidance.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(680).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-4');
          }}
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
