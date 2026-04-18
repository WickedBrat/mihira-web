// Screen 6: Telemetric Sync — The "Wait" Ritual
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Canvas,
  Circle,
  Group,
  Paint,
  Path,
  Skia,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { OB, getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { absoluteFillStyle } from '@/features/onboarding/onboardingStyles';

const STEPS = [
  'Gathering your birth details…',
  'Mapping your planetary placements…',
  'Calculating your rising sign…',
  'Tracing your lunar pattern…',
  'Preparing your daily alignment…',
];

export default function Screen6() {
  const { width } = useWindowDimensions();
  const [stepIndex, setStepIndex] = useState(0);
  const rotation = useSharedValue(0);
  const innerRot = useSharedValue(0);
  const pulse    = useSharedValue(1);

  const cx = width / 2;
  const R  = cx - 48;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1
    );
    innerRot.value = withRepeat(
      withTiming(-360, { duration: 5000, easing: Easing.linear }),
      -1
    );
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    // Advance status text every 1.5s, navigate after all steps + 1s delay
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(() => router.replace('/onboarding/step-7'), 1000);
        return prev;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const dialStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${innerRot.value}deg` }] }));
  const dotStyle   = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  // Build 24 tick marks on the outer ring
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 6 === 0;
    const r1 = R - (isMajor ? 18 : 10);
    const r2 = R + 2;
    ticks.push({
      x1: cx + Math.cos(angle) * r1,
      y1: cx + Math.sin(angle) * r1,
      x2: cx + Math.cos(angle) * r2,
      y2: cx + Math.sin(angle) * r2,
    });
  }

  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || '';

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <View className="flex-1 items-center justify-center gap-4 px-8 pt-7">
        <Animated.View entering={FadeInDown.duration(500)} className="self-stretch items-center gap-2">
          <Text className="text-center font-headline text-[28px] tracking-[-0.6px] text-ob-text">
            {name ? `Mapping ${name}'s chart` : 'Mapping your chart'}
          </Text>
        </Animated.View>

        {/* Skia Celestial Dial */}
        <View style={{ width: width, height: width, alignSelf: 'center' }}>
          <Canvas style={{ width, height: width }}>
            {/* Outer ring */}
            <Circle
              cx={cx} cy={cx} r={R}
              style="stroke" strokeWidth={1}
              color="rgba(217,160,111,0.25)"
            />
            {/* Ticks */}
            {ticks.map((t, i) => {
              const path = Skia.Path.Make();
              path.moveTo(t.x1, t.y1);
              path.lineTo(t.x2, t.y2);
              return (
                <Path
                  key={i}
                  path={path}
                  color={i % 6 === 0
                    ? 'rgba(217,160,111,0.7)'
                    : 'rgba(217,160,111,0.25)'}
                  strokeWidth={i % 6 === 0 ? 1.5 : 0.8}
                  style="stroke"
                />
              );
            })}
            {/* Inner ring */}
            <Circle
              cx={cx} cy={cx} r={R * 0.72}
              style="stroke" strokeWidth={0.7}
              color="rgba(224,122,95,0.18)"
            />
            {/* Center glow */}
            <Circle
              cx={cx} cy={cx} r={28}
              color="rgba(224,122,95,0.12)"
            />
            <Circle
              cx={cx} cy={cx} r={12}
              color="rgba(224,122,95,0.35)"
            />
          </Canvas>

          {/* Rotating outer marks */}
          <Animated.View style={[absoluteFillStyle, dialStyle]}>
            <Canvas style={{ width, height: width }}>
              <Circle
                cx={cx} cy={cx + R - 6} r={5}
                color={OB.saffron}
                strokeWidth={4}
              />
              <Circle
                cx={cx} cy={cx - R + 6} r={3}
                color={OB.gold}
                strokeWidth={4}
              />
            </Canvas>
          </Animated.View>

          {/* Rotating inner marks */}
          <Animated.View style={[absoluteFillStyle, innerStyle]}>
            <Canvas style={{ width, height: width }}>
              <Circle
                cx={cx + R * 0.72 - 5} cy={cx} r={4}
                color="rgba(224,122,95,0.7)"
              />
            </Canvas>
          </Animated.View>

          {/* Center moon */}
          <View className="absolute inset-0 items-center justify-center">
            <Animated.Text className="text-[36px] text-ob-gold" style={dotStyle}>
              ☽
            </Animated.Text>
          </View>
        </View>

        {/* Status text */}
        <View className="items-center gap-4 pt-2">
          <Animated.View
            key={stepIndex}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
          >
            <Text className="text-center font-body text-sm tracking-[0.2px] text-ob-muted">
              {STEPS[stepIndex]}
            </Text>
          </Animated.View>

          <View className="flex-row gap-1.5">
            {STEPS.map((_, i) => (
              <View
                key={i}
                className={`h-[5px] rounded-full ${
                  i === stepIndex
                    ? 'w-3.5 bg-ob-saffron'
                    : i < stepIndex
                      ? 'w-[5px] bg-ob-gold'
                      : 'w-[5px] bg-ob-card-border'
                }`}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
