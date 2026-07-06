// S1: Arrival
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { analytics } from '@/lib/analytics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton } from '@/features/onboarding-new/PrimaryButton';

export default function OnboardingNewS1() {
  const glow = useSharedValue(0.18);

  useEffect(() => {
    glow.value = withRepeat(withTiming(0.5, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value,
  }));

  const proceed = useCallback(async () => {
    analytics.onboardingStarted();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/onboarding-new/step-2');
  }, []);

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center justify-center gap-7 px-9">
        <View className="h-[88px] w-[88px] items-center justify-center rounded-full border-[1.5px] border-obn-gold">
          <Animated.View
            pointerEvents="none"
            style={[
              glowStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 44,
                shadowColor: '#E8A33D',
                shadowRadius: 60,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
          <Text className="font-serif-semibold text-[44px] text-obn-gold">म</Text>
        </View>

        <Animated.Text
          entering={FadeIn.delay(300).duration(700)}
          className="font-manrope-bold text-[12px] uppercase tracking-[6px] text-obn-gold"
        >
          Mihira
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(600).duration(800)}>
          <Text className="text-center font-serif-medium text-[34px] leading-[42px] text-obn-text">
            You already know something is out of rhythm.{' '}
            <Text className="font-serif-medium-italic text-obn-gold">You wouldn't be here otherwise.</Text>
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(1400).duration(700)} className="items-center gap-3.5 p-8 pb-11">
        <View className="w-full max-w-[360px] gap-3.5">
          <PrimaryButton
            label="Show me →"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void proceed();
            }}
          />
          <Text className="px-4 text-center font-manrope text-xs leading-[18px] text-obn-muted-dim">
            You can save your account after Mihira shows your first guidance.
          </Text>
        </View>
      </Animated.View>
    </OnboardingNewScreen>
  );
}
