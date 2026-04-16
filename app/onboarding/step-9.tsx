// Screen 9: The First Alignment — Feature Tease + Notifications
import React, { useEffect } from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Canvas, Circle, Path, Skia,
} from '@shopify/react-native-skia';
import Animated, {
  FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useWindowDimensions } from 'react-native';
import { OB } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import {
  absoluteFillStyle,
  dialGlowShadow,
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

export default function Screen9() {
  const { width } = useWindowDimensions();
  const cx = (width - 64) / 2;
  const R  = cx - 16;

  const glowPulse = useSharedValue(0.6);
  useEffect(() => {
    glowPulse.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowPulse.value }));

  // Build 12 hour segments on the dial
  const SEGMENTS = 12;
  const segAngle = (2 * Math.PI) / SEGMENTS;
  const ABHIJIT_IDX = 5; // ~noon segment

  async function requestNotifications() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // expo-notifications not installed; just proceed
    router.push('/onboarding/step-10');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <View className="flex-1 items-center justify-center gap-6 px-8 pt-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[34px] leading-10 tracking-[-0.8px] text-ob-text">
            Your Daily{'\n'}Alignment Dial
          </Text>
          <Text className="text-center font-body text-sm leading-[22px] text-ob-muted">
            Time is not a clock — it's a cycle. Every day, we find your{' '}
            <Text className="font-label text-ob-gold">48-minute Abhijit Muhurat</Text>
            {' '}— your window of peak grace.
          </Text>
        </Animated.View>

        {/* Dial Preview */}
        <View className="items-center justify-center">
          <Animated.View
            className="absolute h-[180px] w-[180px] rounded-full bg-[rgba(217,160,111,0.1)]"
            style={[dialGlowShadow, glowStyle]}
            pointerEvents="none"
          />

          <Canvas style={{ width: width - 64, height: width - 64 }}>
            {/* Background ring */}
            <Circle
              cx={cx} cy={cx} r={R}
              style="stroke" strokeWidth={1}
              color="rgba(255,255,255,0.06)"
            />

            {/* Segment arcs */}
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              const startAngle = i * segAngle - Math.PI / 2;
              const endAngle   = startAngle + segAngle - 0.04;
              const isAbhijit  = i === ABHIJIT_IDX;

              const path = Skia.Path.Make();
              path.addArc(
                { x: cx - R + 12, y: cx - R + 12, width: (R - 12) * 2, height: (R - 12) * 2 },
                (startAngle * 180) / Math.PI,
                ((segAngle - 0.04) * 180) / Math.PI
              );

              return (
                <Path
                  key={i}
                  path={path}
                  style="stroke"
                  strokeWidth={isAbhijit ? 14 : 8}
                  strokeCap="round"
                  color={
                    isAbhijit
                      ? OB.gold
                      : i % 3 === 0
                        ? 'rgba(224,122,95,0.45)'
                        : 'rgba(255,255,255,0.08)'
                  }
                />
              );
            })}

            {/* Center label */}
            <Circle cx={cx} cy={cx} r={R * 0.45} color="rgba(217,160,111,0.07)" />
            <Circle cx={cx} cy={cx} r={R * 0.45} style="stroke" strokeWidth={0.8} color="rgba(217,160,111,0.2)" />
          </Canvas>

          {/* Center text overlay */}
          <View className="items-center justify-center" style={absoluteFillStyle}>
            <Text className="mb-1 text-[30px] text-ob-gold">☽</Text>
            <Text className="font-headline text-sm text-ob-text">Abhijit</Text>
            <Text className="font-body text-[11px] text-ob-muted">48 min window</Text>
          </View>
        </View>

        <View className="items-center gap-2.5">
          <View className="flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full bg-ob-gold" />
            <Text className="font-body text-xs text-ob-muted">Abhijit Muhurat — peak grace</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full bg-ob-saffron opacity-[0.55]" />
            <Text className="font-body text-xs text-ob-muted">Auspicious windows</Text>
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(500)} className="items-center gap-3.5 p-8 pb-11">
        <Pressable
          onPress={requestNotifications}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">
            Allow Daily Reminders →
          </Text>
        </Pressable>
        <Pressable onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/onboarding/step-10');
        }}>
          <Text className="text-center font-body text-sm text-ob-muted">Skip for now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
