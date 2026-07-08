// S12: Mapping Ritual
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { MAPPING_CRUMBS, buildChartResult, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';

const MIN_RITUAL_MS = MAPPING_CRUMBS.length * 2800 + 400;

async function computeRealChart(): Promise<void> {
  const stored = getOnboardingNewData();
  if (!stored.birthPlace.trim()) return;

  try {
    const { lat, lng } = await geocode(stored.birthPlace);
    const birthDt = formatBirthDateTime(mergeDateAndTime(stored.birthDate, stored.birthTime));
    const chart = await buildBirthChart(birthDt, lat, lng);
    const moon = chart.planets.find((p) => p.name === 'Moon');
    setOnboardingNewData({
      chart: buildChartResult(chart.nakshatra, moon?.sign ?? chart.lagna, moon?.house ?? null),
    });
  } catch (err) {
    console.error('[onboarding-new] chart computation failed, using representative chart', err);
  }
}

const DIAL_SIZE = 260;

function RotatingRing({ size, duration, reverse = false, opacity = 0.4, dash }: { size: number; duration: number; reverse?: boolean; opacity?: number; dash?: string }) {
  const rotate = useSharedValue(0);
  useEffect(() => {
    rotate.value = withRepeat(withTiming(reverse ? -360 : 360, { duration, easing: Easing.linear }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));
  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke="#E8A33D"
          strokeOpacity={opacity}
          strokeWidth={2}
          fill="none"
          strokeDasharray={dash}
        />
      </Svg>
    </Animated.View>
  );
}

function PulsingCore() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.08, { duration: 2250, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ width: 64, height: 64 }, style]}>
      <Svg width={64} height={64}>
        <Defs>
          <RadialGradient id="core" cx="32%" cy="28%" r="75%">
            <Stop offset="0%" stopColor="#FBF3E0" />
            <Stop offset="58%" stopColor="#E8A33D" />
            <Stop offset="100%" stopColor="#8C5A1B" />
          </RadialGradient>
        </Defs>
        <Circle cx={32} cy={32} r={30} fill="url(#core)" />
      </Svg>
    </Animated.View>
  );
}

export default function OnboardingNewS12() {
  const [crumbIndex, setCrumbIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCrumbIndex((i) => (i + 1) % MAPPING_CRUMBS.length), 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_RITUAL_MS));

    Promise.all([computeRealChart(), minDelay]).then(() => {
      if (!cancelled) router.replace('/onboarding-new/step-13');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <OnboardingNewScreen glow="center" glowIntensity={0.3}>
      <View className="flex-1 items-center justify-center gap-12 px-9">
        <View style={{ width: DIAL_SIZE, height: DIAL_SIZE }} className="items-center justify-center">
          <RotatingRing size={DIAL_SIZE} duration={22000} opacity={0.22} dash="1,12" />
          <RotatingRing size={DIAL_SIZE - 60} duration={11000} reverse opacity={0.3} />
          <RotatingRing size={DIAL_SIZE - 110} duration={7000} opacity={0.55} dash="6,10" />
          <PulsingCore />
        </View>

        <View className="min-h-[90px] max-w-[300px] items-center gap-3">
          <ScreenLabel>Mapping your rhythm</ScreenLabel>
          <Animated.View key={crumbIndex} entering={FadeIn.duration(500)}>
            <Text className="text-center font-serif-medium-italic text-[21px] leading-[30px] text-obn-text-soft">
              {MAPPING_CRUMBS[crumbIndex]}
            </Text>
          </Animated.View>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-2 pb-14">
        {MAPPING_CRUMBS.map((_, i) => (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: i === crumbIndex ? 24 : 6,
              height: 6,
              backgroundColor: i === crumbIndex ? '#E8A33D' : 'rgba(242,234,217,0.18)',
            }}
          />
        ))}
      </View>
    </OnboardingNewScreen>
  );
}
