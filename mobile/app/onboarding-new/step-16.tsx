// S16: Daily Alignment, Named
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData } from '@/lib/onboardingNewStore';

function BreathingSun() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 2250, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ width: 84, height: 84 }, style]}>
      <Svg width={84} height={84}>
        <Defs>
          <RadialGradient id="sun16" cx="32%" cy="28%" r="75%">
            <Stop offset="0%" stopColor="#FBF3E0" />
            <Stop offset="58%" stopColor="#E8A33D" />
            <Stop offset="100%" stopColor="#8C5A1B" />
          </RadialGradient>
        </Defs>
        <Circle cx={42} cy={42} r={40} fill="url(#sun16)" />
      </Svg>
    </Animated.View>
  );
}

export default function OnboardingNewS16() {
  const name = getOnboardingNewData().name || 'friend';

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-17');
  }

  return (
    <OnboardingNewScreen glow="center" glowIntensity={0.3}>
      <View className="flex-1 items-center justify-center gap-8 px-9">
        <Animated.View entering={FadeIn.duration(600)}>
          <BreathingSun />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="max-w-[300px] items-center gap-3.5">
          <ScreenLabel>Daily alignment</ScreenLabel>
          <Text className="text-center font-serif-medium text-[36px] leading-[43px] text-obn-text">
            One card, every morning.
          </Text>
          <Text className="text-center font-manrope text-[14px] leading-[22px] text-obn-muted">
            Daily Alignment is the ritual itself — a grounded reading and one verse, timed to your window. Not a feed. One card.
          </Text>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(400).duration(500)} className="font-serif-regular-italic text-[18px] text-obn-gold">
          Yours for today is already written, {name}.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="See today →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
