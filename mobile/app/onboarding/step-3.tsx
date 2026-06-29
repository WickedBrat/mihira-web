// Screen 3: Life Context
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const CONTEXTS = [
  'Work',
  'Family',
  'Relationship',
  'Spiritual practice',
  'Identity / purpose',
  'Money / stability',
  'Health / energy',
  'I am not sure',
];

export default function Screen3() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ guidanceContext: selected });
    router.push('/onboarding/step-4');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <View className="flex-1 items-center gap-8 px-8 pt-8">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            Where is this{'\n'}showing up?
          </Text>
          <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
            This helps Mihira respond to your real situation.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] flex-row flex-wrap justify-center gap-3">
          {CONTEXTS.map((item, index) => {
            const active = selected.includes(item);
            return (
              <Animated.View key={item} entering={FadeInDown.delay(index * 70 + 180).duration(400)}>
                <Pressable
                  onPress={() => toggle(item)}
                  className={`flex-row items-center gap-2 rounded-full border px-4 py-3 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                >
                  {active ? (
                    <Animated.Text entering={ZoomIn.duration(180)} className="text-[11px] text-ob-saffron">
                      ✦
                    </Animated.Text>
                  ) : null}
                  <Text className={`font-body-medium text-[14px] ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                    {item}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {selected.length > 0 ? (
          <Animated.View
            entering={FadeInDown.duration(300)}
            className="w-full max-w-[360px] rounded-[20px] border border-ob-gold-border bg-ob-gold-dim p-4"
          >
            <Text className="text-center font-body text-[13px] leading-[21px] text-ob-gold">
              Noted. Saarthi will respond to where life is actually pressing.
            </Text>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View entering={FadeInUp.delay(620).duration(500)} className="items-center p-8 pb-11">
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
