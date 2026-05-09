// Screen 12: Save Account
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuth, useUser } from '@/lib/auth';
import { analytics } from '@/lib/analytics';
import { getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { setOnboardingCompleted } from '@/lib/onboardingStatus';
import { useSignIn } from '@/features/auth/useSignIn';
import { useProfile } from '@/features/profile/useProfile';
import { formatBirthDateTime, mergeDateAndTime } from '@/features/profile/utils';
import AppleLogoIcon from '@/features/auth/AppleLogo';
import GoogleLogoSolidIcon from '@/features/auth/GoogleLogo';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  absoluteFillStyle,
  hazeScaleStyle,
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

type Provider = 'google' | 'apple';

export default function Screen12() {
  const data = getOnboardingData();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const { saveField } = useProfile();
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const signedInName = user?.fullName || user?.firstName || '';
  const name = (data.userName || signedInName)?.split(' ')[0] || 'Seeker';

  const completeOnboarding = useCallback(async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    const latest = getOnboardingData();
    const finalName = latest.userName || signedInName.trim();

    if (!latest.userName && signedInName.trim()) {
      setOnboardingData({ userName: signedInName.trim() });
    }

    analytics.onboardingCompleted({
      has_birth_place: Boolean(latest.birthPlace),
      commitment_tier: latest.commitmentTier ?? null,
      is_signed_in: Boolean(isSignedIn),
    });

    if (isSignedIn) {
      const birthDateTime = !latest.unknownBirthTime
        ? formatBirthDateTime(mergeDateAndTime(latest.birthDate, latest.birthTime))
        : '';

      await Promise.all([
        finalName ? saveField('name', finalName).catch(() => {}) : Promise.resolve(),
        birthDateTime ? saveField('birth_dt', birthDateTime).catch(() => {}) : Promise.resolve(),
        latest.birthPlace ? saveField('birth_place', latest.birthPlace).catch(() => {}) : Promise.resolve(),
        latest.commitmentTier ? saveField('focus_area', latest.commitmentTier).catch(() => {}) : Promise.resolve(),
      ]);
    }

    await setOnboardingCompleted(true, {
      userId: isSignedIn ? userId : null,
      onboardingData: latest,
      onboardingStep: 'completed',
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  }, [isCompleting, isSignedIn, saveField, signedInName, userId]);

  const { signInWithGoogle, signInWithApple, isLoading, loadingProvider } = useSignIn(() => {
    setPendingCompletion(true);
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !pendingCompletion) return;
    setPendingCompletion(false);
    void completeOnboarding();
  }, [completeOnboarding, isLoaded, isSignedIn, pendingCompletion]);

  const isBusy = isLoading || pendingCompletion || isCompleting;
  const isAuthReady = isLoaded && isUserLoaded;

  return (
    <View className="flex-1">
      <OnboardingDevBackButton />

      <LinearGradient
        colors={['#0D0500', '#14080C', '#07090C']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={absoluteFillStyle}
      />

      <Animated.View
        className="absolute -left-[60px] -right-[60px] top-[-80px] h-[300px] rounded-[200px] bg-[rgba(224,122,95,0.06)]"
        style={hazeScaleStyle}
        pointerEvents="none"
      />
      <OnboardingStarField />

      <SafeAreaView className="flex-1 items-center justify-between px-8 pb-[52px]">
        <View className="items-center gap-4 pt-[68px]">
          <Animated.Text
            entering={FadeIn.delay(300).duration(700)}
            className="text-center font-headline text-[40px] leading-[46px] tracking-[-1.2px] text-ob-text"
          >
            Keep your rhythm,{'\n'}
            <Text className="text-ob-gold">{name}.</Text>
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(650).duration(700)}
            className="max-w-[315px] text-center font-body text-[15px] leading-[24px] text-ob-text/60"
          >
            Save your chart, daily rhythm, and first question so Mihira can stay personal across devices.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeIn.delay(900).duration(700)} className="w-full max-w-[360px] gap-3.5">
          {isSignedIn ? (
            <Pressable
              disabled={!isAuthReady || isBusy}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                void completeOnboarding();
              }}
              className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
                !isAuthReady || isBusy ? 'opacity-60' : ''
              }`}
              style={({ pressed }) => [
                onboardingButtonShadow,
                pressed && pressedButtonStyle,
              ]}
            >
              <Text className="font-label text-base tracking-[0.3px] text-white">
                {isCompleting ? 'Saving...' : 'Enter Mihira →'}
              </Text>
            </Pressable>
          ) : (
            <>
              <OnboardingAuthButton
                provider="google"
                onPress={signInWithGoogle}
                isDisabled={isBusy}
                isLoading={loadingProvider === 'google'}
              />
              <OnboardingAuthButton
                provider="apple"
                onPress={signInWithApple}
                isDisabled={isBusy}
                isLoading={loadingProvider === 'apple'}
              />
              <Pressable
                disabled={isBusy}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  void completeOnboarding();
                }}
                className={isBusy ? 'opacity-60' : ''}
              >
                <Text className="text-center font-body text-sm text-ob-muted">
                  Continue without saving
                </Text>
              </Pressable>
            </>
          )}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1200).duration(700)} className="items-center">
          <Text className="text-center font-body text-sm italic leading-[22px] tracking-[0.3px] text-ob-text/40">
            "A steady practice changes the way the path appears."
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function OnboardingAuthButton({
  provider,
  onPress,
  isDisabled,
  isLoading,
}: {
  provider: Provider;
  onPress: () => void | Promise<void> | Promise<boolean>;
  isDisabled: boolean;
  isLoading: boolean;
}) {
  const isGoogle = provider === 'google';

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        void onPress();
      }}
      className={`overflow-hidden rounded-[18px] border border-ob-card-border bg-ob-card ${
        isDisabled ? 'opacity-60' : ''
      }`}
      style={({ pressed }) => pressed && pressedButtonStyle}
    >
      <View className="flex-row items-center gap-3.5 px-5 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-black">
          {isGoogle ? (
            <GoogleLogoSolidIcon size={22} color="#FFFFFF" />
          ) : (
            <AppleLogoIcon size={24} color="#FFFFFF" />
          )}
        </View>
        <Text className="flex-1 font-label text-base tracking-[0.2px] text-ob-text">
          Save with {isGoogle ? 'Google' : 'Apple'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#D9A06F" />
        ) : (
          <Text className="font-headline text-xl text-ob-gold">→</Text>
        )}
      </View>
    </Pressable>
  );
}
