// S4: The Name They'll Use For You
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/lib/auth';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS4() {
  const { user } = useUser();
  const stored = getOnboardingNewData();
  const [name, setName] = useState(() => stored.name || user?.fullName || user?.firstName || '');
  const inputRef = useRef<TextInput>(null);
  const canProceed = Boolean(name.trim());

  function proceed() {
    const trimmed = name.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ name: trimmed });
    router.push('/onboarding-new/step-5');
  }

  return (
    <OnboardingNewScreen>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 items-center justify-center gap-9 px-8">
          <Animated.View entering={FadeInDown.duration(500)} className="max-w-[340px] items-center gap-3">
            <ScreenLabel>Your name</ScreenLabel>
            <Text className="text-center font-serif-medium text-[32px] leading-[39px] text-obn-text">
              What should we call you — for now?
            </Text>
            <Text className="text-center font-manrope text-[14px] leading-[22px] text-obn-muted">
              Sages rarely used a person's given name — they used the name of what the person was becoming. We'll start with what you're called now.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(500)} className="w-full max-w-[340px] gap-3">
            <TextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="rgba(242,234,217,0.35)"
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={proceed}
              maxLength={40}
              className="rounded-[18px] border border-obn-gold-border bg-obn-card px-5 py-5 text-center font-serif-medium text-[22px] text-obn-text"
            />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
          <PrimaryButton label="Continue →" onPress={proceed} disabled={!canProceed} />
        </Animated.View>
      </KeyboardAvoidingView>
    </OnboardingNewScreen>
  );
}
