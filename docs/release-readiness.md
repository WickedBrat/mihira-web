# Mihira Release Readiness

## Current Verdict

Mihira is not release-ready yet.

The app already has a real product inside it. The core user experience exists, the main features are visible, and the monetization shape is in place. What is missing is the production layer required to ship to the App Store and Play Store without review, billing, or trust problems.

## What Is Already Built

These areas are materially in place:

- immersive onboarding flow
- daily alignment experience
- scripture-grounded guidance flow
- sacred timing flow
- sacred day discovery and detail
- profile and account management entry points
- auth with Clerk
- analytics hooks with PostHog
- Supabase-backed usage tracking
- paywall and plans UI

This is enough to justify a release push. It is not enough to submit safely yet.

## Current State by Area

| Area | Status | Notes |
|---|---|---|
| Product UX | Mostly built | Main user flows exist |
| Core feature logic | Mostly built | Daily, ask, sacred timing all present |
| Commerce UX | Partial | Paywall and plans exist, but billing architecture is not launch-safe |
| Notifications | Deferred | No longer promised in onboarding, not implemented for v1 |
| Analytics | Partial | Instrumentation exists, production config still needs cleanup |
| Auth and profile | Mostly built | Includes account management and delete-account entry |
| Release config | Partial | `eas.json` and identifiers now exist, release process still needs validation |
| Store readiness | Missing | Legal, assets, metadata, privacy disclosures still needed |
| QA | Missing | No visible release QA checklist or release build verification |

## Critical Blockers

## 1. Billing Needs a Launch-Safe Mobile Strategy

This is the biggest blocker.

Current state:

- mobile plans UI exists
- `lib/subscription.ts` is now prepared for RevenueCat/store-native billing
- `app/pricing.tsx` no longer exposes Clerk web pricing
- mobile upgrade paths are being redirected toward RevenueCat paywalls instead of browser checkout

Why this is risky:

- for iOS, digital subscriptions sold in the app generally need StoreKit / App Store In-App Purchase
- the RevenueCat wiring still depends on real store products, app-specific API keys, and installed SDK packages
- until that is configured and tested, Plus billing is still incomplete

Required decision:

- implement native in-app subscriptions for iOS and likely Play billing for Android
- launch initially under individual developer accounts unless seller-name concerns materially hurt conversion

Recommended action:

1. decide the final billing architecture before doing any store submission work
2. unify pricing copy, entitlement logic, and subscriber source of truth
3. test upgrade, restore, cancellation, and entitlement refresh end to end

## 2. Notifications Are Not in Scope for v1

Current state:

- onboarding no longer promises reminders
- notifications are still not implemented in the app

Why this matters:

- this is acceptable for v1 as long as reminder language stays out of the product
- it becomes a launch problem again only if reminder promises return before implementation

Recommended action:

- keep notifications out of the v1 promise unless they are implemented and tested properly

## 3. Release Configuration Is Partially In Place

This is no longer fully missing, but it is still incomplete.

Current state:

- `eas.json` is now present
- development, preview, and production profiles are defined
- there is still no visible CI or release automation

Why this matters:

- Expo apps can be easy to develop but still require explicit release plumbing
- without build profiles, credentials, and release discipline, launch becomes brittle and manual

Recommended action:

- add `eas.json`
- define development, preview, and production profiles
- document build and submission commands

## 4. App Identifiers Are Set, but Store Setup Is Still Incomplete

Current state:

- Expo config now includes app name, slug, scheme, icon, splash, bundle identifier, Android package, and initial build numbering
- native identifiers have been updated to the Mihira naming scheme
- store records, signing setup, and release credentials are still not prepared

Why this matters:

- production store submission depends on stable identifiers and versioning
- this should be decided before asset generation and external setup

Recommended action:

- set `ios.bundleIdentifier`
- set `android.package`
- define build number and version code rules

## 5. Environment and Production Config Are Incomplete

Current state:

- `.env.example` now includes Clerk, Supabase, RevenueCat, PostHog, and Perplexity placeholders
- the release path has moved away from Stripe and toward RevenueCat
- there is no visible production environment separation strategy

Why this matters:

- missing env documentation causes failed builds, broken analytics, and broken payments
- production and development values should not be handled informally

Recommended action:

- expand `.env.example`
- document required secrets for dev, preview, and prod
- ensure all production URLs and callbacks are finalized

## 6. Android Permissions Need Review

Current state:

The Android manifest still declares:

- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `SYSTEM_ALERT_WINDOW`

Why this matters:

- these permissions can trigger unnecessary scrutiny
- if they are not required, they should not ship

Recommended action:

- audit each permission
- remove anything not strictly needed

## 7. Legal, Policy, and Store Answers Are Still Missing

Current state:

There is no visible evidence yet of:

- privacy policy
- terms of service
- support URL
- data retention explanation
- App Store privacy answers
- Play Data Safety submission content

Why this matters:

- the app handles identity data, birth details, analytics, and payments
- store review will require clear disclosures

Recommended action:

- create the legal documents and hosted URLs
- map data collection and processors before filling platform disclosures

## 8. Account Deletion Needs End-to-End Verification

Current state:

- a delete-account flow exists in `app/user-profile.tsx`
- the Clerk account can be deleted from native and web flows

Open question:

- does account deletion also clean up user-linked data in Supabase, usage tables, profile records, and any other persisted app data

Recommended action:

- verify end-to-end deletion behavior
- if needed, add backend cleanup jobs or database policies

## 9. QA and Release Testing Are Not Yet Visible

Current state:

- there is no visible release checklist, real-device signoff, or release validation pipeline

Why this matters:

- the product touches auth, AI responses, caching, payments, date logic, and profile persistence
- these flows need release-build validation on real hardware

Recommended action:

- test on at least one real iPhone and one real Android device
- validate sign-in, onboarding, profile save, sacred timing, guidance, paywall behavior, account deletion, and app startup

## Important Non-Blocking Gaps

These gaps do not have to block a careful beta, but they should be handled intentionally:

- Gurukul is still a placeholder and should remain clearly marked as coming soon
- production crash reporting is not clearly visible
- store screenshots, metadata, and support flows are not prepared yet
- pricing needs a clearer annual-plan story for subscription conversion

## Recommended Release Scope

The cleanest v1 release scope is:

- onboarding
- daily alignment
- guidance
- sacred timing
- sacred days
- profile
- paid plan

Ship Gurukul only as a clearly labeled teaser, or hide it from launch builds if it creates expectation mismatch.

## Release Plan

## Phase 1: Product and Policy Decisions

1. Finalize app name, bundle IDs, package name, support email, and production URLs
2. Decide the final mobile billing model
3. Keep notifications out of the v1 promise unless they are implemented

## Phase 2: Production Infrastructure

1. Set up production Clerk, Supabase, RevenueCat, and PostHog
2. Expand env documentation and secret handling
3. Add `eas.json` and build profiles

## Phase 3: App Compliance

1. Remove unused Android permissions
2. Verify account deletion and privacy posture
3. Prepare privacy policy, terms, and support site
4. Draft App Store and Play data disclosures

## Phase 4: Quality and Submission

1. Build release candidates
2. Test on real devices
3. Prepare store assets and metadata
4. Launch to TestFlight and closed testing first

## Suggested Immediate Next Actions

If the team wants the fastest path to a real release, do these next:

1. Add `eas.json`
2. decide iOS billing architecture
3. leave notifications out of the v1 promise unless they are implemented
4. set bundle IDs and Android package name in `app.json`
5. expand `.env.example` to include RevenueCat and PostHog requirements
6. audit Android permissions
7. create legal URLs and store submission assets

## Working Release Assessment

Mihira is beyond prototype stage but still short of launch discipline.

The app already has enough product value to justify a beta or soft launch after the blockers above are addressed. The main work left is not inventing more features. It is making the current product shippable, review-safe, and trustworthy.
