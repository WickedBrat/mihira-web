import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';
import { useGuide } from '@/lib/guideStore';
import { ProfileAuthSheet } from '@/features/profile/components/ProfileAuthSheet';
import { ProfileDateTimeSheet } from '@/features/profile/components/ProfileDateTimeSheet';
import { ProfileFields } from '@/features/profile/components/ProfileFields';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileSettingsSheet } from '@/features/profile/components/ProfileSettingsSheet';
import { DEFAULT_BIRTH_DATE } from '@/features/profile/constants';
import { useProfile } from '@/features/profile/useProfile';
import { useToast } from '@/components/ui/ToastProvider';
import {
  formatBirthDateTime,
  getProfileDisplayName,
  getProfileInitials,
  mergeDateAndTime,
} from '@/features/profile/utils';
import { useSignIn } from '@/features/auth/useSignIn';
import { useSubscription } from '@/lib/subscription';
import { colors, layout } from '@/lib/theme';
import { clearCachedProfile } from '@/lib/profileStorage';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';

export default function ProfileScreen() {
  const { isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const { profile, updateField } = useProfile();
  const posthog = usePostHog();
  const signedIn = Boolean(isSignedIn);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const [selectedBirthDateTime, setSelectedBirthDateTime] = useState<Date | null>(null);
  const [isIosDatePickerOpen, setIsIosDatePickerOpen] = useState(false);
  const [iosPickerValue, setIosPickerValue] = useState(DEFAULT_BIRTH_DATE);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const authSheetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { clearGuide } = useGuide();
  const { isPro } = useSubscription();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      if (authSheetTimeoutRef.current) {
        clearTimeout(authSheetTimeoutRef.current);
      }
    };
  }, []);

  const { signInWithGoogle, signInWithApple, isLoading: isSigningIn } = useSignIn(() => {
    setIsAuthSheetOpen(false);
  });

  const closeSettingsSheet = () => {
    setIsSettingsOpen(false);
  };

  const openSettingsSheet = () => {
    Keyboard.dismiss();
    setIsSettingsOpen(true);
  };

  const openAuthSheet = () => {
    closeSettingsSheet();
    if (authSheetTimeoutRef.current) {
      clearTimeout(authSheetTimeoutRef.current);
    }

    authSheetTimeoutRef.current = setTimeout(() => {
      setIsAuthSheetOpen(true);
    }, 240);
  };

  const saveBirthDateTime = (value: Date) => {
    setSelectedBirthDateTime(value);
    updateField('birth_dt', formatBirthDateTime(value));
  };

  const openBirthDateTimePicker = () => {
    Keyboard.dismiss();
    const initialValue = selectedBirthDateTime ?? DEFAULT_BIRTH_DATE;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialValue,
        mode: 'date',
        onChange: (dateEvent, pickedDate) => {
          if (dateEvent.type !== 'set' || !pickedDate) return;
          const chosenDate = pickedDate;

          DateTimePickerAndroid.open({
            value: mergeDateAndTime(chosenDate, initialValue),
            mode: 'time',
            is24Hour: false,
            onChange: (timeEvent, pickedTime) => {
              if (timeEvent.type !== 'set' || !pickedTime) return;
              saveBirthDateTime(mergeDateAndTime(chosenDate, pickedTime));
            },
          });
        },
      });
      return;
    }

    setIosPickerValue(initialValue);
    setIsIosDatePickerOpen(true);
  };

  const displayName = getProfileDisplayName(profile.name, user?.firstName, user?.lastName);
  const initials = getProfileInitials(profile.name, user?.firstName, user?.lastName);
  const userIdLabel = signedIn ? (userId?.slice(0, 8) ?? '—') : '—';
  const identityEmail = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PageAmbientBlobs />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && styles.scrollContentKeyboardVisible,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <ProfileHeader onOpenSettings={openSettingsSheet} />
        <ProfileHero
          displayName={displayName}
          initials={initials}
          avatarUrl={user?.imageUrl ?? null}
          isSignedIn={signedIn}
          badgeLabel={isPro ? 'Aksha PRO' : 'Aksha FREE'}
        />
        {__DEV__ && (
          <View style={styles.debugActions}>
            <SacredButton
              label="Reset Ask Tab State"
              onPress={async () => {
                await clearGuide();
                posthog.capture('guide_reset');
                showToast({ type: 'success', title: 'Guide Reset', message: 'The ask tab state has been cleared.' });
              }}
              variant="secondary"
            />
            <SacredButton
              label="Trigger Onboarding Flow"
              onPress={() => router.push('/onboarding')}
              variant="secondary"
            />
          </View>
        )}
        <ProfileFields
          profile={profile}
          onChangeField={(field, value) => updateField(field, value)}
          onPressBirthDate={openBirthDateTimePicker}
        />
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
        onOpenAuth={openAuthSheet}
        onSignOut={async () => {
          try {
            posthog.capture('user_signed_out');
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

      <ProfileDateTimeSheet
        visible={isIosDatePickerOpen}
        value={iosPickerValue}
        onChangeDate={(nextDate) =>
          setIosPickerValue((current) => mergeDateAndTime(nextDate, current))
        }
        onChangeTime={(nextTime) =>
          setIosPickerValue((current) => mergeDateAndTime(current, nextTime))
        }
        onClose={() => setIsIosDatePickerOpen(false)}
        onConfirm={() => {
          saveBirthDateTime(iosPickerValue);
          setIsIosDatePickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 28,
    paddingBottom: 176,
  },
  scrollContentKeyboardVisible: {
    paddingBottom: 36,
  },
  debugActions: {
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 16,
    gap: 12,
  },
});
