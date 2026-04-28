// Screen 1: The Initial Spark
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import MihiraLogo from '@/assets/logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuth, useSession, useUser } from '@clerk/expo';
import { analytics } from '@/lib/analytics';
import { setOnboardingData } from '@/lib/onboardingStore';
import { useSignIn } from '@/features/auth/useSignIn';
import AppleLogoIcon from '@/features/auth/AppleLogo';
import GoogleLogoSolidIcon from '@/features/auth/GoogleLogo';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
  pressedLogoButtonStyle,
} from '@/features/onboarding/onboardingStyles';

type Provider = 'google' | 'apple';

export default function Screen1() {
  const breathe = useSharedValue(1);
  const glow    = useSharedValue(0.6);
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSessionLoaded } = useSession();
  const { isLoaded: isUserLoaded, user } = useUser();
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1.10, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    glow.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
    opacity: glow.value,
  }));

  const continueOnboarding = useCallback(async () => {
    if (!isUserLoaded) return;

    const signedInName = user?.fullName || user?.firstName || '';
    if (signedInName.trim()) {
      setOnboardingData({ userName: signedInName.trim() });
    }

    analytics.onboardingStarted();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/onboarding/step-2');
  }, [isUserLoaded, user]);

  const { signInWithGoogle, signInWithApple, isLoading, loadingProvider } = useSignIn();

  useEffect(() => {
    if (!isLoaded || !isSessionLoaded || !isSignedIn || !pendingProvider) return;
    void continueOnboarding();
  }, [continueOnboarding, isLoaded, isSessionLoaded, isSignedIn, pendingProvider]);

  const activeProvider = loadingProvider ?? pendingProvider;
  const isBusy = isLoading || pendingProvider !== null;
  const isAuthReady = isLoaded && isSessionLoaded && isUserLoaded;

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Animated.View style={logoStyle}>
          <MihiraLogo width={205} height={205} accessibilityLabel="Mihira logo" />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(900)}>
          <Text className="text-center font-headline text-[48px] tracking-[-2px] text-ob-gold">
            Mihira
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(900).duration(800)} className="mt-3 items-center gap-2.5">
          <Text className="text-center font-headline text-[22px] tracking-[-0.4px] text-ob-text">
            The universe is always moving.
          </Text>
          <Text className="text-center font-body text-base text-ob-muted">Find your rhythm within it.</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(2200).duration(800)} className="w-full items-center gap-3.5 p-8 pb-11">
        <View className="w-full max-w-[360px] gap-3.5">
          {isSignedIn ? (
            <Pressable
              disabled={!isAuthReady}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                void continueOnboarding();
              }}
              className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
                !isAuthReady ? 'opacity-60' : ''
              }`}
              style={({ pressed }) => [
                onboardingButtonShadow,
                pressed && pressedLogoButtonStyle,
              ]}
            >
              <Text className="text-center font-label text-base tracking-[0.3px] text-white">
                Continue
              </Text>
            </Pressable>
          ) : (
            <>
              <OnboardingAuthButton
                provider="google"
                onPress={async () => {
                  setPendingProvider('google');
                  const didSignIn = await signInWithGoogle();
                  if (!didSignIn) {
                    setPendingProvider((current) => (current === 'google' ? null : current));
                  }
                }}
                isDisabled={isBusy}
                isLoading={activeProvider === 'google'}
              />
              <OnboardingAuthButton
                provider="apple"
                onPress={async () => {
                  setPendingProvider('apple');
                  const didSignIn = await signInWithApple();
                  if (!didSignIn) {
                    setPendingProvider((current) => (current === 'apple' ? null : current));
                  }
                }}
                isDisabled={isBusy}
                isLoading={activeProvider === 'apple'}
              />
            </>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function OnboardingAuthButton({
  provider,
  onPress,
  isDisabled,
  isLoading,
}: {
  provider: Provider;
  onPress: () => void | Promise<void>;
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
          Continue with {isGoogle ? 'Google' : 'Apple'}
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
