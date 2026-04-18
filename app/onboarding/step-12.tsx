// Screen 12: The Threshold — Long Press Initiation
import React, { useEffect, useRef, useCallback } from 'react';
import {
  Platform,
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getOnboardingData } from '@/lib/onboardingStore';
import { useProfile } from '@/features/profile/useProfile';
import { useAuth } from '@clerk/expo';
import { analytics } from '@/lib/analytics';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { absoluteFillStyle, hazeScaleStyle } from '@/features/onboarding/onboardingStyles';

const HOLD_DURATION = 8000; // ms to hold for full trigger

export default function Screen12() {
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Seeker';
  const { saveField } = useProfile();
  const { isSignedIn } = useAuth();

  const progress = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hapticTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startedRef  = useRef(false);
  // Track milestones so haptics only fire once per threshold
  const hapticFiredRef = useRef({ q1: false, q2: false, q3: false });

  const clearHapticTimeouts = useCallback(() => {
    hapticTimeoutsRef.current.forEach(clearTimeout);
    hapticTimeoutsRef.current = [];
  }, []);

  const fireHardImpact = useCallback(() => {
    clearHapticTimeouts();

    if (Platform.OS === 'android') {
      void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
      hapticTimeoutsRef.current.push(
        setTimeout(() => {
          void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
        }, 90),
      );
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    hapticTimeoutsRef.current.push(
      setTimeout(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      }, 90),
    );
  }, [clearHapticTimeouts]);

  const navigate = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const d = getOnboardingData();
    analytics.onboardingCompleted({
      has_birth_place: Boolean(d.birthPlace),
      commitment_tier: d.commitmentTier ?? null,
      is_signed_in: Boolean(isSignedIn),
    });
    if (isSignedIn) {
      const birthDateTime = !d.unknownBirthTime
        ? formatBirthDateTime(mergeDateAndTime(d.birthDate, d.birthTime))
        : '';

      if (d.userName)       saveField('name', d.userName).catch(() => {});
      if (birthDateTime)    saveField('birth_dt', birthDateTime).catch(() => {});
      if (d.birthPlace)     saveField('birth_place', d.birthPlace).catch(() => {});
      if (d.commitmentTier) saveField('focus_area', d.commitmentTier).catch(() => {});
    }
    router.replace('/(tabs)');
  }, [isSignedIn, saveField]);

  function startHold() {
    if (startedRef.current) return;
    startedRef.current = true;
    hapticFiredRef.current = { q1: false, q2: false, q3: false };
    fireHardImpact();

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const p = Math.min((Date.now() - startTime) / HOLD_DURATION, 1);
      progress.value = p;

      if (p >= 0.05 && !hapticFiredRef.current.q1) {
        hapticFiredRef.current.q1 = true;
        fireHardImpact();
      }
      if (p >= 0.55 && !hapticFiredRef.current.q2) {
        hapticFiredRef.current.q2 = true;
        fireHardImpact();
      }
      if (p >= 0.80 && !hapticFiredRef.current.q3) {
        hapticFiredRef.current.q3 = true;
        fireHardImpact();
      }
      if (p >= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        navigate();
      }
    }, 16);
  }

  function cancelHold() {
    if (!startedRef.current) return;
    startedRef.current = false;
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    clearHapticTimeouts();
    progress.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
  }

  // Outer ring animated style
  const outerRingStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 2.4]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 0.4, 0]);
    return { transform: [{ scale }], opacity };
  });

  // Middle ring
  const midRingStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.6]);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 0.55, 0.2]);
    return { transform: [{ scale }], opacity };
  });

  // Arc progress
  const arcStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.05], [0, 1]),
  }));

  // Button fill
  const btnFillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.3, 0.9]),
  }));

  // Label morph
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1, 0.9, 1], [1, 0.7, 0.4, 0]),
  }));

  // Progress text
  const progressTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1], [0, 1]),
  }));

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearHapticTimeouts();
    };
  }, [clearHapticTimeouts]);

  const name0 = data.userName || 'Seeker';

  return (
    <View className="flex-1">
      <OnboardingDevBackButton />

      {/* Full-screen gradient backdrop */}
      <LinearGradient
        colors={['#0D0500', '#14080C', '#07090C']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={absoluteFillStyle}
      />

      {/* Ambient saffron haze */}
      <Animated.View
        className="absolute -left-[60px] -right-[60px] top-[-80px] h-[300px] rounded-[200px] bg-[rgba(224,122,95,0.06)]"
        style={hazeScaleStyle}
        pointerEvents="none"
      />

      {/* Stars */}
      {STARS.map((s, i) => (
        <View
          key={i}
          pointerEvents="none"
          className="absolute bg-ob-gold"
          style={{ top: s.y, left: s.x, opacity: s.o, width: s.sz, height: s.sz, borderRadius: s.sz / 2 }}
        />
      ))}

      <SafeAreaView className="flex-1 items-center justify-between px-8 pb-[52px]">
        <View className="items-center gap-4 pt-[60px]">
          <Animated.Text
            entering={FadeIn.delay(500).duration(700)}
            className="text-center font-headline text-[40px] leading-[46px] tracking-[-1.2px] text-ob-text"
          >
            You’re ready,{'\n'}
            <Text className="text-ob-gold">{name0}.</Text>
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(900).duration(700)}
            className="text-center font-body text-xl tracking-[1px] text-ob-text/60"
          >
            Step into your practice.
          </Animated.Text>
        </View>

        {/* Long-press button zone */}
        <View className="h-[280px] items-center justify-center">
          {/* Ripple rings */}
          <Animated.View
            className="absolute h-[252px] w-[252px] rounded-full border-[1.5px] border-ob-saffron"
            style={outerRingStyle}
          />
          <Animated.View
            className="absolute h-[212px] w-[212px] rounded-full border-[1.5px] border-ob-gold"
            style={midRingStyle}
          />

          {/* SVG-free arc: two filled rings that reveal progress via clip */}
          <Animated.View
            className="absolute h-[180px] w-[180px] overflow-hidden rounded-full border-[3px] border-[rgba(224,122,95,0.25)]"
            style={arcStyle}
          >
            {/* We use a rotating gradient conic effect approximation */}
            <Animated.View className="absolute inset-0 bg-ob-saffron" style={btnFillStyle} />
          </Animated.View>

          <Pressable
            onPressIn={startHold}
            onPressOut={cancelHold}
          >
            <Animated.View className="h-40 w-40 items-center justify-center gap-1 overflow-hidden rounded-full border-[1.5px] border-ob-saffron-border bg-[rgba(224,122,95,0.08)]">
              {/* Fill overlay */}
              <Animated.View className="absolute inset-0 rounded-full bg-ob-saffron" style={btnFillStyle} />

              <Animated.Text
                className="text-center font-label text-sm tracking-[0.3px] text-ob-text"
                style={labelStyle}
              >
                Press and hold to enter
              </Animated.Text>
              <Animated.Text
                className="font-body text-[28px] text-ob-gold"
                style={progressTextStyle}
              >
                ☽
              </Animated.Text>
            </Animated.View>
          </Pressable>
        </View>

        <Animated.View entering={FadeIn.delay(1200).duration(700)} className="items-center">
          <Text className="text-center font-body text-sm italic leading-[22px] tracking-[0.3px] text-ob-text/40">
            "A steady practice changes the way the path appears."
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

// Decorative stars
const STARS = [
  { x: '8%',  y: '5%',  o: 0.6, sz: 2 },
  { x: '72%', y: '3%',  o: 0.4, sz: 1.5 },
  { x: '88%', y: '12%', o: 0.5, sz: 2 },
  { x: '15%', y: '28%', o: 0.3, sz: 1.5 },
  { x: '92%', y: '35%', o: 0.45, sz: 2 },
  { x: '6%',  y: '55%', o: 0.35, sz: 1.5 },
  { x: '82%', y: '65%', o: 0.4, sz: 2 },
  { x: '38%', y: '9%',  o: 0.25, sz: 1.5 },
  { x: '55%', y: '85%', o: 0.3, sz: 2 },
  { x: '22%', y: '78%', o: 0.2, sz: 1.5 },
  { x: '48%', y: '18%', o: 0.4, sz: 1 },
  { x: '64%', y: '75%', o: 0.3, sz: 1 },
] as const;
