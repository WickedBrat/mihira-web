// Screen 12: The Threshold — Long Press Initiation
import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import { useAuth } from '@clerk/clerk-expo';
import { scaleFont } from '@/lib/typography';
import { OB } from '@/lib/onboardingStore';

const HOLD_DURATION = 2000; // ms to hold for full trigger

export default function Screen12() {
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Seeker';
  const { saveField } = useProfile();
  const { isSignedIn } = useAuth();

  const progress = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef  = useRef(false);
  // Track milestones so haptics only fire once per threshold
  const hapticFiredRef = useRef({ q1: false, q2: false, q3: false });

  const navigate = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isSignedIn) {
      const d = getOnboardingData();
      if (d.userName)       saveField('name', d.userName).catch(() => {});
      if (d.birthPlace)     saveField('birth_place', d.birthPlace).catch(() => {});
      if (d.commitmentTier) saveField('focus_area', d.commitmentTier).catch(() => {});
    }
    router.replace('/(tabs)');
  }, [isSignedIn, saveField]);

  function startHold() {
    if (startedRef.current) return;
    startedRef.current = true;
    hapticFiredRef.current = { q1: false, q2: false, q3: false };
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const p = Math.min((Date.now() - startTime) / HOLD_DURATION, 1);
      progress.value = p;

      if (p >= 0.25 && !hapticFiredRef.current.q1) {
        hapticFiredRef.current.q1 = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (p >= 0.55 && !hapticFiredRef.current.q2) {
        hapticFiredRef.current.q2 = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      if (p >= 0.80 && !hapticFiredRef.current.q3) {
        hapticFiredRef.current.q3 = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
    };
  }, []);

  const name0 = data.userName || 'Seeker';

  return (
    <View style={styles.safe}>
      {/* Full-screen gradient backdrop */}
      <LinearGradient
        colors={['#0D0500', '#14080C', '#07090C']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient saffron haze */}
      <Animated.View
        style={[styles.hazeTop]}
        pointerEvents="none"
      />

      {/* Stars */}
      {STARS.map((s, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[styles.star, { top: s.y, left: s.x, opacity: s.o, width: s.sz, height: s.sz, borderRadius: s.sz / 2 }]}
        />
      ))}

      <SafeAreaView style={styles.inner}>
        <View style={styles.top}>
          <Animated.Text entering={FadeIn.delay(500).duration(700)} style={styles.headline}>
            Your axis is aligned,{'\n'}
            <Text style={styles.headlineName}>{name0}.</Text>
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(900).duration(700)} style={styles.sub}>
            Enter the current.
          </Animated.Text>
        </View>

        {/* Long-press button zone */}
        <View style={styles.btnZone}>
          {/* Ripple rings */}
          <Animated.View style={[styles.ring, styles.ringOuter, outerRingStyle]} />
          <Animated.View style={[styles.ring, styles.ringMid, midRingStyle]} />

          {/* SVG-free arc: two filled rings that reveal progress via clip */}
          <Animated.View style={[styles.arcWrap, arcStyle]}>
            {/* We use a rotating gradient conic effect approximation */}
            <Animated.View style={[styles.progressArc, btnFillStyle]} />
          </Animated.View>

          <Pressable
            onPressIn={startHold}
            onPressOut={cancelHold}
          >
            <Animated.View style={styles.btnOuter}>
              {/* Fill overlay */}
              <Animated.View style={[StyleSheet.absoluteFill, styles.btnFill, btnFillStyle]} />

              <Animated.Text style={[styles.btnLabel, labelStyle]}>Hold to Enter</Animated.Text>
              <Animated.Text style={[styles.btnProgressText, progressTextStyle]}>
                ☽
              </Animated.Text>
            </Animated.View>
          </Pressable>
        </View>

        <Animated.View entering={FadeIn.delay(1200).duration(700)} style={styles.bottom}>
          <Text style={styles.bottomQuote}>
            "The chariot is ready. The reins are in your hands."
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

const BTN_SIZE = 160;
const RING_BASE = BTN_SIZE + 32;

const styles = StyleSheet.create({
  safe:  { flex: 1 },
  inner: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 32, paddingBottom: 52 },
  hazeTop: {
    position: 'absolute',
    top: -80, left: -60, right: -60,
    height: 300,
    backgroundColor: 'rgba(224,122,95,0.06)',
    borderRadius: 200,
    transform: [{ scaleX: 1.5 }],
  },
  star: { position: 'absolute', backgroundColor: OB.gold },
  top:  { paddingTop: 60, gap: 16 },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(40),
    color: OB.text, letterSpacing: -1.2, lineHeight: scaleFont(46),
  },
  headlineName: { color: OB.gold },
  sub: {
    fontFamily: 'Lexend_300Light', fontSize: scaleFont(20),
    color: 'rgba(240,237,232,0.6)', letterSpacing: 1,
  },
  btnZone: {
    alignItems: 'center',
    justifyContent: 'center',
    height: BTN_SIZE + 120,
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  ringOuter: {
    width: RING_BASE + 60, height: RING_BASE + 60,
    borderColor: OB.saffron,
  },
  ringMid: {
    width: RING_BASE + 20, height: RING_BASE + 20,
    borderColor: OB.gold,
  },
  arcWrap: {
    position: 'absolute',
    width: BTN_SIZE + 20, height: BTN_SIZE + 20,
    borderRadius: (BTN_SIZE + 20) / 2,
    borderWidth: 3,
    borderColor: 'rgba(224,122,95,0.25)',
    overflow: 'hidden',
  },
  progressArc: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OB.saffron,
  },
  btnOuter: {
    width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2,
    backgroundColor: 'rgba(224,122,95,0.08)',
    borderWidth: 1.5, borderColor: OB.saffronBorder,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    gap: 4,
  },
  btnFill: {
    backgroundColor: OB.saffron,
    borderRadius: BTN_SIZE / 2,
  },
  btnLabel: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(14),
    color: OB.text, letterSpacing: 0.3, textAlign: 'center',
  },
  btnProgressText: {
    fontFamily: 'Lexend_300Light', fontSize: scaleFont(28), color: OB.gold,
  },
  bottom: { alignItems: 'center' },
  bottomQuote: {
    fontFamily: 'Lexend_300Light', fontSize: scaleFont(14),
    color: 'rgba(240,237,232,0.4)', textAlign: 'center',
    letterSpacing: 0.3, lineHeight: scaleFont(22), fontStyle: 'italic',
  },
});
