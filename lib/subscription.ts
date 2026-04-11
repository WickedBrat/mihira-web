// lib/subscription.ts
import { useCallback, useRef } from 'react';
import { useAuth, useSession } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';

export type Plan = 'free' | 'pro';

interface UseSubscriptionReturn {
  isPro: boolean;
  plan: Plan;
  isLoaded: boolean;
  openCheckout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

function getPricingUrl(): string {
  if (__DEV__) {
    // hostUri is e.g. "192.168.1.5:8081" on a device or "localhost:8081" on simulator
    const hostUri = Constants.expoConfig?.hostUri ?? 'localhost:8081';
    return `http://${hostUri}/pricing`;
  }
  return 'https://aksha.app/pricing'; // TODO: update with production URL
}

export function useSubscription(): UseSubscriptionReturn {
  const { isLoaded: isAuthLoaded, isSignedIn, has } = useAuth();
  const { session } = useSession();
  const { showToast } = useToast();

  const isCheckingOutRef = useRef(false);

  // has() reads JWT claims — fast, no network call
  const isPro = isAuthLoaded && isSignedIn ? (has?.({ plan: 'pro' }) ?? false) : false;
  const plan: Plan = isPro ? 'pro' : 'free';

  const refreshSubscription = useCallback(async () => {
    await session?.reload();
  }, [session]);

  const openCheckout = useCallback(async () => {
    if (!isSignedIn) {
      showToast({
        type: 'info',
        title: 'Sign in required',
        message: 'Please sign in before upgrading to Pro.',
      });
      return;
    }

    if (isCheckingOutRef.current) return;
    isCheckingOutRef.current = true;

    try {
      await WebBrowser.openBrowserAsync(getPricingUrl(), {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });

      // Browser closed — reload session to pick up any new subscription in JWT
      await session?.reload();

      if (has?.({ plan: 'pro' })) {
        analytics.subscriptionUpgraded({ plan: 'pro' });
        showToast({ type: 'success', title: 'Welcome to Pro!', message: 'Your subscription is now active.' });
      }
    } catch (err) {
      console.error('[useSubscription] openCheckout error', err);
      showToast({ type: 'error', title: 'Something went wrong', message: 'Please try again.' });
    } finally {
      isCheckingOutRef.current = false;
    }
  }, [isSignedIn, session, has, showToast]);

  return {
    isPro,
    plan,
    isLoaded: isAuthLoaded,
    openCheckout,
    refreshSubscription,
  };
}
