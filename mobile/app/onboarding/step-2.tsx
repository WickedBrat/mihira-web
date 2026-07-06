// Screen 2: Naming the Ache
import React, { useState } from 'react';
import {
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

interface Ache {
  id: string;
  label: string;
  ack: string;
}

const ACHES: Ache[] = [
  { id: 'burnout', label: 'Burned out', ack: 'That takes more out of you than people know.' },
  { id: 'direction', label: 'Seeking direction', ack: "Not knowing which way to face is its own kind of tired." },
  { id: 'restless', label: "Mind won't settle", ack: "A mind that won't settle is asking for rhythm, not more effort." },
  { id: 'reconnect', label: 'Want to reconnect with myself', ack: "You can't be far from something that lives in you." },
];

const DEFAULT_ACK = 'Take your time. Nothing here is graded.';

export default function Screen2() {
  const [selected, setSelected] = useState<string[]>([]);
  const [lastAche, setLastAche] = useState<string | null>(null);

  function toggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
    setLastAche(id);
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const labels = ACHES.filter((a) => selected.includes(a.id)).map((a) => a.label);
    setOnboardingData({ painPoints: labels });
    router.push('/onboarding/step-3');
  }

  const ackText = selected.length === 0
    ? DEFAULT_ACK
    : ACHES.find((a) => a.id === lastAche)?.ack ?? DEFAULT_ACK;

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-6 px-8 pt-8 pb-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            What are you{'\n'}carrying today?
          </Text>
          <Text className="text-center font-body text-[15px] text-ob-muted">Choose everything that feels true right now.</Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {ACHES.map((ache, i) => {
            const active = selected.includes(ache.id);
            return (
              <Animated.View key={ache.id} entering={FadeInDown.delay(i * 70 + 200).duration(380)}>
                <Pressable
                  onPress={() => toggle(ache.id)}
                  className={`flex-row items-center justify-center gap-2.5 rounded-[14px] border px-[22px] py-4 mb-1 ${
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
                    {ache.label}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          key={lastAche ?? 'default'}
          entering={FadeIn.duration(400)}
          className="w-full max-w-[360px] items-center gap-2 px-4"
        >
          <View className="h-px w-[30px] bg-ob-gold" />
          <Text className="text-center font-headline text-[19px] leading-[26px] text-ob-text">
            {ackText}
          </Text>
        </Animated.View>

        <View className="h-[80px]" />
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11">
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
    </SafeAreaView>
  );
}
