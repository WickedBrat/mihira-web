# Aksha Release TODO

Based on [release-readiness.md](/Users/Apple/projects/aksha/docs/release-readiness.md)

## P0: Blockers

- [ ] Decide final mobile billing model
- [ ] Replace or remove browser-based subscription checkout for mobile release
- [ ] Unify entitlement logic for free vs Pro across mobile and backend
- [ ] Decide whether notifications are in v1
- [ ] If notifications are not in v1, remove reminder promises from onboarding
- [ ] If notifications are in v1, implement and test reminder permissions and delivery
- [ ] Add `eas.json`
- [ ] Define `development`, `preview`, and `production` build profiles
- [ ] Set `ios.bundleIdentifier` in [app.json](/Users/Apple/projects/aksha/app.json)
- [ ] Set `android.package` in [app.json](/Users/Apple/projects/aksha/app.json)
- [ ] Define iOS build number strategy
- [ ] Define Android version code strategy

## P1: Production Infrastructure

- [ ] Create production Clerk project and keys
- [ ] Create production Supabase project and keys
- [ ] Create production Stripe setup and keys
- [ ] Create production PostHog project and keys
- [ ] Finalize production domain and callback URLs
- [ ] Expand [.env.example](/Users/Apple/projects/aksha/.env.example) to include all required variables
- [ ] Document dev, preview, and production env setup
- [ ] Verify `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` handling
- [ ] Verify PostHog config requirements and document them

## P1: App Compliance and Review Safety

- [ ] Audit Android permissions in [AndroidManifest.xml](/Users/Apple/projects/aksha/android/app/src/main/AndroidManifest.xml)
- [ ] Remove unused `READ_EXTERNAL_STORAGE`
- [ ] Remove unused `WRITE_EXTERNAL_STORAGE`
- [ ] Remove unused `SYSTEM_ALERT_WINDOW`
- [ ] Verify account deletion works end to end
- [ ] Confirm deleted users are cleaned up from Clerk
- [ ] Confirm deleted users are cleaned up from Supabase profile data
- [ ] Confirm deleted users are cleaned up from usage-tracking data
- [ ] Confirm deleted users are cleaned up from any local persisted state as needed
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Create support/contact page
- [ ] Prepare App Store privacy disclosure answers
- [ ] Prepare Google Play Data Safety answers

## P1: Product Scope and UX Cleanup

- [ ] Decide whether Gurukul stays visible for v1
- [ ] If Gurukul stays, keep it clearly labeled as coming soon
- [ ] Review all onboarding promises for features not fully shipped
- [ ] Review paywall copy and pricing copy for launch consistency
- [ ] Add annual pricing option or explicitly defer it

## P2: QA and Release Validation

- [ ] Create release QA checklist
- [ ] Test onboarding end to end on a real iPhone
- [ ] Test onboarding end to end on a real Android device
- [ ] Test sign-in and sign-out flows
- [ ] Test profile save and sync flows
- [ ] Test daily alignment with production-like data
- [ ] Test sacred timing flow with production-like data
- [ ] Test guidance flow with production-like data
- [ ] Test paywall display behavior
- [ ] Test upgrade flow end to end
- [ ] Test entitlement refresh after purchase
- [ ] Test account deletion flow end to end
- [ ] Test app startup and crash-free launch in release builds
- [ ] Test deep links and callback URLs
- [ ] Test offline and degraded-network behavior

## P2: Store Preparation

- [ ] Finalize app name for store submission
- [ ] Reserve Apple App Store app record
- [ ] Reserve Google Play app record
- [ ] Prepare app subtitle and short description
- [ ] Prepare full store description
- [ ] Prepare keywords and metadata
- [ ] Prepare app icon and required screenshots
- [ ] Prepare support URL
- [ ] Prepare privacy policy URL
- [ ] Prepare age rating and content declarations
- [ ] Prepare subscription description and benefit copy

## P2: Observability and Operations

- [ ] Confirm analytics events are firing in production builds
- [ ] Decide on crash reporting tool and implement it if missing
- [ ] Set up basic launch dashboards for onboarding, activation, and conversion
- [ ] Define support workflow for user issues
- [ ] Define version rollback/update plan

## Launch Sequence

- [ ] Build preview release candidates
- [ ] Run internal QA on preview builds
- [ ] Ship to TestFlight
- [ ] Ship to Google Play internal or closed testing
- [ ] Collect and fix beta issues
- [ ] Re-test critical flows after fixes
- [ ] Submit App Store build
- [ ] Submit Google Play build

## Suggested First 7 Tasks

- [ ] Add `eas.json`
- [ ] Decide iOS and Android billing architecture
- [ ] Remove or implement onboarding reminder promise
- [ ] Set bundle ID and Android package
- [ ] Expand env documentation
- [ ] Audit Android permissions
- [ ] Create legal URLs
