# Clerk Billing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Free + Pro ($19.99/month) subscription model with Clerk Billing for checkout, Supabase for usage tracking (5 Muhurat queries / 20 Ask conversations per month), and native enforcement via a `PaywallSheet` and `PlansScreen`.

**Architecture:** Clerk owns subscription state (read via `clerk.billing.getSubscription()`). Supabase owns a `user_usage` table with monthly counts per user. Stripe React Native presents the native payment sheet using the client secret from Clerk's checkout API. The app enforces limits client-side: warn at the last free use, block after the limit is exceeded.

**Tech Stack:** `@clerk/clerk-expo` v2 (billing API), `@stripe/stripe-react-native`, `@supabase/supabase-js`, `expo-web-browser`, `expo-router`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/usage.ts` | `useUsage(feature)` hook — Supabase read/write, period reset, `isNearLimit` / `isAtLimit` |
| Create | `lib/subscription.ts` | `useSubscription()` hook — Clerk billing status, `openCheckout()` |
| Create | `features/billing/PaywallSheet.tsx` | Warning + blocked bottom sheet |
| Create | `features/billing/PlansScreen.tsx` | Full-screen Free vs Pro comparison |
| Modify | `features/profile/components/ProfileHero.tsx` | Accept dynamic `badgeLabel` from parent (already has prop, wire isPro) |
| Modify | `features/profile/components/ProfileSettingsSheet.tsx` | Add "Upgrade to Pro" row |
| Modify | `app/(tabs)/profile.tsx` | Use `useSubscription`, pass `isPro` badge, open `PlansScreen` |
| Modify | `app/(tabs)/muhurat.tsx` | `useUsage('muhurat')` + `PaywallSheet` before query |
| Modify | `app/(tabs)/ask.tsx` | `useUsage('ask')` + `PaywallSheet` before new conversation |
| Modify | `app/_layout.tsx` | Wrap with `StripeProvider` |

---

## Task 1: Supabase — create user_usage table

**Files:**
- No app files. Run SQL in Supabase Dashboard → SQL Editor.

- [ ] **Step 1: Run this SQL in Supabase Dashboard SQL Editor**

```sql
create table if not exists user_usage (
  user_id       text primary key,
  muhurat_count integer not null default 0,
  ask_count     integer not null default 0,
  period_start  timestamptz not null default now(),
  period_end    timestamptz not null default (now() + interval '30 days'),
  updated_at    timestamptz not null default now()
);

-- Allow authenticated users to read and write only their own row
alter table user_usage enable row level security;

create policy "Users manage own usage"
  on user_usage
  for all
  using (user_id = auth.jwt() ->> 'sub')
  with check (user_id = auth.jwt() ->> 'sub');
```

- [ ] **Step 2: Verify in Supabase Dashboard → Table Editor that `user_usage` exists with the expected columns**

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-04-06-clerk-billing.md
git commit -m "feat: add user_usage Supabase table (manual migration)"
```

---

## Task 2: Install Stripe React Native and configure

**Files:**
- Modify: `app.config.js`
- Modify: `app/_layout.tsx`

> Note: `@stripe/stripe-react-native` requires a native build (EAS Build or `expo prebuild`). It will not work on Expo Go. If the app already runs with a custom dev client (required for `@shopify/react-native-skia`), this is already satisfied.

- [ ] **Step 1: Install the package**

```bash
npm install @stripe/stripe-react-native
```

- [ ] **Step 2: Add the Stripe plugin to `app.config.js`**

Open `app.config.js`. Change:
```js
plugins: [
  'expo-router',
```
to:
```js
plugins: [
  'expo-router',
  '@stripe/stripe-react-native',
```

- [ ] **Step 3: Add `StripeProvider` to `app/_layout.tsx`**

Current root layout wraps children in `<ClerkProvider>`. Add `StripeProvider` inside it. The publishable key will come from env. Add to the top of the file:
```tsx
import { StripeProvider } from '@stripe/stripe-react-native';
```

Wrap the content inside `<ClerkProvider>` but outside `<GestureHandlerRootView>`:
```tsx
<ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
  <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ... rest unchanged */}
    </GestureHandlerRootView>
  </StripeProvider>
</ClerkProvider>
```

- [ ] **Step 4: Add `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env`**

```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Get this from the Stripe Dashboard → Developers → API keys. Use the test key for development.

> **Note:** Clerk connects its billing gateway to Stripe. When you enable Clerk Billing, Clerk creates a connected Stripe account. The `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` should match the Stripe key configured in your Clerk Dashboard under Billing settings.

- [ ] **Step 5: Rebuild the native app**

```bash
# If using EAS:
eas build --profile development --platform ios

# If using local prebuild:
npx expo prebuild --clean
cd ios && pod install && cd ..
npx expo run:ios
```

- [ ] **Step 6: Commit**

```bash
git add app.config.js app/_layout.tsx .env
git commit -m "feat: install stripe-react-native, add StripeProvider"
```

---

## Task 3: Create lib/usage.ts

**Files:**
- Create: `lib/usage.ts`

- [ ] **Step 1: Create the file with the full implementation**

```ts
// lib/usage.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/clerk-expo';
import { getSupabaseClient } from '@/lib/supabase';

export type Feature = 'muhurat' | 'ask';

export const LIMITS: Record<Feature, number> = {
  muhurat: 5,
  ask: 20,
};

interface UsageRow {
  user_id: string;
  muhurat_count: number;
  ask_count: number;
  period_start: string;
  period_end: string;
}

interface UseUsageReturn {
  count: number;
  limit: number;
  isNearLimit: boolean;
  isAtLimit: boolean;
  isLoaded: boolean;
  increment: () => Promise<void>;
}

function isExpired(periodEnd: string): boolean {
  return new Date() > new Date(periodEnd);
}

function newPeriod() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return { period_start: now.toISOString(), period_end: end.toISOString() };
}

export function useUsage(feature: Feature): UseUsageReturn {
  const { isSignedIn, userId } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const limit = LIMITS[feature];

  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getClient = useCallback(async () => {
    if (!isSignedIn || !userId || !isSessionLoaded) return null;
    try {
      let token = await session?.getToken();
      if (!token) token = await session?.getToken({ template: 'supabase' });
      if (!token) return null;
      return getSupabaseClient(async () => token);
    } catch {
      return null;
    }
  }, [isSignedIn, userId, isSessionLoaded, session]);

  useEffect(() => {
    if (!isSignedIn || !userId) {
      setCount(0);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    async function load() {
      const client = await getClient();
      if (!client || cancelled) return;

      const { data } = await client
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single<UsageRow>();

      if (cancelled) return;

      if (!data || isExpired(data.period_end)) {
        // No row yet or stale period — start fresh, but don't write until first use
        setCount(0);
      } else {
        setCount(data[`${feature}_count` as keyof UsageRow] as number);
      }

      setIsLoaded(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, userId, feature, getClient]);

  const increment = useCallback(async () => {
    if (!isSignedIn || !userId) return;

    const client = await getClient();
    if (!client) return;

    const { data: existing } = await client
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single<UsageRow>();

    const expired = !existing || isExpired(existing.period_end);
    const baseCount = expired ? 0 : (existing[`${feature}_count` as keyof UsageRow] as number);
    const newCount = baseCount + 1;

    const period = expired ? newPeriod() : {
      period_start: existing.period_start,
      period_end: existing.period_end,
    };

    const upsertRow = {
      user_id: userId,
      muhurat_count: existing?.muhurat_count ?? 0,
      ask_count: existing?.ask_count ?? 0,
      ...period,
      [`${feature}_count`]: newCount,
      updated_at: new Date().toISOString(),
    };

    setCount(newCount); // optimistic

    const { error } = await client
      .from('user_usage')
      .upsert(upsertRow, { onConflict: 'user_id' });

    if (error) {
      console.error('[useUsage] increment error', error);
      // Keep optimistic count — don't block the user on a write failure
    }
  }, [isSignedIn, userId, feature, getClient]);

  return {
    count,
    limit,
    isNearLimit: count === limit - 1,
    isAtLimit: count >= limit,
    isLoaded,
    increment,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "lib/usage"
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add lib/usage.ts
git commit -m "feat: add useUsage hook with Supabase-backed monthly counts"
```

---

## Task 4: Create lib/subscription.ts

**Files:**
- Create: `lib/subscription.ts`

> **Before writing this task:** Find your Pro plan's ID in Clerk Dashboard → Billing → Plans. Copy the Plan ID (looks like `plan_xxxx`). Add it to `.env`:
> ```
> EXPO_PUBLIC_CLERK_PRO_PLAN_ID=plan_xxxx
> ```

- [ ] **Step 1: Create the file**

```ts
// lib/subscription.ts
import { useState, useEffect, useCallback } from 'react';
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

  const fetchSubscription = useCallback(async () => {
    if (!isSignedIn) {
      setPlan('free');
      setIsLoaded(true);
      return;
    }

    try {
      // @ts-expect-error — clerk.billing is experimental
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

    const planId = process.env.EXPO_PUBLIC_CLERK_PRO_PLAN_ID;
    if (!planId) {
      console.error('[useSubscription] EXPO_PUBLIC_CLERK_PRO_PLAN_ID is not set');
      return;
    }

    try {
      // @ts-expect-error — clerk.__experimental_checkout is experimental
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
      }

      await checkoutInstance.finalize?.();

      posthog.capture('subscription_upgraded', { plan: 'pro' });

      showToast({ type: 'success', title: 'Welcome to Pro!', message: 'Your subscription is now active.' });

      await fetchSubscription();
    } catch (err) {
      console.error('[useSubscription] openCheckout error', err);
      showToast({ type: 'error', title: 'Something went wrong', message: 'Please try again.' });
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
```

- [ ] **Step 2: Add `EXPO_PUBLIC_CLERK_PRO_PLAN_ID` to `.env` if not yet added**

```
EXPO_PUBLIC_CLERK_PRO_PLAN_ID=plan_xxxx
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "lib/subscription"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add lib/subscription.ts .env
git commit -m "feat: add useSubscription hook with Clerk billing + Stripe checkout"
```

---

## Task 5: Create features/billing/PaywallSheet.tsx

**Files:**
- Create: `features/billing/PaywallSheet.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p features/billing
```

```tsx
// features/billing/PaywallSheet.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Feature } from '@/lib/usage';
import { LIMITS } from '@/lib/usage';

interface PaywallSheetProps {
  visible: boolean;
  feature: Feature;
  /** Warning = 1 remaining (non-blocking). Blocked = limit reached (blocking). */
  mode: 'warning' | 'blocked';
  onClose: () => void;
  onUpgrade: () => void;
  /** Called only in warning mode — user dismisses and proceeds */
  onProceed?: () => void;
}

const FEATURE_LABEL: Record<Feature, string> = {
  muhurat: 'Muhurat query',
  ask: 'Ask conversation',
};

const FEATURE_LABEL_PLURAL: Record<Feature, string> = {
  muhurat: 'Muhurat queries',
  ask: 'Ask conversations',
};

export function PaywallSheet({
  visible,
  feature,
  mode,
  onClose,
  onUpgrade,
  onProceed,
}: PaywallSheetProps) {
  const limit = LIMITS[feature];
  const label = FEATURE_LABEL[feature];
  const labelPlural = FEATURE_LABEL_PLURAL[feature];

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Zap size={22} color={colors.secondaryFixed} />
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      {mode === 'warning' ? (
        <>
          <Text style={styles.title}>1 free {label} remaining</Text>
          <Text style={styles.body}>
            You have 1 free {label} left this month. Upgrade to Pro for unlimited access to all features.
          </Text>

          <View style={styles.planRow}>
            <PlanFeatureRow label={`${limit} ${labelPlural}/month`} isFree />
            <PlanFeatureRow label={`Unlimited ${labelPlural}`} isFree={false} />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={styles.cta} />
          <Pressable style={styles.laterButton} onPress={onProceed ?? onClose}>
            <Text style={styles.laterText}>Use my last free {label}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>You've used all {limit} free {labelPlural}</Text>
          <Text style={styles.body}>
            Upgrade to Aksha Pro for unlimited {labelPlural} and everything else Aksha has to offer.
          </Text>

          <View style={styles.featureList}>
            <FeatureItem text={`Unlimited ${labelPlural}`} />
            <FeatureItem text="All home page content" />
            <FeatureItem text="Priority access to new features" />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={styles.cta} />
          <Pressable style={styles.laterButton} onPress={onClose}>
            <Text style={styles.laterText}>Maybe later</Text>
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

function PlanFeatureRow({ label, isFree }: { label: string; isFree: boolean }) {
  return (
    <View style={styles.planFeatureRow}>
      <View style={[styles.planBadge, isFree ? styles.planBadgeFree : styles.planBadgePro]}>
        <Text style={[styles.planBadgeText, isFree ? styles.planBadgeTextFree : styles.planBadgeTextPro]}>
          {isFree ? 'FREE' : 'PRO'}
        </Text>
      </View>
      <Text style={styles.planFeatureText}>{label}</Text>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <Text style={styles.featureItemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.secondaryFixed}18`,
    borderWidth: 1,
    borderColor: `${colors.secondaryFixed}22`,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(22),
    color: colors.onSurface,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(21),
    marginBottom: 20,
  },
  planRow: {
    gap: 10,
    marginBottom: 20,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planBadgeFree: {
    backgroundColor: `${colors.onSurfaceVariant}18`,
  },
  planBadgePro: {
    backgroundColor: `${colors.primary}22`,
  },
  planBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    letterSpacing: 1.2,
  },
  planBadgeTextFree: {
    color: colors.onSurfaceVariant,
  },
  planBadgeTextPro: {
    color: colors.primaryFixed,
  },
  planFeatureText: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(14),
    color: colors.onSurface,
    flex: 1,
  },
  featureList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featureItemText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
  },
  cta: {
    marginBottom: 12,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  laterText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: colors.onSurfaceVariant,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "features/billing/PaywallSheet"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add features/billing/PaywallSheet.tsx
git commit -m "feat: add PaywallSheet component (warning + blocked states)"
```

---

## Task 6: Create features/billing/PlansScreen.tsx

**Files:**
- Create: `features/billing/PlansScreen.tsx`

- [ ] **Step 1: Create the file**

```tsx
// features/billing/PlansScreen.tsx
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, Zap } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

interface PlansScreenProps {
  isPro: boolean;
  isCheckoutLoading?: boolean;
  onUpgrade: () => void;
  onClose: () => void;
}

interface FeatureRowProps {
  label: string;
  freeValue: string | boolean;
  proValue: string | boolean;
}

function FeatureRow({ label, freeValue, proValue }: FeatureRowProps) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <View style={styles.featureValues}>
        <View style={styles.featureCell}>
          {typeof freeValue === 'boolean' ? (
            freeValue
              ? <Check size={16} color={colors.onSurfaceVariant} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text style={styles.featureCellText}>{freeValue}</Text>
          )}
        </View>
        <View style={[styles.featureCell, styles.featureCellPro]}>
          {typeof proValue === 'boolean' ? (
            proValue
              ? <Check size={16} color={colors.primary} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text style={[styles.featureCellText, styles.featureCellTextPro]}>{proValue}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PlansScreen({ isPro, onUpgrade, onClose }: PlansScreenProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageAmbientBlobs />

      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Plans</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan cards */}
        <View style={styles.planCards}>
          {/* Free card */}
          <View style={[styles.planCard, styles.planCardFree]}>
            <Text style={styles.planName}>Free</Text>
            <Text style={styles.planPrice}>$0</Text>
            <Text style={styles.planPriceSub}>forever</Text>
            {!isPro && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current plan</Text>
              </View>
            )}
          </View>

          {/* Pro card */}
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.primaryFixedDim}18`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.planCard, styles.planCardPro]}
          >
            <View style={styles.planProHeader}>
              <Zap size={14} color={colors.secondaryFixed} />
              <Text style={styles.planProLabel}>Pro</Text>
            </View>
            <Text style={[styles.planPrice, styles.planPricePro]}>$19.99</Text>
            <Text style={styles.planPriceSub}>per month</Text>
            {isPro && (
              <View style={[styles.currentBadge, styles.currentBadgePro]}>
                <Text style={[styles.currentBadgeText, styles.currentBadgeTextPro]}>Active</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Feature comparison */}
        <View style={styles.featureTable}>
          <View style={styles.featureTableHeader}>
            <Text style={styles.featureTableHeaderLabel}>Features</Text>
            <View style={styles.featureValues}>
              <Text style={styles.featureColumnLabel}>Free</Text>
              <Text style={[styles.featureColumnLabel, styles.featureColumnLabelPro]}>Pro</Text>
            </View>
          </View>

          <FeatureRow label="Home page" freeValue={true} proValue={true} />
          <FeatureRow label="Muhurat queries" freeValue="5/mo" proValue="Unlimited" />
          <FeatureRow label="Ask conversations" freeValue="20/mo" proValue="Unlimited" />
          <FeatureRow label="Priority features" freeValue={false} proValue={true} />
        </View>

        {!isPro && (
          <SacredButton
            label="Upgrade to Pro — $19.99/mo"
            onPress={onUpgrade}
            style={styles.upgradeCta}
          />
        )}

        {isPro && (
          <View style={styles.activeMessage}>
            <Check size={18} color={colors.primary} />
            <Text style={styles.activeMessageText}>You're on Aksha Pro. Manage your subscription from your Clerk account.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 14,
  },
  navTitle: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(20),
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 24,
  },
  planCards: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  planCardFree: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  planCardPro: {
    borderColor: `${colors.primary}30`,
  },
  planProHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  planProLabel: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(15),
    color: colors.secondaryFixed,
    letterSpacing: 0.5,
  },
  planName: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(15),
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(28),
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  planPricePro: {
    color: colors.primaryFixed,
  },
  planPriceSub: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: colors.onSurfaceVariant,
  },
  currentBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: `${colors.onSurfaceVariant}18`,
  },
  currentBadgePro: {
    backgroundColor: `${colors.primary}22`,
  },
  currentBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  currentBadgeTextPro: {
    color: colors.primaryFixed,
  },
  featureTable: {
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  featureTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  featureTableHeaderLabel: {
    flex: 1,
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
  },
  featureColumnLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.onSurfaceVariant,
    width: 72,
    textAlign: 'center',
  },
  featureColumnLabelPro: {
    color: colors.primaryFixed,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  featureLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurface,
  },
  featureValues: {
    flexDirection: 'row',
    gap: 0,
  },
  featureCell: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCellPro: {
    // slight purple tint for pro column
  },
  featureCellText: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  featureCellTextPro: {
    color: colors.primaryFixed,
  },
  upgradeCta: {
    marginTop: 4,
  },
  activeMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  activeMessageText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(20),
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "features/billing/PlansScreen"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add features/billing/PlansScreen.tsx
git commit -m "feat: add PlansScreen with Free vs Pro feature comparison"
```

---

## Task 7: Update ProfileHero — dynamic plan badge

**Files:**
- Modify: `app/(tabs)/profile.tsx` (pass dynamic badge)
- `features/profile/components/ProfileHero.tsx` already accepts `badgeLabel` prop — no change needed there.

- [ ] **Step 1: Open `app/(tabs)/profile.tsx`**

Find this import block at the top and add:
```tsx
import { useSubscription } from '@/lib/subscription';
```

- [ ] **Step 2: Inside `ProfileScreen`, after `const { clearGuide } = useGuide();`, add:**

```tsx
const { isPro, openCheckout } = useSubscription();
```

- [ ] **Step 3: Find the `<ProfileHero>` usage (around line 151) and update `badgeLabel`:**

Change:
```tsx
<ProfileHero
  displayName={displayName}
  initials={initials}
  avatarUrl={user?.imageUrl ?? null}
  isSignedIn={signedIn}
/>
```
To:
```tsx
<ProfileHero
  displayName={displayName}
  initials={initials}
  avatarUrl={user?.imageUrl ?? null}
  isSignedIn={signedIn}
  badgeLabel={isPro ? 'Aksha PRO' : 'Aksha FREE'}
/>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "profile.tsx"
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat: dynamic plan badge in ProfileHero (FREE/PRO)"
```

---

## Task 8: Add PlansScreen navigation and "Upgrade to Pro" row to Settings

**Files:**
- Modify: `features/profile/components/ProfileSettingsSheet.tsx`
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Update `ProfileSettingsSheet` props interface**

Open `features/profile/components/ProfileSettingsSheet.tsx`.

Add `onOpenPlans` and `isPro` to the interface (after `onSignOut`):
```tsx
interface ProfileSettingsSheetProps {
  // ... existing props ...
  onSignOut: () => void | Promise<void>;
  isPro: boolean;
  onOpenPlans: () => void;
}
```

- [ ] **Step 2: Destructure the new props in the component**

Change:
```tsx
export function ProfileSettingsSheet({
  visible,
  onClose,
  isSignedIn,
  initials,
  fullName,
  email,
  language,
  region,
  userIdLabel,
  onSelectLanguage,
  onOpenAuth,
  onSignOut,
}: ProfileSettingsSheetProps) {
```
To:
```tsx
export function ProfileSettingsSheet({
  visible,
  onClose,
  isSignedIn,
  initials,
  fullName,
  email,
  language,
  region,
  userIdLabel,
  onSelectLanguage,
  onOpenAuth,
  onSignOut,
  isPro,
  onOpenPlans,
}: ProfileSettingsSheetProps) {
```

- [ ] **Step 3: Add the "Upgrade to Pro" row in the JSX**

Find the `<Pressable style={styles.signOutRow}...>` row in the `isSignedIn` block. Add BEFORE `signOutRow`:
```tsx
{!isPro && (
  <Pressable style={styles.upgradeRow} onPress={onOpenPlans}>
    <Zap size={16} color={colors.secondaryFixed} />
    <Text style={styles.upgradeText}>Upgrade to Pro</Text>
  </Pressable>
)}
```

Also add the import at the top:
```tsx
import { Check, ChevronDown, LogOut, X, Zap } from 'lucide-react-native';
```

- [ ] **Step 4: Add styles for the upgrade row**

In the `StyleSheet.create({...})` block, add:
```tsx
upgradeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderRadius: 16,
  backgroundColor: `${colors.secondaryFixed}10`,
  borderWidth: 1,
  borderColor: `${colors.secondaryFixed}1a`,
  marginBottom: 12,
},
upgradeText: {
  fontFamily: fonts.bodyMedium,
  fontSize: 15,
  color: colors.secondaryFixed,
},
```

- [ ] **Step 5: Wire `PlansScreen` into `app/(tabs)/profile.tsx`**

Add imports to `app/(tabs)/profile.tsx`:
```tsx
import { PlansScreen } from '@/features/billing/PlansScreen';
```

Add state inside `ProfileScreen`:
```tsx
const [isPlansOpen, setIsPlansOpen] = useState(false);
```

Add a `PlansScreen` modal below `ProfileAuthSheet` in the JSX return:
```tsx
{isPlansOpen && (
  <View style={StyleSheet.absoluteFill}>
    <PlansScreen
      isPro={isPro}
      onUpgrade={() => {
        setIsPlansOpen(false);
        openCheckout();
      }}
      onClose={() => setIsPlansOpen(false)}
    />
  </View>
)}
```

- [ ] **Step 6: Pass new props to `ProfileSettingsSheet`**

Find `<ProfileSettingsSheet` in `profile.tsx` and add:
```tsx
isPro={isPro}
onOpenPlans={() => {
  closeSettingsSheet();
  setTimeout(() => setIsPlansOpen(true), 240);
}}
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -E "ProfileSettingsSheet|profile\.tsx"
```

Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add features/profile/components/ProfileSettingsSheet.tsx app/(tabs)/profile.tsx
git commit -m "feat: add upgrade row in settings, PlansScreen navigation"
```

---

## Task 9: Enforce usage limits in Muhurat screen

**Files:**
- Modify: `app/(tabs)/muhurat.tsx`

- [ ] **Step 1: Add imports at the top of `app/(tabs)/muhurat.tsx`**

```tsx
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
```

- [ ] **Step 2: Add state and hooks inside `MuhuratScreen`, after existing hooks**

```tsx
const { isPro, openCheckout } = useSubscription();
const { isAtLimit, isNearLimit, increment } = useUsage('muhurat');
const [paywallMode, setPaywallMode] = useState<'warning' | 'blocked' | null>(null);
const pendingQueryRef = React.useRef<(() => void) | null>(null);
```

- [ ] **Step 3: Replace `handleFindMuhurat` with usage-aware version**

Replace the existing function:
```tsx
const handleFindMuhurat = () => {
  const trimmedEvent = eventDescription.trim();

  if (!trimmedEvent) {
    showToast({
      type: 'error',
      title: 'Describe your event',
      message: 'Add the situation or issue you want guidance for.',
    });
    return;
  }

  setRequest({
    eventDescription: trimmedEvent,
    startDate: toApiDate(startDate),
    endDate: toApiDate(endDate),
  });
};
```

With:
```tsx
const runQuery = () => {
  const trimmedEvent = eventDescription.trim();
  if (!trimmedEvent) return;
  increment();
  setRequest({
    eventDescription: trimmedEvent,
    startDate: toApiDate(startDate),
    endDate: toApiDate(endDate),
  });
};

const handleFindMuhurat = () => {
  const trimmedEvent = eventDescription.trim();

  if (!trimmedEvent) {
    showToast({
      type: 'error',
      title: 'Describe your event',
      message: 'Add the situation or issue you want guidance for.',
    });
    return;
  }

  if (isPro) {
    runQuery();
    return;
  }

  if (isAtLimit) {
    setPaywallMode('blocked');
    return;
  }

  if (isNearLimit) {
    pendingQueryRef.current = runQuery;
    setPaywallMode('warning');
    return;
  }

  runQuery();
};
```

- [ ] **Step 4: Add `PaywallSheet` to the JSX return, just before the closing `</View>`**

```tsx
<PaywallSheet
  visible={paywallMode !== null}
  feature="muhurat"
  mode={paywallMode ?? 'warning'}
  onClose={() => {
    setPaywallMode(null);
    pendingQueryRef.current = null;
  }}
  onUpgrade={() => {
    setPaywallMode(null);
    openCheckout();
  }}
  onProceed={() => {
    setPaywallMode(null);
    pendingQueryRef.current?.();
    pendingQueryRef.current = null;
  }}
/>
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "muhurat.tsx"
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add app/(tabs)/muhurat.tsx
git commit -m "feat: enforce Muhurat usage limits with PaywallSheet"
```

---

## Task 10: Enforce usage limits in Ask screen

**Files:**
- Modify: `app/(tabs)/ask.tsx`

The Ask screen tracks conversations (not individual messages). A "conversation" begins when the user sends the first message in a fresh guide session. We enforce the limit at `commitToGuide` time.

- [ ] **Step 1: Add imports at the top of `app/(tabs)/ask.tsx`**

```tsx
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
```

- [ ] **Step 2: Add hooks inside `AskScreen`, after `const { guide, isLoading, commitToGuide } = useGuide();`**

```tsx
const { isPro, openCheckout } = useSubscription();
const { isAtLimit, isNearLimit, increment } = useUsage('ask');
const [paywallMode, setPaywallMode] = useState<'warning' | 'blocked' | null>(null);
const pendingGuideRef = React.useRef<string | null>(null);
```

- [ ] **Step 3: Replace `handleCommit` with usage-aware version**

Replace:
```tsx
const handleCommit = async (guideName: string) => {
  setPendingGuide(guideName);
  await commitToGuide(guideName);
  setPhase('loading');
};
```

With:
```tsx
const doCommit = async (guideName: string) => {
  increment();
  setPendingGuide(guideName);
  await commitToGuide(guideName);
  setPhase('loading');
};

const handleCommit = (guideName: string) => {
  if (isPro) {
    doCommit(guideName);
    return;
  }

  if (isAtLimit) {
    setPaywallMode('blocked');
    return;
  }

  if (isNearLimit) {
    pendingGuideRef.current = guideName;
    setPaywallMode('warning');
    return;
  }

  doCommit(guideName);
};
```

- [ ] **Step 4: Add `PaywallSheet` to the JSX**

In the `phase === 'selector'` return block, wrap the existing `<GuideSelector>` with a `<>` fragment and add the sheet:

```tsx
if (phase === 'selector') {
  return (
    <>
      <GuideSelector onCommit={handleCommit} />
      <PaywallSheet
        visible={paywallMode !== null}
        feature="ask"
        mode={paywallMode ?? 'warning'}
        onClose={() => {
          setPaywallMode(null);
          pendingGuideRef.current = null;
        }}
        onUpgrade={() => {
          setPaywallMode(null);
          openCheckout();
        }}
        onProceed={() => {
          const name = pendingGuideRef.current;
          setPaywallMode(null);
          pendingGuideRef.current = null;
          if (name) doCommit(name);
        }}
      />
    </>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "ask.tsx"
```

Expected: no output.

- [ ] **Step 6: Final full type check**

```bash
npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors unrelated to billing).

- [ ] **Step 7: Commit**

```bash
git add app/(tabs)/ask.tsx
git commit -m "feat: enforce Ask conversation usage limits with PaywallSheet"
```

---

## Post-Implementation Checklist

After all tasks are complete, verify the following manually on device:

- [ ] Muhurat: 5th query shows warning sheet, 6th shows blocked sheet
- [ ] Ask: 20th guide commit shows warning sheet, 21st shows blocked sheet  
- [ ] Warning sheet "Use my last free [feature]" proceeds and runs the action
- [ ] Blocked sheet "Upgrade to Pro" opens Stripe payment sheet
- [ ] After successful payment, badge in ProfileHero changes to "Aksha PRO"
- [ ] ProfileSettingsSheet shows "Upgrade to Pro" row for free users only
- [ ] PlansScreen opens from settings and from paywall "See Plans" link
- [ ] Pro users bypass all limits with no paywall shown
- [ ] Usage resets after 30-day period (`period_end` passes)
