// Screen 1: The Initial Spark
import React, { useEffect } from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
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
import { onboardingButtonShadow, pressedLogoButtonStyle } from '@/features/onboarding/onboardingStyles';

export default function Screen1() {
  const breathe = useSharedValue(1);
  const glow    = useSharedValue(0.6);

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

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      {/* Ambient star field */}
      <View pointerEvents="none" className="absolute inset-0">
        {STARS.map((s, i) => (
          <View
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-ob-gold"
            style={{ top: s.y, left: s.x, opacity: s.o }}
          />
        ))}
      </View>

      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Animated.View style={logoStyle}>
          <Text className="mb-[-8px] text-center text-[52px] text-ob-gold">☽</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(900)}>
          <Text className="text-center font-headline text-[48px] tracking-[-2px] text-ob-gold">
            Aksha
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(900).duration(800)} className="mt-3 items-center gap-2.5">
          <Text className="text-center font-headline text-[22px] tracking-[-0.4px] text-ob-text">
            The universe is always moving.
          </Text>
          <Text className="text-center font-body text-base text-ob-muted">Find your rhythm within it.</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(2200).duration(800)} className="items-center gap-3.5 p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            analytics.onboardingStarted();
            router.push('/onboarding/step-2');
          }}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedLogoButtonStyle,
          ]}
        >
          <Text className="text-center font-label text-base tracking-[0.3px] text-white">
            Start My Alignment
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/(tabs)');
          }}
          className="px-2 py-2"
          style={({ pressed }) => pressed && pressedLogoButtonStyle}
        >
          <Text className="text-center font-body text-sm text-ob-muted">Skip for now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

// Fixed decorative stars
const STARS = [
  { x: '12%', y: '8%', o: 0.5 }, { x: '78%', y: '6%', o: 0.3 },
  { x: '91%', y: '18%', o: 0.4 }, { x: '5%', y: '35%', o: 0.25 },
  { x: '88%', y: '42%', o: 0.4 }, { x: '22%', y: '72%', o: 0.2 },
  { x: '67%', y: '78%', o: 0.35 }, { x: '44%', y: '15%', o: 0.3 },
  { x: '56%', y: '88%', o: 0.2 }, { x: '3%', y: '62%', o: 0.3 },
] as const;
