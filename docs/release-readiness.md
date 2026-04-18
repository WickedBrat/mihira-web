# Aksha Release Readiness

## Current Verdict

Aksha is not release-ready yet.

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
| Notifications | Missing | Onboarding promises reminders, implementation is absent |
| Analytics | Partial | Instrumentation exists, production config still needs cleanup |
| Auth and profile | Mostly built | Includes account management and delete-account entry |
| Release config | Missing | No `eas.json`, no build pipeline, no versioning strategy |
| Store readiness | Missing | Legal, assets, metadata, privacy disclosures still needed |
| QA | Missing | No visible release QA checklist or release build verification |

## Critical Blockers

## 1. Billing Needs a Launch-Safe Mobile Strategy

This is the biggest blocker.

Current state:

- mobile plans UI exists
- `lib/subscription.ts` opens a web checkout
- `app/pricing.tsx` relies on Clerk web pricing
- mobile upgrade paths route users to browser-based checkout

Why this is risky:

- for iOS, digital subscriptions sold in the app generally need StoreKit / App Store In-App Purchase
- a browser checkout for digital app features is a serious review risk
- the current setup also creates a fragmented commerce story across mobile and web

Required decision:

- either implement native in-app subscriptions for iOS and likely Play billing for Android
- or change product packaging and distribution strategy so the app is not violating store commerce rules

Recommended action:

1. decide the final billing architecture before doing any store submission work
2. unify pricing copy, entitlement logic, and subscriber source of truth
3. test upgrade, restore, cancellation, and entitlement refresh end to end

## 2. Notifications Are Promised but Not Implemented

Current state:

- onboarding step 9 invites users to "Turn on daily reminders"
- the code explicitly notes that `expo-notifications` is not installed and simply proceeds

Why this is risky:

- users are being promised a capability the app does not deliver
- this creates trust damage even before store review concerns

Recommended action:

- either implement push and local reminders properly
- or remove all reminder language from onboarding before launch

## 3. Release Configuration Is Missing

Current state:

- no `eas.json`
- no visible CI or release automation
- no build profile strategy

Why this matters:

- Expo apps can be easy to develop but still require explicit release plumbing
- without build profiles, credentials, and release discipline, launch becomes brittle and manual

Recommended action:

- add `eas.json`
- define development, preview, and production profiles
- document build and submission commands

## 4. App Identifiers and Store Config Are Incomplete

Current state:

- `app.json` includes name, slug, scheme, icon, splash, and orientation
- it does not show an iOS bundle identifier
- it does not show an Android package name
- there is no visible build number or version code strategy

Why this matters:

- production store submission depends on stable identifiers and versioning
- this should be decided before asset generation and external setup

Recommended action:

- set `ios.bundleIdentifier`
- set `android.package`
- define build number and version code rules

## 5. Environment and Production Config Are Incomplete

Current state:

- `.env.example` only includes Clerk, Supabase, and Perplexity keys
- app code also references Stripe and PostHog configuration
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
3. Decide whether notifications are included in v1 or removed from the promise

## Phase 2: Production Infrastructure

1. Set up production Clerk, Supabase, Stripe, and PostHog
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
3. either implement notifications or remove the promise from onboarding
4. set bundle IDs and Android package name in `app.json`
5. expand `.env.example` to include Stripe and PostHog requirements
6. audit Android permissions
7. create legal URLs and store submission assets

## Working Release Assessment

Aksha is beyond prototype stage but still short of launch discipline.

The app already has enough product value to justify a beta or soft launch after the blockers above are addressed. The main work left is not inventing more features. It is making the current product shippable, review-safe, and trustworthy.
