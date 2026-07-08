// S22: Save Your Rhythm
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSignIn } from '@/features/auth/useSignIn';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/features/profile/useProfile';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { obnButtonShadow, obnPressedStyle } from '@/features/onboarding-new/styles';
import { getFirstSelectedAche, getOnboardingNewData, getVow, saveOnboardingNewCompletion } from '@/lib/onboardingNewStore';

export default function OnboardingNewS22() {
  const stored = getOnboardingNewData();
  const ache = getFirstSelectedAche(stored);
  const vow = getVow(stored.vow);
  const name = stored.name || 'friend';
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { saveField } = useProfile();
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const persistAndEnter = useCallback(async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    const latest = getOnboardingNewData();
    const birthDateTime = !latest.unknownBirthTime
      ? formatBirthDateTime(mergeDateAndTime(latest.birthDate, latest.birthTime))
      : '';

    if (isSignedIn) {
      await Promise.all([
        latest.name ? saveField('name', latest.name).catch(() => {}) : Promise.resolve(),
        latest.gender ? saveField('gender', latest.gender).catch(() => {}) : Promise.resolve(),
        birthDateTime ? saveField('birth_dt', birthDateTime).catch(() => {}) : Promise.resolve(),
        latest.birthPlace ? saveField('birth_place', latest.birthPlace).catch(() => {}) : Promise.resolve(),
      ]);

      if (userId) {
        await saveOnboardingNewCompletion(userId, latest).catch((err) => {
          console.error('[onboarding-new] save completion failed', err);
        });
      }
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  }, [isCompleting, isSignedIn, saveField, userId]);

  const { signInWithGoogle, signInWithApple, isLoading, loadingProvider } = useSignIn(() => {
    setPendingCompletion(true);
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !pendingCompletion) return;
    setPendingCompletion(false);
    void persistAndEnter();
  }, [isLoaded, isSignedIn, pendingCompletion, persistAndEnter]);

  const isBusy = isLoading || pendingCompletion || isCompleting;

  const saveCallback = `You came in carrying ${ache.noun}, ${name}. You just wrote page one and made a vow to ${vow.name.replace('The ', 'the ')}. Don't let that reset.`;

  function skip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center justify-center gap-8 px-8">
        <ScreenLabel>Save your rhythm</ScreenLabel>

        <Animated.View entering={FadeInDown.duration(500)}>
          <Text className="text-center font-serif-medium text-[30px] leading-[39px] text-obn-text">
            {saveCallback}
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] gap-3">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void signInWithApple();
            }}
            disabled={isBusy}
            className={`flex-row items-center justify-center gap-2.5 rounded-full bg-obn-text-soft px-6 py-4 ${isBusy ? 'opacity-60' : ''}`}
            style={({ pressed }) => [obnButtonShadow, pressed && obnPressedStyle]}
          >
            <Text className="font-manrope-bold text-[15px] text-obn-ink">
              {loadingProvider === 'apple' ? 'Connecting…' : isCompleting ? 'Saving…' : 'Continue with Apple'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void signInWithGoogle();
            }}
            disabled={isBusy}
            className={`flex-row items-center justify-center gap-2.5 rounded-full border border-obn-card-border bg-obn-card px-6 py-4 ${isBusy ? 'opacity-60' : ''}`}
          >
            <Text className="font-manrope-bold text-[15px] text-obn-text-soft">
              {loadingProvider === 'google' ? 'Connecting…' : isCompleting ? 'Saving…' : 'Continue with Google'}
            </Text>
          </Pressable>
        </View>

        <View className="items-center gap-1.5">
          <Pressable onPress={skip} disabled={isBusy}>
            <Text className="text-center font-manrope text-[13px] text-obn-muted underline">
              Don't save — start fresh each time
            </Text>
          </Pressable>
          <Text className="text-center font-manrope text-[12px] text-obn-muted-dim">
            Your page and vow won't be kept on this device.
          </Text>
        </View>
      </View>

      <View className="items-center px-9 pb-13">
        <Text className="text-center font-serif-regular-italic text-[18px] leading-[26px] text-obn-muted">
          "A steady practice changes the way the path appears."
        </Text>
      </View>
    </OnboardingNewScreen>
  );
}
