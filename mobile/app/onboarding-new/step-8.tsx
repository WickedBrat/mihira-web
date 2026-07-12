// S8: The Deeper Layer
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { Clock, Moon, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel, SecondaryLink } from '@/features/onboarding-new/PrimaryButton';
import { NeutralCard } from '@/features/onboarding-new/GoldCard';

const BENEFITS = [
  { title: 'Timing windows', body: 'Know when the day favors the thing you’re planning.', Icon: Clock },
  { title: 'Daily rhythm', body: 'Guidance tuned to your chart, not a generic calendar.', Icon: Moon },
  { title: 'Private by design', body: 'Encrypted, used only for your chart, never shared.', Icon: ShieldCheck },
];

export default function OnboardingNewS8() {
  function reveal() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-9');
  }

  function skip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-15');
  }

  return (
    <OnboardingNewScreen glowIntensity={0.28}>
      <View className="flex-1 items-center gap-7 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <ScreenLabel>The deeper layer</ScreenLabel>
          <Text className="text-center font-serif-medium text-[32px] leading-[39px] text-obn-text">
            A layer most people never show anyone.
          </Text>
          <Text className="text-center font-manrope text-[14px] leading-[21px] text-obn-muted">
            Your birth rhythm lets Mihira read timing, not just words.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] justify-center gap-3">
          {BENEFITS.map((b, i) => (
            <Animated.View key={b.title} entering={FadeInDown.delay(i * 90 + 200).duration(400)}>
              <NeutralCard>
                <View className="flex-row items-start gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full border border-obn-gold-border">
                    <b.Icon size={16} color="#E8A33D" strokeWidth={1.8} />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="font-manrope-bold text-[14px] text-obn-text">{b.title}</Text>
                    <Text className="font-manrope text-[13px] leading-[20px] text-obn-muted">{b.body}</Text>
                  </View>
                </View>
              </NeutralCard>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center gap-4 px-8 pb-11">
        <PrimaryButton label="Reveal my timing →" onPress={reveal} />
        <SecondaryLink label="Continue without it — Mihira can still guide you, just without knowing your timing." onPress={skip} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
