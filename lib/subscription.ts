import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';
import {
  getRevenueCatUiUnavailableMessage,
  getPaywallResult,
  getRevenueCatApiKey,
  getRevenueCatEntitlementId,
  hasActiveEntitlement,
  hasRevenueCatNativeUiModules,
  isRevenueCatResultSuccessful,
  loadRevenueCatModules,
} from '@/lib/revenuecat';

export type Plan = 'free' | 'plus';

interface UseSubscriptionReturn {
  isPlus: boolean;
  plan: Plan;
  isLoaded: boolean;
  openCheckout: () => Promise<void>;
  openCustomerCenter: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const BILLING_UNAVAILABLE_MESSAGE = 'Subscriptions are not configured yet for this build.';

export function useSubscription(): UseSubscriptionReturn {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { showToast } = useToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlus, setIsPlus] = useState(false);

  const isInitializingRef = useRef(false);
  const isOpeningPaywallRef = useRef(false);
  const configuredRef = useRef(false);
  const configuredUserIdRef = useRef<string | null>(null);

  const apiKey = useMemo(() => getRevenueCatApiKey(), []);
  const entitlementId = useMemo(() => getRevenueCatEntitlementId(), []);
  const modules = useMemo(() => loadRevenueCatModules(), []);

  const syncCustomerInfo = useCallback(async () => {
    if (!modules.purchases || !apiKey || Platform.OS === 'web') {
      setIsPlus(false);
      return;
    }

    const customerInfo = await modules.purchases.getCustomerInfo();
    setIsPlus(hasActiveEntitlement(customerInfo, entitlementId));
  }, [apiKey, entitlementId, modules.purchases]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isAuthLoaded) return;
      if (isInitializingRef.current) return;

      isInitializingRef.current = true;

      try {
        if (Platform.OS === 'web') {
          if (!cancelled) {
            setIsPlus(false);
            setIsLoaded(true);
          }
          return;
        }

        if (!apiKey || !modules.purchases) {
          if (!cancelled) {
            setIsPlus(false);
            setIsLoaded(true);
          }
          return;
        }

        const purchases = modules.purchases;

        if (__DEV__) {
          const debugLevel = purchases?.LOG_LEVEL?.DEBUG;
          if (debugLevel) {
            purchases.setLogLevel(debugLevel);
          }
        }

        if (!configuredRef.current) {
          await purchases.configure({
            apiKey,
            appUserID: isSignedIn && userId ? userId : undefined,
          });
          configuredRef.current = true;
          configuredUserIdRef.current = isSignedIn && userId ? userId : null;
        } else if (isSignedIn && userId && configuredUserIdRef.current !== userId) {
          await purchases.logIn(userId);
          configuredUserIdRef.current = userId;
        } else if (!isSignedIn && configuredUserIdRef.current) {
          await purchases.logOut();
          configuredUserIdRef.current = null;
        }

        await syncCustomerInfo();

        if (!cancelled) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('[useSubscription] init error', error);
        if (!cancelled) {
          setIsPlus(false);
          setIsLoaded(true);
        }
      } finally {
        isInitializingRef.current = false;
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [apiKey, isAuthLoaded, isSignedIn, modules.purchases, syncCustomerInfo, userId]);

  const refreshSubscription = useCallback(async () => {
    try {
      await syncCustomerInfo();
    } catch (error) {
      console.error('[useSubscription] refresh error', error);
    }
  }, [syncCustomerInfo]);

  const openCheckout = useCallback(async () => {
    if (!isSignedIn) {
      showToast({
        type: 'info',
        title: 'Sign in required',
        message: 'Please sign in before upgrading to Mihira Plus.',
      });
      return;
    }

    if (Platform.OS === 'web') {
      showToast({
        type: 'info',
        title: 'Mobile billing only',
        message: 'Subscriptions are currently handled inside the iPhone and Android apps.',
      });
      return;
    }

    if (!hasRevenueCatNativeUiModules()) {
      showToast({
        type: 'info',
        title: 'Unsupported build',
        message: getRevenueCatUiUnavailableMessage(),
      });
      return;
    }

    if (!apiKey || !modules.purchases || !modules.ui) {
      showToast({
        type: 'error',
        title: 'Billing unavailable',
        message: BILLING_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    if (isOpeningPaywallRef.current) return;
    isOpeningPaywallRef.current = true;

    try {
      const response = await modules.ui.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: entitlementId,
      });

      const result = getPaywallResult(response);
      await refreshSubscription();

      if (isRevenueCatResultSuccessful(result)) {
        analytics.subscriptionUpgraded({ plan: 'plus' });
        showToast({
          type: 'success',
          title: 'Welcome to Plus',
          message: 'Your subscription is now active.',
        });
      }
    } catch (error) {
      console.error('[useSubscription] paywall error', error);
      showToast({
        type: 'error',
        title: 'Unable to open paywall',
        message: 'Please try again.',
      });
    } finally {
      isOpeningPaywallRef.current = false;
    }
  }, [apiKey, entitlementId, isSignedIn, modules.purchases, modules.ui, refreshSubscription, showToast]);

  const openCustomerCenter = useCallback(async () => {
    if (Platform.OS === 'web') {
      showToast({
        type: 'info',
        title: 'Mobile billing only',
        message: 'Subscription management is currently handled inside the mobile apps.',
      });
      return;
    }

    if (!hasRevenueCatNativeUiModules()) {
      showToast({
        type: 'info',
        title: 'Unsupported build',
        message: getRevenueCatUiUnavailableMessage(),
      });
      return;
    }

    if (!apiKey || !modules.ui?.presentCustomerCenter) {
      showToast({
        type: 'error',
        title: 'Subscription management unavailable',
        message: BILLING_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    try {
      await modules.ui.presentCustomerCenter();
      await refreshSubscription();
    } catch (error) {
      console.error('[useSubscription] customer center error', error);
      showToast({
        type: 'error',
        title: 'Unable to open subscription settings',
        message: 'Please try again.',
      });
    }
  }, [apiKey, modules.ui, refreshSubscription, showToast]);

  return {
    isPlus,
    plan: isPlus ? 'plus' : 'free',
    isLoaded: isAuthLoaded && isLoaded,
    openCheckout,
    openCustomerCenter,
    refreshSubscription,
  };
}
