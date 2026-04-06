// lib/subscription.ts
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClerk, useAuth } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';
import { useToast } from '@/components/ui/ToastProvider';
import { usePostHog } from 'posthog-react-native';

export type Plan = 'free' | 'pro';

interface UseSubscriptionReturn {
  isPro: boolean;
  plan: Plan;
  isLoaded: boolean;
  openCheckout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { showToast } = useToast();
  const posthog = usePostHog();

  const [plan, setPlan] = useState<Plan>('free');
  const [isLoaded, setIsLoaded] = useState(false);
  const isCheckingOutRef = useRef(false);

  const fetchSubscription = useCallback(async () => {
    if (!isSignedIn) {
      setPlan('free');
      setIsLoaded(true);
      return;
    }

    try {
      // @ts-ignore — clerk.billing is experimental
      const subscription = await clerk.billing.getSubscription({});
      const isActive =
        subscription?.status === 'active' &&
        subscription?.subscriptionItems?.some(
          (item: { plan: { slug: string } }) => item.plan.slug === 'pro'
        );
      setPlan(isActive ? 'pro' : 'free');
    } catch {
      // No active subscription — treat as free
      setPlan('free');
    } finally {
      setIsLoaded(true);
    }
  }, [isSignedIn, clerk]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

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

    const planId = process.env.EXPO_PUBLIC_CLERK_PRO_PLAN_ID;
    if (!planId) {
      console.error('[useSubscription] EXPO_PUBLIC_CLERK_PRO_PLAN_ID is not set');
      return;
    }

    try {
      // @ts-ignore — clerk.__experimental_checkout is experimental
      const checkoutInstance = clerk.__experimental_checkout({
        planId,
        planPeriod: 'month',
      });

      const { data: checkout, error: startError } = await checkoutInstance.start();

      if (startError || !checkout) {
        showToast({ type: 'error', title: 'Checkout failed', message: 'Please try again.' });
        return;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Aksha',
        paymentIntentClientSecret: checkout.externalClientSecret,
        style: 'alwaysDark',
        appearance: {
          colors: {
            primary: '#b564fc',
            background: '#131313',
            componentBackground: '#191a1a',
            componentBorder: 'transparent',
            componentDivider: '#252626',
            primaryText: '#ffffff',
            secondaryText: '#d3cec9',
            componentText: '#ffffff',
            placeholderText: '#6b6b6b',
            icon: '#b564fc',
            error: '#ee7d77',
          },
        },
      });

      if (initError) {
        showToast({ type: 'error', title: 'Payment setup failed', message: initError.message });
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== 'Canceled') {
          showToast({ type: 'error', title: 'Payment failed', message: paymentError.message });
        }
        checkoutInstance.clear();
        return;
      }

      // Payment succeeded — confirm with Clerk and activate subscription
      const { error: confirmError } = await checkoutInstance.confirm({});

      if (confirmError) {
        console.error('[useSubscription] confirm error', confirmError);
        showToast({
          type: 'error',
          title: 'Activation failed',
          message: 'Payment received but activation failed. Please contact support.',
        });
        return;
      }

      await checkoutInstance.finalize?.();

      posthog.capture('subscription_upgraded', { plan: 'pro' });

      showToast({ type: 'success', title: 'Welcome to Pro!', message: 'Your subscription is now active.' });

      await fetchSubscription();
    } catch (err) {
      console.error('[useSubscription] openCheckout error', err);
      showToast({ type: 'error', title: 'Something went wrong', message: 'Please try again.' });
    } finally {
      isCheckingOutRef.current = false;
    }
  }, [isSignedIn, clerk, initPaymentSheet, presentPaymentSheet, showToast, posthog, fetchSubscription]);

  return {
    isPro: plan === 'pro',
    plan,
    isLoaded,
    openCheckout,
    refreshSubscription: fetchSubscription,
  };
}
