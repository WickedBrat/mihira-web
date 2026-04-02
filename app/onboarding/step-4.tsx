// Screen 4: The Sacred Request — Name Input
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, setOnboardingData } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

export default function Screen4() {
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);

  function proceed() {
    const trimmed = name.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ userName: trimmed });
    router.push('/onboarding/step-5');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        {Array.from({ length: 11 }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= 2 && styles.dotActive]} />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <Text style={styles.label}>STEP 4 OF 12</Text>
            <Text style={styles.headline}>What shall we call{'\n'}you in this space?</Text>
            <Text style={styles.sub}>
              A name given to a space becomes sacred.{'\n'}
              Choose yours with care.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputWrap}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name…"
              placeholderTextColor={OB.muted}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={proceed}
              maxLength={40}
            />
            <View style={styles.inputLine} />
            {name.length > 0 && (
              <Animated.Text entering={FadeInDown.duration(300)} style={styles.preview}>
                ☽  {name}
              </Animated.Text>
            )}
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.footer}>
          <Pressable
            onPress={proceed}
            style={({ pressed }) => [
              styles.btn,
              !name.trim() && styles.btnDisabled,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnText}>
              {name.trim() ? `Enter as ${name.trim().split(' ')[0]} →` : 'Enter your name first'}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: OB.bg },
  kav:       { flex: 1 },
  progress:  { flexDirection: 'row', gap: 4, paddingHorizontal: 32, paddingTop: 16, paddingBottom: 4 },
  dot:       { flex: 1, height: 2, backgroundColor: OB.cardBorder, borderRadius: 1 },
  dotActive: { backgroundColor: OB.saffron },
  body:      { flex: 1, paddingHorizontal: 32, paddingTop: 40, gap: 48 },
  header:    { gap: 14 },
  label: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: scaleFont(10),
    letterSpacing: 2.5,
    color: OB.saffron,
    textTransform: 'uppercase',
  },
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
    lineHeight: scaleFont(23),
  },
  inputWrap: { gap: 16 },
  input: {
    fontFamily: 'Lexend_700Bold',
    fontSize: scaleFont(32),
    color: OB.text,
    letterSpacing: -0.5,
    paddingBottom: 8,
  },
  inputLine: {
    height: 1,
    backgroundColor: OB.goldBorder,
  },
  preview: {
    fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(14),
    color: OB.gold,
    letterSpacing: 1,
    marginTop: 4,
  },
  footer:     { padding: 32, paddingBottom: 44 },
  btn: {
    backgroundColor: OB.saffron,
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: OB.saffron,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
  },
  btnDisabled: { opacity: 0.35 },
  btnPressed:  { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: scaleFont(16),
    color: '#fff',
    letterSpacing: 0.3,
  },
});
