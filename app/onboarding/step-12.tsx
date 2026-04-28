// Screen 12: Sign In — Account Creation
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
import { useAuth, useSession, useUser } from '@clerk/expo';
import { getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { useSignIn } from '@/features/auth/useSignIn';
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
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSessionLoaded } = useSession();
  const { isLoaded: isUserLoaded, user } = useUser();
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const signedInName = user?.fullName || user?.firstName || '';
  const name = (data.userName || signedInName)?.split(' ')[0] || 'Seeker';

  const continueOnboarding = useCallback(async () => {
    if (!isUserLoaded) return;

    if (signedInName.trim()) {
      setOnboardingData({ userName: signedInName.trim() });
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/onboarding/step-2');
  }, [isUserLoaded, signedInName]);

  const { signInWithGoogle, signInWithApple, isLoading, loadingProvider } = useSignIn(() => {
    setPendingCompletion(true);
  });

  useEffect(() => {
    if (!isLoaded || !isSessionLoaded || !isSignedIn || !pendingCompletion) return;
    setPendingCompletion(false);
    void continueOnboarding();
  }, [continueOnboarding, isLoaded, isSessionLoaded, isSignedIn, pendingCompletion]);

  const isBusy = isLoading || pendingCompletion;
  const isAuthReady = isLoaded && isSessionLoaded && isUserLoaded;

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
            Begin your path,{'\n'}
            <Text className="text-ob-gold">{name}.</Text>
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(650).duration(700)}
            className="max-w-[310px] text-center font-body text-[15px] leading-[24px] text-ob-text/60"
          >
            Sign in first so Mihira can personalize your chart and keep your practice connected across devices.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeIn.delay(900).duration(700)} className="w-full max-w-[360px] gap-3.5">
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
                pressed && pressedButtonStyle,
              ]}
            >
              <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
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
