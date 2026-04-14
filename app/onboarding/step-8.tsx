// Screen 8: The Sarathi's Voice — AI First Question
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeIn, FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

export default function Screen8() {
  const [question, setQuestion]  = useState('');
  const [loading, setLoading]    = useState(false);
  const [answered, setAnswered]  = useState(false);
  const inputRef = useRef<TextInput>(null);
  const dotOpacity = useSharedValue(0.4);

  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Friend';

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  async function handleSubmit() {
    const q = question.trim();
    if (!q) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    setOnboardingData({ firstQuestion: q });
    // Simulate "divine perspective" delay
    await new Promise((res) => setTimeout(res, 2200));
    setLoading(false);
    setAnswered(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          {/* Sarathi avatar */}
          <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>☽</Text>
              <Animated.View style={[styles.pulseDot, dotStyle]} />
            </View>
            <Text style={styles.avatarLabel}>Your Sarathi</Text>
          </Animated.View>

          {/* Bubble */}
          <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.bubble}>
            <Text style={styles.bubbleText}>
              I am your Sarathi — your Charioteer.{'\n\n'}
              {name}, what is one question weighing on your heart today?
            </Text>
          </Animated.View>

          {/* Input */}
          {!answered && !loading && (
            <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.inputWrap}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask something real…"
                placeholderTextColor={OB.muted}
                multiline
                maxLength={280}
                autoFocus
              />
              <Pressable
                onPress={handleSubmit}
                disabled={!question.trim()}
                style={({ pressed }) => [
                  styles.sendBtn,
                  !question.trim() && styles.sendBtnDisabled,
                  pressed && styles.sendBtnPressed,
                ]}
              >
                <Text style={styles.sendBtnText}>→</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Loading state */}
          {loading && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Generating Divine Perspective…</Text>
              <View style={styles.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <LoadingDot key={i} delay={i * 250} />
                ))}
              </View>
            </Animated.View>
          )}

          {/* User bubble + response */}
          {answered && (
            <Animated.View entering={FadeInDown.duration(400)} style={{ gap: 12 }}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{question}</Text>
              </View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>
                  Your question is received. The stars have noted your seeking.{'\n\n'}
                  As we journey together, the patterns will reveal what your mind already knows.
                </Text>
              </View>
            </Animated.View>
          )}
        </View>

        {answered && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.footer}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding/step-9');
              }}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnText}>Continue My Journey →</Text>
            </Pressable>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot3, style]} />;
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: OB.bg },
  kav:      { flex: 1 },
  body:     { flex: 1, paddingHorizontal: 28, paddingTop: 24, gap: 20 },
  avatarWrap: { alignItems: 'flex-start', gap: 6 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: OB.saffronDim,
    borderWidth: 1, borderColor: OB.saffronBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarIcon: { fontSize: scaleFont(24), color: OB.gold },
  pulseDot: {
    position: 'absolute', bottom: 3, right: 3,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: OB.saffron,
    borderWidth: 1.5, borderColor: OB.bg,
  },
  avatarLabel: {
    fontFamily: 'GoogleSans_400Regular', fontSize: scaleFont(11),
    color: OB.muted, letterSpacing: 0.5,
  },
  bubble: {
    backgroundColor: OB.card,
    borderWidth: 1, borderColor: OB.cardBorder,
    borderRadius: 20, borderTopLeftRadius: 4,
    padding: 18,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontFamily: 'GoogleSans_400Regular', fontSize: scaleFont(15),
    color: OB.text, lineHeight: scaleFont(24),
  },
  userBubble: {
    backgroundColor: OB.saffronDim,
    borderWidth: 1, borderColor: OB.saffronBorder,
    borderRadius: 20, borderBottomRightRadius: 4,
    padding: 16,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  userBubbleText: {
    fontFamily: 'GoogleSans_400Regular', fontSize: scaleFont(14),
    color: OB.text, lineHeight: scaleFont(22),
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: OB.card, borderRadius: 16,
    borderWidth: 1, borderColor: OB.cardBorder,
    padding: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'GoogleSans_400Regular', fontSize: scaleFont(15),
    color: OB.text, lineHeight: scaleFont(23),
    maxHeight: 120,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: OB.saffron,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },
  sendBtnPressed:  { opacity: 0.75, transform: [{ scale: 0.94 }] },
  sendBtnText: {
    fontFamily: 'GoogleSans_700Bold', fontSize: scaleFont(18), color: '#fff',
  },
  loadingWrap: { alignItems: 'flex-start', gap: 10 },
  loadingText: {
    fontFamily: 'GoogleSans_400Regular', fontSize: scaleFont(13),
    color: OB.muted, fontStyle: 'italic',
  },
  loadingDots: { flexDirection: 'row', gap: 6, paddingLeft: 4 },
  dot3: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: OB.saffron,
  },
  footer: { padding: 32, paddingBottom: 44, alignItems: 'flex-end' },
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
  btnPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'GoogleSans_600SemiBold', fontSize: scaleFont(16),
    color: '#fff', letterSpacing: 0.3,
  },
});
