import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useAuth, useUser } from '@clerk/expo';
import { SacredButton } from '@/components/ui/SacredButton';
import { useGuide } from '@/lib/guideStore';
import { ProfileAuthSheet } from '@/features/profile/components/ProfileAuthSheet';
import { ProfileFields } from '@/features/profile/components/ProfileFields';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileSettingsSheet } from '@/features/profile/components/ProfileSettingsSheet';
import { PremiumCard } from '@/features/profile/components/PremiumCard';
import { useProfile } from '@/features/profile/useProfile';
import { useToast } from '@/components/ui/ToastProvider';
import {
  getProfileDisplayName,
  getProfileInitials,
  getZodiacSign,
} from '@/features/profile/utils';
import { useSignIn } from '@/features/auth/useSignIn';
import { useSubscription } from '@/lib/subscription';
import { PlansScreen } from '@/features/billing/PlansScreen';
import { layout } from '@/lib/theme';
import { clearCachedProfile } from '@/lib/profileStorage';
import { clearCachedDailyAlignment } from '@/lib/dailyAlignmentStorage';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { router } from 'expo-router';
import { analytics } from '@/lib/analytics';
import { posthog } from '@/lib/posthog';
import { deriveMoonProfileFromBirthDt } from '@/lib/vedic/moonProfile';
import { clearAskState } from '@/lib/askStorage';
import { clearNaradState } from '@/lib/naradStorage';

const ENABLE_DEV_BUTTONS = Constants.expoConfig?.extra?.enableDevButtons === true;

export default function ProfileScreen() {
  const { isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const { profile, updateField } = useProfile();
  const signedIn = Boolean(isSignedIn);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const authSheetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { clearGuide } = useGuide();
  const { isPro, openCheckout } = useSubscription();
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  const { signInWithGoogle, signInWithApple, isLoading: isSigningIn } = useSignIn(() => {
    setIsAuthSheetOpen(false);
  });

  const closeSettingsSheet = () => setIsSettingsOpen(false);

  const openSettingsSheet = () => setIsSettingsOpen(true);

  const openAuthSheet = () => {
    closeSettingsSheet();
    if (authSheetTimeoutRef.current) clearTimeout(authSheetTimeoutRef.current);
    authSheetTimeoutRef.current = setTimeout(() => setIsAuthSheetOpen(true), 240);
  };

  const displayName = getProfileDisplayName(profile.name, user?.firstName, user?.lastName);
  const initials = getProfileInitials(profile.name, user?.firstName, user?.lastName);
  const zodiacSign = getZodiacSign(profile.birth_dt);
  const moonProfile = deriveMoonProfileFromBirthDt(profile.birth_dt);
  const userIdLabel = signedIn ? (userId?.slice(0, 8) ?? '—') : '—';
  const identityEmail = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <PageAmbientBlobs />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingX,
          paddingTop: 16,
          paddingBottom: 176,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onOpenSettings={openSettingsSheet} />

        <ProfileHero
          displayName={displayName}
          initials={initials}
          avatarUrl={user?.imageUrl ?? null}
          isSignedIn={signedIn}
          zodiacSign={zodiacSign}
        />

        <PremiumCard
          isPro={isPro}
          onPress={() => setIsPlansOpen(true)}
        />

        <ProfileFields profile={profile} moonProfile={moonProfile} />

        {ENABLE_DEV_BUTTONS && (
          <View className="gap-3">
            <SacredButton
              label="Reset Ask Tab State"
              onPress={async () => {
                await clearGuide();
                await clearNaradState();
                await clearAskState();
                analytics.guideReset();
                showToast({ type: 'success', title: 'Guide Reset', message: 'The ask tab state has been cleared.' });
              }}
              variant="secondary"
              fullWidth
            />
            <SacredButton
              label="Trigger Onboarding Flow"
              onPress={() => router.push('/onboarding')}
              variant="secondary"
              fullWidth
            />
            <SacredButton
              label="Clear Daily Suggestion"
              onPress={async () => {
                await clearCachedDailyAlignment();
                showToast({ type: 'success', title: 'Cache Cleared', message: 'Daily suggestion will refresh on next load.' });
              }}
              variant="secondary"
              fullWidth
            />
          </View>
        )}
      </ScrollView>

      <ProfileSettingsSheet
        visible={isSettingsOpen}
        onClose={closeSettingsSheet}
        isSignedIn={signedIn}
        initials={initials}
        fullName={displayName}
        email={identityEmail}
        language={profile.language}
        region={profile.region}
        userIdLabel={userIdLabel}
        onSelectLanguage={(language) => updateField('language', language)}
        isPro={isPro}
        onOpenPlans={() => {
          closeSettingsSheet();
          setTimeout(() => setIsPlansOpen(true), 240);
        }}
        onManageAccount={() => {
          closeSettingsSheet();
          router.push('/user-profile');
        }}
        onOpenAuth={openAuthSheet}
        onSignOut={async () => {
          try {
            analytics.userSignedOut();
            posthog.reset();
            await signOut();
            await clearCachedProfile();
            closeSettingsSheet();
            showToast({
              type: 'success',
              title: 'Signed out',
              message: 'Your account session has been cleared.',
            });
          } catch (error) {
            console.error('[profile] sign out error', error);
            showToast({
              type: 'error',
              title: 'Could not sign out',
              message: 'Please try again.',
            });
          }
        }}
      />

      <ProfileAuthSheet
        visible={isAuthSheetOpen}
        onClose={() => setIsAuthSheetOpen(false)}
        onSignInWithGoogle={signInWithGoogle}
        onSignInWithApple={signInWithApple}
        isLoading={isSigningIn}
      />

      {isPlansOpen && (
        <View className="absolute inset-0">
          <PlansScreen
            isPro={isPro}
            isCheckoutLoading={false}
            onUpgrade={() => {
              setIsPlansOpen(false);
              openCheckout();
            }}
            onClose={() => setIsPlansOpen(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
