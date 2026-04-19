# Mihira Release Readiness

## Current Verdict

Mihira is not release-ready yet.

The app already has a real product inside it. The core user experience exists, the main features are visible, and the monetization shape is materially in place. What is still missing is the production layer required to ship to the App Store and Play Store without review, billing, backend, or trust problems.

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
- Expo server API routes for AI-backed features
- initial release docs, env docs, and QA checklist
- draft legal/support copy in `docs/`

This is enough to justify a release push. It is not enough to submit safely yet.

## Current State by Area

| Area | Status | Notes |
|---|---|---|
| Product UX | Mostly built | Main user flows exist |
| Core feature logic | Mostly built | Daily, ask, sacred timing all present |
| Commerce UX | Partial | RevenueCat-native direction is in code, but live store products and end-to-end purchase validation are still missing |
| Notifications | Deferred | No longer promised in onboarding, not implemented for v1 |
| Analytics | Partial | Instrumentation exists, production config still needs cleanup |
| Auth and profile | Mostly built | Includes account management and delete-account entry |
| Release config | Mostly built | `eas.json`, app identifiers, and versioning are present; release process still needs validation |
| Backend deployment | Partial | Expo API routes exist, but production hosting and mobile API base URL strategy are not finalized |
| Store readiness | Partial | Draft legal docs exist in-repo, but hosted URLs, assets, metadata, and privacy disclosures are still needed |
| QA | Partial | A release QA checklist exists, but there is no visible real-device signoff or release-build verification yet |

## Critical Blockers

## 1. Billing Needs Store Configuration and End-to-End Validation

This is the biggest blocker.

Current state:

- mobile plans UI exists
- `lib/subscription.ts` is prepared for RevenueCat/store-native billing
- `app/pricing.tsx` no longer exposes Clerk web pricing
- `react-native-purchases` and `react-native-purchases-ui` are installed
- mobile upgrade paths now target RevenueCat paywalls instead of browser checkout

Why this is risky:

- for iOS, digital subscriptions sold in the app generally need StoreKit / App Store In-App Purchase
- the RevenueCat wiring still depends on real store products, app-specific API keys, offerings, and entitlement setup
- until that is configured and tested, Plus billing is still incomplete

Recommended action:

1. configure App Store Connect, Play Console, and RevenueCat products/offering/entitlement
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

## 3. Release Configuration Exists, but the Release Path Still Needs Validation

This is no longer a structural blocker, but it is not fully validated.

Current state:

- `eas.json` is now present
- development, preview, and production profiles are defined
- app identifiers, version, build number, and version code exist in Expo config
- there is still no visible CI or release automation

Why this matters:

- Expo apps can be easy to develop but still require explicit release plumbing
- without build profiles, credentials, and release discipline, launch becomes brittle and manual

Recommended action:

- document build and submission commands
- produce preview and production candidate builds before any store submission

## 4. App Identifiers Are Set, but Store Setup Is Still Incomplete

Current state:

- Expo config now includes app name, slug, scheme, icon, splash, bundle identifier, Android package, and initial build numbering
- native identifiers have been updated to the Mihira naming scheme
- store records, signing setup, and release credentials are still not prepared

Why this matters:

- production store submission depends on stable identifiers and versioning
- this should be decided before asset generation and external setup

Recommended action:

- reserve the App Store and Play app records against the existing identifiers
- define the human release process for version bumps, build submission, and rollback

## 5. Environment and Production Config Are Incomplete

Current state:

- `.env.example` now includes Clerk, Supabase, RevenueCat, PostHog, and Perplexity placeholders
- `docs/env-setup.md` now documents dev, preview, and production expectations
- the release path has moved away from Stripe and toward RevenueCat
- actual production secrets and callback URLs are still not visible in this repo, which is expected but still blocking launch

Why this matters:

- missing env documentation causes failed builds, broken analytics, and broken payments
- production and development values should not be handled informally

Recommended action:

- provision production Clerk, Supabase, RevenueCat, PostHog, and Perplexity credentials
- finalize production URLs and callbacks
- verify that preview and production builds consume the right environment values

## 6. Backend Deployment Still Needs a Production Plan

Current state:

- the app includes Expo server API routes under `app/api/`
- AI-backed flows depend on those routes to call Perplexity using the server-side `PERPLEXITY_API_KEY`
- the repo also includes Supabase migrations under `supabase/migrations/`
- the current mobile route resolution is still development-oriented in places and does not show a finalized production API host strategy

Why this matters:

- this is not a pure client-only mobile app
- the managed services alone are not enough; the API routes also need a real production runtime
- if the mobile app does not know where production API routes live, the AI features will break outside local/dev conditions

Recommended action:

- choose the production home for the API routes
- define a production API base URL strategy for mobile builds
- deploy the server runtime and provision `PERPLEXITY_API_KEY`
- apply Supabase migrations in the target environment

## 7. Android Permissions Look Safer Now, but Should Still Be Kept Lean

Current state:

- the main Android manifest now shows `INTERNET`, `com.android.vending.BILLING`, and `VIBRATE`
- the earlier storage-permission concern no longer appears to apply to the main release manifest
- `SYSTEM_ALERT_WINDOW` still appears in debug manifests, which is expected for development tooling

Why this matters:

- unnecessary release permissions can trigger avoidable review scrutiny
- the current state looks much better than earlier drafts of this document implied

Recommended action:

- keep release permissions minimal
- verify the final generated release manifest before submission

## 8. Legal, Policy, and Store Answers Are Still Incomplete

Current state:

- draft privacy policy, terms of service, and support copy now exist in `docs/`
- there is still no visible evidence of hosted public URLs for those documents
- App Store privacy answers and Play Data Safety submission content are still not prepared

Why this matters:

- the app handles identity data, birth details, analytics, and payments
- store review will require clear disclosures

Recommended action:

- publish the legal/support documents to stable public URLs
- map data collection and processors before filling platform disclosures

## 9. Account Deletion Needs End-to-End Verification

Current state:

- a delete-account flow exists in `app/user-profile.tsx`
- the Clerk account can be deleted from native and web flows

Open question:

- does account deletion also clean up user-linked data in Supabase, usage tables, profile records, and any other persisted app data

Recommended action:

- verify end-to-end deletion behavior
- if needed, add backend cleanup jobs or database policies

## 10. QA and Release Testing Need Execution, Not Just Documentation

Current state:

- `docs/release-qa-checklist.md` now exists
- the automated baseline is healthy; the current Jest suite passes
- there is still no visible real-device signoff, release-build verification, or release validation pipeline

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
- some release docs still need freshness review so they match the current repo state

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
2. Deploy the Expo API routes and production runtime for AI-backed flows
3. Expand env documentation and secret handling
4. apply Supabase migrations and validate production callbacks

## Phase 3: App Compliance

1. Verify final release permissions
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

1. configure RevenueCat and store products end to end
2. choose and deploy the production host for Expo API routes
3. leave notifications out of the v1 promise unless they are implemented
4. set production env values and callbacks for Clerk, Supabase, RevenueCat, PostHog, and Perplexity
5. publish legal URLs and prepare store submission assets
6. run real-device QA on preview builds
7. verify account deletion and data cleanup behavior

## Working Release Assessment

Mihira is beyond prototype stage but still short of launch discipline.

The app already has enough product value to justify a beta or soft launch after the blockers above are addressed. The main work left is not inventing more features. It is making the current product shippable, review-safe, trustworthy, and deployable in production across both its managed services and its server-side API routes.
