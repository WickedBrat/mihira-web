// Screen 2: The Modern Mirror — Pain Point Intake
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, setOnboardingData } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

const PILLS = [
  'Decision Fatigue',
  'Career Burnout',
  'Search for Purpose',
  'Disconnected from Roots',
  'Restless Mind',
];

export default function Screen2() {
  const [selected, setSelected]     = useState<string[]>([]);
  const [toastVisible, setToast]    = useState(false);
  const toastOpacity                = useRef(new RNAnimated.Value(0)).current;

  function toggle(item: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isFirst = selected.length === 0;
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
    if (isFirst && !selected.includes(item)) showToast();
  }

  function showToast() {
    if (toastVisible) return;
    setToast(true);
    RNAnimated.sequence([
      RNAnimated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      RNAnimated.delay(2800),
      RNAnimated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => setToast(false));
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ painPoints: selected });
    router.push('/onboarding/step-3');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headline}>What brings you{'\n'}to Aksha today?</Text>
          <Text style={styles.sub}>Select all that resonate.</Text>
        </Animated.View>

        <View style={styles.pills}>
          {PILLS.map((pill, i) => {
            const active = selected.includes(pill);
            return (
              <Animated.View key={pill} entering={FadeInDown.delay(i * 80 + 200).duration(400)}>
                <Pressable
                  onPress={() => toggle(pill)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  {active && (
                    <Animated.Text entering={ZoomIn.duration(200)} style={styles.pillCheck}>✦</Animated.Text>
                  )}
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{pill}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.footer}>
        <Pressable
          onPress={proceed}
          style={({ pressed }) => [
            styles.btn,
            selected.length === 0 && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.btnText}>Continue →</Text>
        </Pressable>
      </Animated.View>

      {/* Validation toast */}
      {toastVisible && (
        <RNAnimated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>
            ✦ We hear you. You are entering a space of clarity.
          </Text>
        </RNAnimated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: OB.bg },
  body:        { flex: 1, paddingHorizontal: 32, paddingTop: 32, gap: 36 },
  header:      { gap: 10 },
  headline: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: scaleFont(36),
    color: OB.text,
    letterSpacing: -1,
    lineHeight: scaleFont(42),
  },
  sub: {
    fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(15),
    color: OB.muted,
  },
  pills:       { gap: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: OB.cardBorder,
    backgroundColor: OB.card,
  },
  pillActive: {
    borderColor: OB.saffronBorder,
    backgroundColor: OB.saffronDim,
  },
  pillCheck: {
    fontSize: scaleFont(12),
    color: OB.saffron,
  },
  pillText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: scaleFont(15),
    color: OB.muted,
  },
  pillTextActive: { color: OB.text },
  footer: {
    padding: 32,
    paddingBottom: 44,
    alignItems: 'flex-end',
  },
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
  btnDisabled: { opacity: 0.35 },
  btnPressed:  { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: scaleFont(16),
    color: '#fff',
    letterSpacing: 0.3,
  },
  toast: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(217,160,111,0.15)',
    borderWidth: 1,
    borderColor: OB.goldBorder,
    borderRadius: 14,
    padding: 16,
  },
  toastText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(13),
    color: OB.gold,
    textAlign: 'center',
    lineHeight: scaleFont(20),
  },
});
