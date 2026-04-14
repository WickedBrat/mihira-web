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
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
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
  body:      { flex: 1, paddingHorizontal: 32, paddingTop: 40, gap: 48 },
  header:    { gap: 14 },
  headline: {
    fontFamily: 'GoogleSans_700Bold',
    fontSize: scaleFont(36),
    color: OB.text,
    letterSpacing: -1,
    lineHeight: scaleFont(42),
  },
  sub: {
    fontFamily: 'GoogleSans_400Regular',
    fontSize: scaleFont(15),
    color: OB.muted,
    lineHeight: scaleFont(23),
  },
  inputWrap: { gap: 16 },
  input: {
    fontFamily: 'GoogleSans_700Bold',
    fontSize: scaleFont(32),
    color: OB.text,
  },
  inputLine: {
    height: 1,
    backgroundColor: OB.goldBorder,
  },
  preview: {
    fontFamily: 'GoogleSans_400Regular',
    fontSize: scaleFont(14),
    color: OB.gold,
    letterSpacing: 1,
    marginTop: 4,
  },
  footer:     { padding: 32, paddingBottom: 44, alignItems: 'flex-end' },
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
    fontFamily: 'GoogleSans_600SemiBold',
    fontSize: scaleFont(16),
    color: '#fff',
    letterSpacing: 0.3,
  },
});
