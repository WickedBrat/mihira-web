// Screen 4: The Sacred Request — Name Input
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useUser } from '@clerk/expo';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

export default function Screen4() {
  const { user } = useUser();
  const [name, setName] = useState(() => {
    const storedName = getOnboardingData().userName;
    return storedName || user?.fullName || user?.firstName || '';
  });
  const inputRef = useRef<TextInput>(null);
  const clerkName = user?.fullName || user?.firstName || '';

  useEffect(() => {
    if (name.trim() || !clerkName.trim()) return;
    setName(clerkName.trim());
    setOnboardingData({ userName: clerkName.trim() });
  }, [clerkName, name]);

  function proceed() {
    const trimmed = name.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ userName: trimmed });
    router.push('/onboarding/step-5');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 items-center justify-center gap-12 px-8 pt-10">
          <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-3.5">
            <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
              What should we{'\n'}call you?
            </Text>
            <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
              We’ll use this to personalize your chart and guidance.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} className="w-full max-w-[360px] items-center gap-4">
            <TextInput
              ref={inputRef}
              className="w-full text-center font-headline text-[32px] text-ob-text"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={OB.muted}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={proceed}
              maxLength={40}
            />
            <View className="h-px w-full bg-ob-gold-border" />
            {name.length > 0 && (
              <Animated.Text
                entering={FadeInDown.duration(300)}
                className="mt-1 text-center font-body text-sm tracking-[1px] text-ob-gold"
              >
                ☽  {name}
              </Animated.Text>
            )}
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)} className="items-center p-8 pb-11">
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
              {name.trim() ? `Continue as ${name.trim().split(' ')[0]} →` : 'Enter your name first'}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
