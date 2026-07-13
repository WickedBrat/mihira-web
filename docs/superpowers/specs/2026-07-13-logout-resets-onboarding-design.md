# Logout resets onboarding — design

## Problem

Logging out (`onSignOut` in [mobile/app/(tabs)/profile.tsx](../../../mobile/app/(tabs)/profile.tsx)) clears the Supabase
session and the cached profile, but never touches onboarding state. `GuardedNavigation`
in [mobile/app/_layout.tsx](../../../mobile/app/_layout.tsx) decides whether to show onboarding by checking a
**local** AsyncStorage flag whenever the user is signed out (it only checks the
**remote**, per-account flag while signed in). If that local flag was ever left at
`true` on the device, a logged-out user lands on the main tabs instead of onboarding.
We want logout to deterministically send the user back through onboarding from the
start, regardless of that local flag's prior value.

## Approach

In `onSignOut` (`mobile/app/(tabs)/profile.tsx`), after `signOut()` succeeds, call the
same reset primitives the existing dev-only "Trigger Onboarding Flow" button already
uses ([profile.tsx:129-139](../../../mobile/app/(tabs)/profile.tsx#L129-L139)):

```ts
await signOut();
await clearCachedProfile();
await clearOnboardingCompleted({ userId: null });
resetOnboardingData();
resetOnboardingNewData();
closeSettingsSheet();
```

- `clearOnboardingCompleted({ userId: null })` (`mobile/lib/onboardingStatus.ts`) removes
  the local AsyncStorage completion + step keys only. Passing `userId: null` deliberately
  skips the remote Supabase upsert, so the account's own `onboarding_completed` flag is
  untouched.
- `resetOnboardingData()` / `resetOnboardingNewData()` clear the in-memory draft objects
  for the legacy and live onboarding flows so no stale answers leak into a fresh run.
- No explicit navigation call is added. `GuardedNavigation`'s existing effect already
  re-runs whenever `isSignedIn`/`userId` change (which happens the instant `signOut()`
  resolves), reads the now-cleared local state, and `router.replace('/onboarding-new')`
  — the single source of truth for onboarding routing stays in `_layout.tsx`.

## Behavior after the change

- **Logout → same device, no re-login:** local flag cleared → onboarding shown from
  the start (`/onboarding-new`, step key cleared so there's no mid-flow resume).
- **Logout → same account logs back in:** remote flag is untouched (still
  `completed: true`), so `GuardedNavigation` (now checking remotely, since `userId` is
  set again) sends them straight to `(tabs)` — they don't lose their birth-chart data
  or redo onboarding.
- **Logout → a different account logs in on the same device:** that account's own
  remote flag is checked; unaffected by this change.

## Out of scope

- Not fixing the pre-existing gap where the live onboarding flow's completion
  (`saveOnboardingNewCompletion` in `mobile/lib/onboardingNewStore.ts`) never writes the
  local AsyncStorage flag. This change makes logout behavior deterministic independent
  of that gap, but doesn't touch the completion-write path itself.
- Not changing `NotificationBootstrapper`; it already no-ops correctly once
  `onboardingState.completed` is false.
- Not adding a "reset remote onboarding on logout" option — user confirmed the
  same-account-skips-onboarding-on-relogin behavior is correct.

## Testing

- Manual: sign in, complete onboarding, log out from the profile settings sheet →
  confirm the app lands on `/onboarding-new` step 1.
- Manual: log back in with the same account after the above → confirm it skips
  onboarding and goes to `(tabs)`.
- Existing unit tests in `mobile/__tests__/lib/onboardingStatus.test.ts` already cover
  `setOnboardingCompleted`/`clearOnboardingCompleted` key-clearing behavior; no new
  coverage needed there since we're calling the existing function, not changing it.
