// S17: Today, Unfinished
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData } from '@/lib/onboardingNewStore';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import { deriveMoonProfile } from '@/lib/vedic/moonProfile';
import { apiFetch } from '@/lib/apiFetch';
import type { DailyFocusArea } from '@/lib/dailyAlignmentTypes';
import { useDailyArth } from '@/features/daily/useDailyArth';

async function fetchFocusAreas(): Promise<DailyFocusArea[]> {
  const stored = getOnboardingNewData();
  if (!stored.birthPlace.trim()) return [];

  const birthDt = formatBirthDateTime(mergeDateAndTime(stored.birthDate, stored.birthTime));
  const moon = deriveMoonProfile(stored.birthDate, stored.birthTime, stored.unknownBirthTime);

  const response = await apiFetch('/api/wisdom/daily', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birthDt,
      birthPlace: stored.birthPlace,
      nakshatra: moon?.nakshatra,
      rashi: moon?.rashi,
    }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error ?? 'Daily API failed');
  return Array.isArray(data.focusAreas) ? data.focusAreas : [];
}

export default function OnboardingNewS17() {
  const name = getOnboardingNewData().name || 'friend';
  const [reflectOpen, setReflectOpen] = useState(false);
  const [focusAreas, setFocusAreas] = useState<DailyFocusArea[] | null>(null);
  const { arth, isLoading: arthLoading } = useDailyArth();

  useEffect(() => {
    fetchFocusAreas()
      .then(setFocusAreas)
      .catch((err) => {
        console.error('[onboarding-new] daily alignment fetch failed', err);
        setFocusAreas([]);
      });
  }, []);

  const primaryArea = focusAreas?.[0];
  const lockedArea = focusAreas?.[1];

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-18');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-6 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <ScreenLabel>Today, unfinished</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[37px] text-obn-text">
            Today was prepared for you, {name}.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] gap-3.5">
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="gap-2 rounded-[22px] border border-obn-gold-border-soft bg-obn-card px-5 py-4">
            <View className="flex-row items-baseline justify-between gap-2.5">
              <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">
                {primaryArea?.area ?? 'Focus'}
              </Text>
              <Text className="font-manrope text-[12px] text-obn-muted-dim">{primaryArea?.timeRange ?? '8:00 – 10:00 AM'}</Text>
            </View>
            <Text className="font-manrope text-[14px] leading-[21px] text-obn-text-soft">
              {primaryArea?.suggestion ?? (focusAreas === null ? 'Reading your rhythm…' : 'Say the difficult thing gently — the window favors honesty held with care.')}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(280).duration(400)} className="gap-2 rounded-[22px] border border-obn-gold-border-soft bg-obn-card px-5 py-4">
            <View className="flex-row items-baseline justify-between gap-2.5">
              <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">Daily quote</Text>
              <Text className="font-manrope text-[12px] text-obn-muted-dim">free, every day</Text>
            </View>
            <Text className="font-serif-regular-italic text-[17px] leading-[24px] text-obn-text">
              {arthLoading ? '…' : (arth?.quote ?? '"Let a person lift themselves by their own self; let them not lower themselves."')}
            </Text>
            <Text className="font-manrope text-[12px] text-obn-muted-dim">{arth?.source ?? 'Bhagavad Gita 6.5'}</Text>

            {!reflectOpen ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setReflectOpen(true);
                }}
                className="mt-1 self-start rounded-full border border-obn-gold-border bg-obn-gold-dim px-5 py-2"
              >
                <Text className="font-manrope-bold text-[13px] text-obn-gold">Reflect</Text>
              </Pressable>
            ) : (
              <Animated.View entering={FadeIn.duration(400)} className="gap-2 border-t border-obn-gold-border-soft pt-2.5">
                <View className="gap-0.5">
                  <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-gold">Meaning</Text>
                  <Text className="font-manrope text-[13px] leading-[20px] text-obn-text-soft">
                    {arth?.dailyReflection?.summary ?? 'The self is the only instrument you fully hold. Raising it is nobody else\'s job.'}
                  </Text>
                </View>
                <View className="gap-0.5">
                  <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-gold">One step</Text>
                  <Text className="font-manrope text-[13px] leading-[20px] text-obn-text-soft">
                    {arth?.dailyReflection?.dailyPractice?.[0] ?? 'Name one habit that lowers you. Skip it once today, deliberately.'}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="overflow-hidden rounded-[22px]">
            <View className="gap-2 border border-obn-gold-border-soft bg-obn-card px-5 py-4">
              <View className="flex-row items-baseline justify-between gap-2.5">
                <Text className="font-manrope-bold text-[11px] uppercase tracking-[2px] text-obn-gold">
                  {lockedArea?.area ?? 'Rest & recovery'}
                </Text>
                <Text className="font-manrope text-[12px] text-obn-muted-dim">{lockedArea?.timeRange ?? '9:00 – 10:00 PM'}</Text>
              </View>
              <Text className="font-manrope text-[14px] leading-[21px] text-obn-text-soft">
                {lockedArea?.suggestion ?? 'Close the day without a screen — let the mind settle like water.'}
              </Text>
            </View>
            <BlurView intensity={30} tint="dark" className="absolute inset-0 items-center justify-center px-6">
              <Text className="text-center font-manrope-semibold text-[14px] leading-[21px] text-obn-text">
                One more layer of today is ready — it opens the moment your vow is set.
              </Text>
            </BlurView>
          </Animated.View>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Make my vow →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
