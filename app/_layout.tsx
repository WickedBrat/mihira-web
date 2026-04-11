import { useEffect, useRef } from 'react';
import { Stack, SplashScreen, usePathname, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import {

  useFonts,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { PostHogProvider } from 'posthog-react-native';
import { tokenCache } from '@/lib/clerk';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { posthog } from '@/lib/posthog';
import { analytics } from '@/lib/analytics';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_KEY) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');

// Safe conditionally load Stripe to avoid crash in Expo Go without dev clients
let StripeProvider: React.FC<any> = ({ children }) => <>{children}</>;
try {
  const StripeModule = require('@stripe/stripe-react-native');
  if (StripeModule.StripeProvider) StripeProvider = StripeModule.StripeProvider;
} catch (e: any) {
  console.warn('Fallback: StripeProvider not found or failed to load. Are you in Expo Go?');
}

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

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={CLERK_KEY!} tokenCache={tokenCache}>
      <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
          urlScheme="aksha"
        >
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                <StatusBar style="light" backgroundColor="#0e0e0e" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0e0e0e' } }}>
                  <Stack.Screen name="onboarding/index"   options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-2"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-3"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-4"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-5"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-6"  options={{ gestureEnabled: false, animation: 'fade' }} />
                  <Stack.Screen name="onboarding/step-7"  options={{ gestureEnabled: false, animation: 'fade' }} />
                  <Stack.Screen name="onboarding/step-8"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-9"  options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-10" options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-11" options={{ gestureEnabled: false }} />
                  <Stack.Screen name="onboarding/step-12" options={{ gestureEnabled: false, animation: 'fade' }} />
                  <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
                  <Stack.Screen name="sacred-day/[id]" options={{ animation: 'slide_from_right' }} />
                  <Stack.Screen name="pricing" options={{ headerShown: false, contentStyle: { backgroundColor: '#ffffff' } }} />
                  <Stack.Screen name="payment-success" options={{ headerShown: false, contentStyle: { backgroundColor: '#f9f7ff' } }} />
                  <Stack.Screen name="user-profile" options={{ headerShown: false, contentStyle: { backgroundColor: '#ffffff' } }} />
                </Stack>
              </ToastProvider>
            </PostHogProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </StripeProvider>
    </ClerkProvider>
  );
}
