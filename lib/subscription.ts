import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { useAuth, useSession } from '@clerk/expo';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';
import { getSupabaseClient } from '@/lib/supabase';
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
type SubscriptionSource = 'revenuecat' | 'supabase' | 'none';
type MirroredSubscriptionRecord = {
  subscription_plan?: string | null;
  subscription_status?: string | null;
} | null;

interface UseSubscriptionReturn {
  isPlus: boolean;
  plan: Plan;
  isLoaded: boolean;
  source: SubscriptionSource;
  openCheckout: () => Promise<void>;
  openCustomerCenter: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const BILLING_UNAVAILABLE_MESSAGE = 'Subscriptions are not configured yet for this build.';

export function getSubscriptionProfilePatch(
  userId: string,
  plan: Plan,
  source: Exclude<SubscriptionSource, 'none'> = 'revenuecat',
  now = new Date().toISOString()
) {
  return {
    id: userId,
    subscription_plan: plan,
    subscription_status: plan === 'plus' ? 'active' : 'inactive',
    subscription_source: source,
    subscription_updated_at: now,
    updated_at: now,
  };
}

export function isMirroredPlus(record: MirroredSubscriptionRecord): boolean {
  return record?.subscription_plan === 'plus' && record?.subscription_status === 'active';
}

export function useSubscription(): UseSubscriptionReturn {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const { showToast } = useToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlus, setIsPlus] = useState(false);
  const [source, setSource] = useState<SubscriptionSource>('none');

  const isInitializingRef = useRef(false);
  const isOpeningPaywallRef = useRef(false);
  const configuredRef = useRef(false);
  const configuredUserIdRef = useRef<string | null>(null);
  const lastMirroredPlanKeyRef = useRef<string | null>(null);

  const apiKey = useMemo(() => getRevenueCatApiKey(), []);
  const entitlementId = useMemo(() => getRevenueCatEntitlementId(), []);
  const modules = useMemo(() => loadRevenueCatModules(), []);
  const hasResolvedPlanState = !isSignedIn || isSessionLoaded || source === 'revenuecat';

  const getClient = useCallback(async () => {
    if (!isSignedIn || !userId || !isSessionLoaded) return null;

    try {
      const token = await session?.getToken();
      if (!token) return null;
      return getSupabaseClient(async () => token);
    } catch (error) {
      console.error('[useSubscription] supabase client error', error);
      return null;
    }
  }, [isSessionLoaded, isSignedIn, session, userId]);

  const mirrorPlanToSupabase = useCallback(async (nextIsPlus: boolean) => {
    if (!isSignedIn || !userId) return;

    const planKey = `${userId}:${nextIsPlus ? 'plus' : 'free'}`;
    if (lastMirroredPlanKeyRef.current === planKey) return;

    const client = await getClient();
    if (!client) return;

    const now = new Date().toISOString();
    const { error } = await client
      .from('profiles')
      .upsert(getSubscriptionProfilePatch(userId, nextIsPlus ? 'plus' : 'free', 'revenuecat', now), { onConflict: 'id' });

    if (error) {
      console.error('[useSubscription] mirror error', error);
      return;
    }

    lastMirroredPlanKeyRef.current = planKey;
  }, [getClient, isSignedIn, userId]);

  const loadMirroredPlan = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setIsPlus(false);
      setSource('none');
      return false;
    }

    const client = await getClient();
    if (!client) return false;

    const { data, error } = await client
      .from('profiles')
      .select('subscription_plan, subscription_status')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[useSubscription] mirrored load error', error);
      return false;
    }

    const nextIsPlus = isMirroredPlus(data as MirroredSubscriptionRecord);
    setIsPlus(nextIsPlus);
    setSource('supabase');
    lastMirroredPlanKeyRef.current = `${userId}:${nextIsPlus ? 'plus' : 'free'}`;
    return true;
  }, [getClient, isSignedIn, userId]);

  const applyRevenueCatCustomerInfo = useCallback(async (customerInfo: unknown) => {
    const nextIsPlus = hasActiveEntitlement(customerInfo, entitlementId);
    setIsPlus(nextIsPlus);
    setSource('revenuecat');
    await mirrorPlanToSupabase(nextIsPlus);
  }, [entitlementId, mirrorPlanToSupabase]);

  const syncCustomerInfo = useCallback(async () => {
    if (!modules.purchases || !apiKey || Platform.OS === 'web') {
      const loadedFromMirror = await loadMirroredPlan();
      if (!loadedFromMirror) {
        setIsPlus(false);
        setSource('none');
      }
      return;
    }

    const customerInfo = await modules.purchases.getCustomerInfo();
    await applyRevenueCatCustomerInfo(customerInfo);
  }, [apiKey, applyRevenueCatCustomerInfo, loadMirroredPlan, modules.purchases]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isAuthLoaded) return;
      if (isInitializingRef.current) return;

      isInitializingRef.current = true;

      try {
        if (Platform.OS === 'web') {
          await syncCustomerInfo();
          if (!cancelled) setIsLoaded(true);
          return;
        }

        if (!apiKey || !modules.purchases) {
          await syncCustomerInfo();
          if (!cancelled) setIsLoaded(true);
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
          const loadedFromMirror = await loadMirroredPlan();
          if (!loadedFromMirror) {
            setIsPlus(false);
            setSource('none');
          }
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

  useEffect(() => {
    if (Platform.OS === 'web' || !apiKey || !modules.purchases) return;

    let disposed = false;
    const purchases = modules.purchases;

    const handleCustomerInfoUpdate = (customerInfo: unknown) => {
      if (disposed) return;
      void applyRevenueCatCustomerInfo(customerInfo);
    };

    if (typeof purchases.addCustomerInfoUpdateListener === 'function') {
      purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    }

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void refreshSubscription();
      }
    });

    return () => {
      disposed = true;
      appStateSubscription.remove();

      if (typeof purchases.removeCustomerInfoUpdateListener === 'function') {
        purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
      }
    };
  }, [apiKey, applyRevenueCatCustomerInfo, modules.purchases, refreshSubscription]);

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
        setIsPlus(true);
        setSource('revenuecat');
        await mirrorPlanToSupabase(true);
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
    isLoaded: isAuthLoaded && isLoaded && hasResolvedPlanState,
    source,
    openCheckout,
    openCustomerCenter,
    refreshSubscription,
  };
}
