// Screen 1: The Initial Spark
import React, { useCallback, useEffect } from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import MihiraLogo from '@/assets/logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { analytics } from '@/lib/analytics';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

export default function Screen1() {
  const breathe = useSharedValue(1);
  const glow = useSharedValue(0.6);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1.10, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    glow.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
    opacity: glow.value,
  }));

  const continueOnboarding = useCallback(async () => {
    analytics.onboardingStarted();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/onboarding/step-2');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Animated.View style={logoStyle}>
          <MihiraLogo width={205} height={205} accessibilityLabel="Mihira logo" />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(900)}>
          <Text className="text-center font-headline text-[48px] tracking-[-2px] text-ob-gold">
            Mihira
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(900).duration(800)} className="mt-3 items-center gap-2.5">
          <Text className="text-center font-headline text-[22px] tracking-[-0.4px] text-ob-text">
            The universe is always moving.
          </Text>
          <Text className="text-center font-body text-base text-ob-muted">Find your rhythm within it.</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(1800).duration(800)} className="w-full items-center gap-3.5 p-8 pb-11">
        <View className="w-full max-w-[360px] gap-3.5">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void continueOnboarding();
            }}
            className="items-center rounded-full bg-ob-saffron px-8 py-4"
            style={({ pressed }) => [
              onboardingButtonShadow,
              pressed && pressedButtonStyle,
            ]}
          >
            <Text className="text-center font-label text-base tracking-[0.3px] text-white">
              Begin my alignment →
            </Text>
          </Pressable>
          <Text className="px-4 text-center font-body text-xs leading-[18px] text-ob-muted">
            You can save your account after Mihira shows your first guidance.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
