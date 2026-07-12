import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { Stack, SplashScreen, router, usePathname, useGlobalSearchParams, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  GoogleSans_400Regular,
  GoogleSans_500Medium,
  GoogleSans_600SemiBold,
  GoogleSans_700Bold,
} from '@expo-google-fonts/google-sans';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { PostHogProvider } from 'posthog-react-native';
import { vars } from 'nativewind';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { posthog } from '@/lib/posthog';
import { analytics } from '@/lib/analytics';
import { AuthProvider, useAuth, useUser } from '@/lib/auth';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { getThemeColorVariables } from '@/lib/theme';
import { getOnboardingState, setOnboardingStep } from '@/lib/onboardingStatus';
import { getSavedAlignmentPreference } from '@/lib/onboardingNewStore';
import {
  getNotificationResponseRoute,
  scheduleDailyDayPreviewNotificationAsync,
} from '@/lib/notifications';
import { OnboardingAudioControl } from '@/features/onboarding/OnboardingAudioControl';
import '../global.css';

SplashScreen.preventAutoHideAsync();

function AnalyticsIdentity() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && userId) {
      analytics.userIdentified(userId, {
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
      });
    }
  }, [isSignedIn, userId, user]);

  return null;
}

function ScreenTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return null;
}

function GuardedNavigation() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [onboardingState, setOnboardingState] = useState<{
    completed: boolean;
    step: string | null;
    pathname: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let isActive = true;
    setOnboardingState(null);

    async function checkOnboarding() {
      const nextState = await getOnboardingState({
        userId: isSignedIn ? userId : null,
      });
      if (!isActive) return;

      setOnboardingState({ ...nextState, pathname });
    }

    void checkOnboarding();

    return () => {
      isActive = false;
    };
  }, [isLoaded, isSignedIn, pathname, userId]);

  useEffect(() => {
    if (!isLoaded || !onboardingState || onboardingState.pathname !== pathname) return;

    const isOnboardingRoute = pathname.startsWith('/onboarding');
    const onboardingUserId = isSignedIn ? userId : null;

    if (onboardingState.completed && isOnboardingRoute) {
      router.replace('/(tabs)');
      return;
    }

    if (!onboardingState.completed && isOnboardingRoute) {
      void setOnboardingStep(pathname, { userId: onboardingUserId });
      return;
    }

    if (!onboardingState.completed && !isOnboardingRoute) {
      const nextStep = onboardingState.step?.startsWith('/onboarding-new')
        ? onboardingState.step
        : '/onboarding-new';
      router.replace(nextStep as Href);
    }
  }, [isLoaded, isSignedIn, onboardingState, pathname, userId]);

  return null;
}

function NotificationBootstrapper() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const scheduledForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let isActive = true;
    const scheduleKey = isSignedIn && userId ? `user:${userId}` : 'local';

    async function bootstrapNotifications() {
      if (scheduledForRef.current === scheduleKey) return;

      const onboardingState = await getOnboardingState({
        userId: isSignedIn ? userId : null,
      });
      if (!isActive || !onboardingState.completed) return;

      const preference = isSignedIn && userId ? await getSavedAlignmentPreference(userId) : null;
      if (preference?.alignMode === 'suggested') {
        const hour = Math.floor(preference.alignMinutes / 60);
        const minute = preference.alignMinutes % 60;
        await scheduleDailyDayPreviewNotificationAsync(hour, minute);
      } else {
        await scheduleDailyDayPreviewNotificationAsync();
      }
      if (isActive) scheduledForRef.current = scheduleKey;
    }

    void bootstrapNotifications().catch((error) => {
      console.error('[notifications] bootstrap error', error);
    });

    return () => {
      isActive = false;
    };
  }, [isLoaded, isSignedIn, pathname, userId]);

  return null;
}

function NotificationResponseRouter() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const handledResponseId = useRef<string | null>(null);

  useEffect(() => {
    const route = getNotificationResponseRoute(lastNotificationResponse);
    const responseId = lastNotificationResponse?.notification.request.identifier ?? null;
    if (!route || responseId === handledResponseId.current) return;

    handledResponseId.current = responseId;
    router.replace(route as Href);
    Notifications.clearLastNotificationResponse();
  }, [lastNotificationResponse]);

  return null;
}

function ThemedStack() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <SystemBars style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="onboarding/index" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-2" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-3" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-4" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-5" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-6" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-7" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-8" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-9" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-10" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-11" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding/step-12" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding/step-13" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-14" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-15" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-16" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-17" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="daily-arth/reflect" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="sacred-day/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="pricing" options={{ headerShown: false }} />
        <Stack.Screen name="payment-success" options={{ headerShown: false }} />
        <Stack.Screen name="user-profile" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

function ThemedAppShell({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const themeVars = useMemo(() => vars(getThemeColorVariables(colors)), [colors]);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={[
          { flex: 1, backgroundColor: colors.background },
          themeVars,
        ]}
      >
        {children}
      </View>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    GoogleSans_400Regular,
    GoogleSans_500Medium,
    GoogleSans_600SemiBold,
    GoogleSans_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold_Italic,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedAppShell>
          <SafeAreaProvider>
            <PostHogProvider
              client={posthog}
              autocapture={{
                captureScreens: false,
                captureTouches: true,
                propsToCapture: ['testID'],
              }}
            >
              <ToastProvider>
                <AnalyticsIdentity />
                <ScreenTracker />
                <GuardedNavigation />
                <NotificationBootstrapper />
                {Platform.OS !== 'web' && <NotificationResponseRouter />}
                <ThemedStack />
                <OnboardingAudioControl />
              </ToastProvider>
            </PostHogProvider>
          </SafeAreaProvider>
        </ThemedAppShell>
      </AuthProvider>
    </ThemeProvider>
  );
}
