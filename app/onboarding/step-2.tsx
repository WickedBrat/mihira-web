// Screen 2: The Modern Mirror — Pain Point Intake
import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  Animated as RNAnimated,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

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
    router.push('/onboarding/step-4');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <View className="flex-1 items-center gap-9 px-8 pt-8">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            What brings you{'\n'}to Aksha today?
          </Text>
          <Text className="text-center font-body text-[15px] text-ob-muted">Select all that resonate.</Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {PILLS.map((pill, i) => {
            const active = selected.includes(pill);
            return (
              <Animated.View key={pill} entering={FadeInDown.delay(i * 80 + 200).duration(400)}>
                <Pressable
                  onPress={() => toggle(pill)}
                  className={`flex-row items-center justify-center gap-2.5 rounded-[14px] border px-[22px] py-4 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                >
                  {active && (
                    <Animated.Text entering={ZoomIn.duration(200)} className="text-xs text-ob-saffron">
                      ✦
                    </Animated.Text>
                  )}
                  <Text className={`text-center font-body-medium text-[15px] ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                    {pill}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            selected.length === 0 ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
        </Pressable>
      </Animated.View>

      {/* Validation toast */}
      {toastVisible && (
        <RNAnimated.View
          className="absolute bottom-[120px] left-6 right-6 rounded-[14px] border border-ob-gold-border bg-[rgba(217,160,111,0.15)] p-4"
          style={{ opacity: toastOpacity }}
        >
          <Text className="text-center font-body text-sm leading-5 text-ob-gold">
            ✦ We hear you. You are entering a space of clarity.
          </Text>
        </RNAnimated.View>
      )}
    </SafeAreaView>
  );
}
