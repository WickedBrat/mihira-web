// Screen 11: The Sankalpa — Commitment Tier
import React, { useState } from 'react';
import {
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@clerk/expo';
import { analytics } from '@/lib/analytics';
import { getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { setOnboardingCompleted } from '@/lib/onboardingStatus';
import { useProfile } from '@/features/profile/useProfile';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const TIERS = [
  {
    id: 'seed',
    icon: '🌱',
    name: 'The Seed',
    duration: '3 min',
    desc: 'A short daily check-in to ground your day.',
    features: ['Daily alignment window', 'Nakshatra energy snapshot'],
  },
  {
    id: 'growth',
    icon: '🌿',
    name: 'The Growth',
    duration: '10 min',
    desc: 'A deeper daily ritual with wisdom and guided reflection.',
    features: ['Everything in Seed', 'Daily wisdom reading', 'Guidance sessions'],
    recommended: true,
  },
  {
    id: 'mastery',
    icon: '🪷',
    name: 'The Mastery',
    duration: '20 min',
    desc: 'A fuller Vedic practice for people who want sustained depth.',
    features: ['Everything in Growth', 'Gurukul lessons', 'Deeper Sacred Timing guidance'],
  },
] as const;

type TierId = (typeof TIERS)[number]['id'];

export default function Screen11() {
  const [selected, setSelected] = useState<TierId>('growth');
  const [isCompleting, setIsCompleting] = useState(false);
  const { isSignedIn } = useAuth();
  const { saveField } = useProfile();

  async function proceed() {
    if (isCompleting) return;
    setIsCompleting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ commitmentTier: selected });

    const d = getOnboardingData();

    analytics.onboardingCompleted({
      has_birth_place: Boolean(d.birthPlace),
      commitment_tier: d.commitmentTier ?? null,
      is_signed_in: Boolean(isSignedIn),
    });

    if (isSignedIn) {
      const birthDateTime = !d.unknownBirthTime
        ? formatBirthDateTime(mergeDateAndTime(d.birthDate, d.birthTime))
        : '';

      await Promise.all([
        d.userName ? saveField('name', d.userName).catch(() => {}) : Promise.resolve(),
        birthDateTime ? saveField('birth_dt', birthDateTime).catch(() => {}) : Promise.resolve(),
        d.birthPlace ? saveField('birth_place', d.birthPlace).catch(() => {}) : Promise.resolve(),
        d.commitmentTier ? saveField('focus_area', d.commitmentTier).catch(() => {}) : Promise.resolve(),
      ]);
    }

    await setOnboardingCompleted(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-7 p-8 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-2.5">
          <Text className="text-center font-headline text-[34px] leading-10 tracking-[-0.8px] text-ob-text">
            Choose the rhythm{'\n'}you can keep.
          </Text>
          <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
            Consistency matters more than intensity. You can change this anytime.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3.5">
          {TIERS.map((tier, i) => {
            const active = selected === tier.id;
            return (
              <Animated.View
                key={tier.id}
                entering={FadeInDown.delay(i * 100 + 200).duration(450)}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(tier.id);
                  }}
                  className={`overflow-hidden rounded-[18px] border p-[22px] gap-3.5 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                >
                  {'recommended' in tier && tier.recommended && (
                    <View className="absolute right-0 top-0 rounded-bl-xl bg-ob-saffron px-3 py-[5px]">
                      <Text className="font-label text-[9px] tracking-[1.5px] text-white">MOST POPULAR</Text>
                    </View>
                  )}

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3.5">
                      <Text className="text-[28px]">{tier.icon}</Text>
                      <View>
                        <Text className={`font-headline text-lg ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                          {tier.name}
                        </Text>
                        <Text className="font-body text-xs text-ob-muted">{tier.duration} / day</Text>
                      </View>
                    </View>
                    {active && (
                      <Animated.View
                        entering={ZoomIn.duration(250)}
                        className="h-[30px] w-[30px] items-center justify-center rounded-full bg-ob-saffron"
                      >
                        <Text className="text-sm text-white">✦</Text>
                      </Animated.View>
                    )}
                  </View>

                  <Text className={`font-body text-sm leading-5 ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                    {tier.desc}
                  </Text>

                  {active && (
                    <Animated.View entering={FadeInDown.duration(300)} className="gap-1.5 pt-1">
                      {tier.features.map((f) => (
                        <View key={f} className="flex-row items-start gap-1.5">
                          <Text className="font-headline text-base leading-5 text-ob-gold">·</Text>
                          <Text className="font-body text-sm leading-5 text-ob-gold">{f}</Text>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        <View className="h-[120px]" />
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(700).duration(500)}
        className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11"
      >
        <Pressable
          onPress={proceed}
          disabled={isCompleting}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            isCompleting ? 'opacity-60' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              {isCompleting ? 'Saving...' : 'Set my daily rhythm →'}
            </Text>
          </Pressable>
        </Animated.View>
    </SafeAreaView>
  );
}
