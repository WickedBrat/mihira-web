// Screen 9: The First Alignment — Feature Tease + Notifications
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import { scaleFont } from '@/lib/typography';

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        {Array.from({ length: 11 }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= 7 && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.label}>STEP 9 OF 12</Text>
          <Text style={styles.headline}>Your Daily{'\n'}Alignment Dial</Text>
          <Text style={styles.sub}>
            Time is not a clock — it's a cycle. Every day, we find your{' '}
            <Text style={styles.subAccent}>48-minute Abhijit Muhurat</Text>
            {' '}— your window of peak grace.
          </Text>
        </Animated.View>

        {/* Dial Preview */}
        <View style={styles.dialContainer}>
          <Animated.View style={[styles.dialGlow, glowStyle]} pointerEvents="none" />

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
          <View style={[StyleSheet.absoluteFill, styles.dialCenter]}>
            <Text style={styles.dialCenterIcon}>☽</Text>
            <Text style={styles.dialCenterLabel}>Abhijit</Text>
            <Text style={styles.dialCenterSub}>48 min window</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <View style={[styles.tagDot, { backgroundColor: OB.gold }]} />
            <Text style={styles.tagText}>Abhijit Muhurat — peak grace</Text>
          </View>
          <View style={styles.tag}>
            <View style={[styles.tagDot, { backgroundColor: OB.saffron, opacity: 0.55 }]} />
            <Text style={styles.tagText}>Auspicious windows</Text>
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.footer}>
        <Pressable
          onPress={requestNotifications}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Allow Daily Reminders →</Text>
        </Pressable>
        <Pressable onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/onboarding/step-10');
        }}>
          <Text style={styles.skip}>Skip for now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: OB.bg },
  progress:   { flexDirection: 'row', gap: 4, paddingHorizontal: 32, paddingTop: 16, paddingBottom: 4 },
  dot:        { flex: 1, height: 2, backgroundColor: OB.cardBorder, borderRadius: 1 },
  dotActive:  { backgroundColor: OB.saffron },
  body:       { flex: 1, paddingHorizontal: 32, paddingTop: 24, gap: 24 },
  header:     { gap: 10 },
  label: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(10),
    letterSpacing: 2.5, color: OB.saffron, textTransform: 'uppercase',
  },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(34),
    color: OB.text, letterSpacing: -0.8, lineHeight: scaleFont(40),
  },
  sub: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(14),
    color: OB.muted, lineHeight: scaleFont(22),
  },
  subAccent: { color: OB.gold, fontFamily: 'Lexend_600SemiBold' },
  dialContainer: { alignItems: 'center', justifyContent: 'center' },
  dialGlow: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(217,160,111,0.1)',
    shadowColor: OB.gold,
    shadowOpacity: 0.4, shadowRadius: 60, shadowOffset: { width: 0, height: 0 },
  },
  dialCenter: { alignItems: 'center', justifyContent: 'center' },
  dialCenterIcon:  { fontSize: scaleFont(30), color: OB.gold, marginBottom: 4 },
  dialCenterLabel: { fontFamily: 'Lexend_700Bold', fontSize: scaleFont(14), color: OB.text },
  dialCenterSub:   { fontFamily: 'Lexend_400Regular', fontSize: scaleFont(11), color: OB.muted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagDot: { width: 10, height: 10, borderRadius: 5 },
  tagText: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(12), color: OB.muted,
  },
  footer: { padding: 32, paddingBottom: 44, gap: 14, alignItems: 'center' },
  btn: {
    alignSelf: 'stretch', backgroundColor: OB.saffron,
    paddingVertical: 18, borderRadius: 9999,
    alignItems: 'center', shadowColor: OB.saffron,
    shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 4 },
  },
  btnPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(16),
    color: '#fff', letterSpacing: 0.3,
  },
  skip: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(13), color: OB.muted,
  },
});
