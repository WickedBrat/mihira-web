# Clerk Billing — Design Spec
**Date:** 2026-04-06  
**Status:** Approved

---

## Overview

Add a Free + Pro subscription model to Aksha using Clerk Billing for subscription management and Supabase for usage tracking. Free users get limited access to Muhurat queries (5/month) and Ask conversations (20/month). Everything else on the home page remains free. Pro costs $19.99/month and removes all limits.

---

## Subscription Model

| Feature | Free | Pro ($19.99/mo) |
|---|---|---|
| Home page (all content) | ✅ Unlimited | ✅ Unlimited |
| Muhurat queries | 5/month | ✅ Unlimited |
| Ask conversations | 20/month | ✅ Unlimited |

---

## Data Layer

### Supabase — `user_usage` table

```sql
create table user_usage (
  user_id        text primary key,       -- Clerk user ID
  muhurat_count  integer default 0,
  ask_count      integer default 0,
  period_start   timestamptz default now(),
  period_end     timestamptz default (now() + interval '30 days'),
  updated_at     timestamptz default now()
);
```

- Period reset is client-detected: when `now() > period_end`, the app resets counts and writes a new `period_start`/`period_end` on the next `increment()` call.
- No cron job required at this stage.

### Clerk — Pro plan

- One "Pro" plan defined in the Clerk Dashboard at $19.99/month.
- Clerk writes subscription state to `user.publicMetadata` when a subscription is created or cancelled.
- The app treats a missing/unknown plan key in `publicMetadata` as free tier (safe default).

---

## Core Hooks

### `lib/subscription.ts` → `useSubscription()`

Reads the active plan from `user.publicMetadata`.

```ts
interface UseSubscriptionReturn {
  isPro: boolean;
  plan: 'free' | 'pro';
  openCheckout: () => Promise<void>;
}
```

- `openCheckout()` calls Clerk's checkout redirect, opening in `WebBrowser.openAuthSessionAsync` — same pattern as the existing OAuth flow.
- After checkout completes, Clerk has already updated `publicMetadata`; the hook re-renders automatically.
- On checkout cancelled/failed: WebBrowser closes, no state change, a toast shows "Checkout was cancelled".

### `lib/usage.ts` → `useUsage(feature)`

Fetches and manages per-user monthly usage counts from Supabase.

```ts
type Feature = 'muhurat' | 'ask';

export const LIMITS: Record<Feature, number> = { muhurat: 5, ask: 20 };

interface UseUsageReturn {
  count: number;
  limit: number;
  isNearLimit: boolean;  // count === limit - 1
  isAtLimit: boolean;    // count >= limit
  increment: () => Promise<void>;
}
```

- Fetches on mount with the Clerk `userId` as the Supabase row key.
- `isNearLimit` is true when exactly 1 free use remains — triggers the warning state.
- `isAtLimit` is true when the limit is reached — triggers the blocked paywall state.
- `increment()` upserts the new count. If `now() > period_end`, it resets the period first.
- On Supabase write failure: optimistically allows the action, logs error to PostHog, retries silently next session.

---

## UI Components

### `features/billing/PaywallSheet.tsx`

Bottom sheet (same pattern as `ProfileAuthSheet`) with two states:

**Warning state** (`isNearLimit`, non-blocking):
- Message: "1 free [feature] remaining — upgrade for unlimited access."
- Actions: "Maybe later" (dismiss + proceed) | "Upgrade to Pro"

**Blocked state** (`isAtLimit`, blocking):
- Message: "You've used all [N] free [feature]s this month."
- Shows Free vs Pro feature comparison.
- CTA: "Upgrade to Pro — $19.99/month"
- Cannot proceed without upgrading or dismissing.

### `features/billing/PlansScreen.tsx`

Full-screen plans comparison page. Accessible from:
1. The paywall sheet ("See all plans" link)
2. "Upgrade to Pro" row in `ProfileSettingsSheet`
3. A "Plans" entry in the profile header settings icon

Shows Free vs Pro feature table and the "Upgrade to Pro" CTA.

### Modified: `ProfileHero`

`badgeLabel` becomes dynamic — `ProfileScreen` passes `isPro ? 'Aksha PRO' : 'Aksha FREE'` using `useSubscription()`.

### Modified: `ProfileSettingsSheet`

Add an "Upgrade to Pro" row, hidden when the user is already Pro. Tapping opens `PlansScreen`.

### Modified: Muhurat screen

Calls `useUsage('muhurat')` before running a query:
- If `isNearLimit`: show warning `PaywallSheet`, user proceeds after dismissing.
- If `isAtLimit`: show blocked `PaywallSheet`, query does not run.
- On successful query: call `increment()`.

### Modified: Ask screen

Same pattern as Muhurat but for `useUsage('ask')`, checked before starting a new conversation.

---

## Checkout Flow

1. User taps "Upgrade to Pro" anywhere in the app.
2. `openCheckout()` opens Clerk's hosted checkout via `WebBrowser`.
3. On return, `useSubscription()` re-reads `user.publicMetadata` — Clerk has updated it.
4. The originating sheet/screen re-renders with Pro status and closes.
5. PostHog captures `subscription_upgraded` event.

**Unauthenticated users hitting a limit:**
- The paywall sheet prompts sign-in first: "Sign in to continue or upgrade to Pro."
- Reuses the existing `ProfileAuthSheet` flow.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Supabase write fails on `increment()` | Optimistically allow action, log to PostHog, silent retry next session |
| Checkout cancelled | WebBrowser closes, toast: "Checkout was cancelled" |
| Checkout fails (payment error) | Clerk handles in-browser, user returns without plan change |
| `publicMetadata` missing plan key | Treat as free tier |

---

## Out of Scope

- Server-side enforcement (Supabase RLS / Edge Functions) — client enforces for now
- Annual billing — monthly only at launch
- Cancellation UI — users manage subscriptions through Clerk's hosted portal
- Plan upgrade/downgrade flows beyond Free → Pro
