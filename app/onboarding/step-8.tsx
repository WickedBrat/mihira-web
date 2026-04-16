// Screen 8: The Sarathi's Voice — AI First Question
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeIn, FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
  pressedSendButtonStyle,
} from '@/features/onboarding/onboardingStyles';

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
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 gap-5 px-7 pt-6">
          {/* Sarathi avatar */}
          <Animated.View entering={FadeIn.delay(200).duration(600)} className="items-start gap-1.5">
            <View className="h-[52px] w-[52px] items-center justify-center rounded-full border border-ob-saffron-border bg-ob-saffron-dim">
              <Text className="text-2xl text-ob-gold">☽</Text>
              <Animated.View
                className="absolute bottom-[3px] right-[3px] h-2.5 w-2.5 rounded-full border-[1.5px] border-ob-bg bg-ob-saffron"
                style={dotStyle}
              />
            </View>
            <Text className="font-body text-[11px] tracking-[0.5px] text-ob-muted">Your Sarathi</Text>
          </Animated.View>

          {/* Bubble */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(500)}
            className="max-w-[90%] self-start rounded-[20px] rounded-tl border border-ob-card-border bg-ob-card p-[18px]"
          >
            <Text className="font-body text-[15px] leading-6 text-ob-text">
              I am your Sarathi — your Charioteer.{'\n\n'}
              {name}, what is one question weighing on your heart today?
            </Text>
          </Animated.View>

          {/* Input */}
          {!answered && !loading && (
            <Animated.View
              entering={FadeInDown.delay(900).duration(500)}
              className="flex-row items-end gap-2.5 rounded-2xl border border-ob-card-border bg-ob-card p-3.5"
            >
              <TextInput
                ref={inputRef}
                className="max-h-[120px] flex-1 font-body text-[15px] leading-[23px] text-ob-text"
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
                className={`h-10 w-10 items-center justify-center rounded-full bg-ob-saffron ${
                  !question.trim() ? 'opacity-[0.35]' : ''
                }`}
                style={({ pressed }) => pressed && pressedSendButtonStyle}
              >
                <Text className="font-headline text-lg text-white">→</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Loading state */}
          {loading && (
            <Animated.View entering={FadeIn.duration(300)} className="items-start gap-2.5">
              <Text className="font-body text-sm italic text-ob-muted">Generating Divine Perspective…</Text>
              <View className="flex-row gap-1.5 pl-1">
                {[0, 1, 2].map((i) => (
                  <LoadingDot key={i} delay={i * 250} />
                ))}
              </View>
            </Animated.View>
          )}

          {/* User bubble + response */}
          {answered && (
            <Animated.View entering={FadeInDown.duration(400)} className="gap-3">
              <View className="max-w-[85%] self-end rounded-[20px] rounded-br border border-ob-saffron-border bg-ob-saffron-dim p-4">
                <Text className="font-body text-sm leading-[22px] text-ob-text">{question}</Text>
              </View>
              <View className="max-w-[90%] self-start rounded-[20px] rounded-tl border border-ob-card-border bg-ob-card p-[18px]">
                <Text className="font-body text-[15px] leading-6 text-ob-text">
                  Your question is received. The stars have noted your seeking.{'\n\n'}
                  As we journey together, the patterns will reveal what your mind already knows.
                </Text>
              </View>
            </Animated.View>
          )}
        </View>

        {answered && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} className="items-end p-8 pb-11">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding/step-9');
              }}
              className="items-center rounded-full bg-ob-saffron px-8 py-4"
              style={({ pressed }) => [
                onboardingButtonShadow,
                pressed && pressedButtonStyle,
              ]}
            >
              <Text className="font-label text-base tracking-[0.3px] text-white">
                Continue My Journey →
              </Text>
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
  return <Animated.View className="h-[7px] w-[7px] rounded bg-ob-saffron" style={style} />;
}
