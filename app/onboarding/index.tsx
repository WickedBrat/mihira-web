// Screen 1: The Initial Spark
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import { OB } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';
import { analytics } from '@/lib/analytics';

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
    <SafeAreaView style={styles.safe}>
      {/* Ambient star field */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {STARS.map((s, i) => (
          <View key={i} style={[styles.star, { top: s.y, left: s.x, opacity: s.o }]} />
        ))}
      </View>

      <View style={styles.center}>
        <Animated.View style={logoStyle}>
          <Text style={styles.crescent}>☽</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(900)}>
          <Text style={styles.logo}>Aksha</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(900).duration(800)} style={styles.copy}>
          <Text style={styles.headline}>The universe is in motion.</Text>
          <Text style={styles.sub}>Are you in sync?</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(2200).duration(800)} style={styles.footer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            analytics.onboardingStarted();
            router.push('/onboarding/step-2');
          }}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Begin My Alignment</Text>
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

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: OB.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  crescent: { fontSize: scaleFont(52), color: OB.gold, textAlign: 'center', marginBottom: -8 },
  logo: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: scaleFont(48),
    color: OB.gold,
    letterSpacing: -2,
    textAlign: 'center',
  },
  copy:     { alignItems: 'center', gap: 10, marginTop: 12 },
  headline: {
    fontFamily: 'Lexend_700Bold',
    fontSize: scaleFont(22),
    color: OB.text,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(16),
    color: OB.muted,
    textAlign: 'center',
  },
  footer: { padding: 32, paddingBottom: 44, alignItems: 'flex-end', gap: 14 },
  btn: {
    backgroundColor: OB.saffron,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: OB.saffron,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  btnPressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: scaleFont(16),
    color: '#fff',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  footNote: {
    fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(12),
    color: OB.muted,
    letterSpacing: 0.5,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: OB.gold,
  },
});
