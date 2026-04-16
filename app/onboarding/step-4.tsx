// Screen 4: The Sacred Request — Name Input
import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, setOnboardingData } from '@/lib/onboardingStore';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

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
    <SafeAreaView className="flex-1 bg-ob-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 gap-12 px-8 pt-10">
          <Animated.View entering={FadeInDown.duration(500)} className="gap-3.5">
            <Text className="font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
              What shall we call{'\n'}you in this space?
            </Text>
            <Text className="font-body text-[15px] leading-[23px] text-ob-muted">
              A name given to a space becomes sacred.{'\n'}
              Choose yours with care.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} className="gap-4">
            <TextInput
              ref={inputRef}
              className="font-headline text-[32px] text-ob-text"
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
            <View className="h-px bg-ob-gold-border" />
            {name.length > 0 && (
              <Animated.Text
                entering={FadeInDown.duration(300)}
                className="mt-1 font-body text-sm tracking-[1px] text-ob-gold"
              >
                ☽  {name}
              </Animated.Text>
            )}
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)} className="items-end p-8 pb-11">
          <Pressable
            onPress={proceed}
            className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
              !name.trim() ? 'opacity-[0.35]' : ''
            }`}
            style={({ pressed }) => [
              onboardingButtonShadow,
              pressed && pressedButtonStyle,
            ]}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              {name.trim() ? `Enter as ${name.trim().split(' ')[0]} →` : 'Enter your name first'}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
