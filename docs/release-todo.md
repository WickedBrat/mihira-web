# Mihira Release TODO

Based on [release-readiness.md](/Users/Apple/projects/aksha/docs/release-readiness.md)

## P0: Blockers

- [x] Decide final mobile billing direction: RevenueCat plus App Store and Play billing
- [x] Decide initial developer account path: individual accounts first
- [ ] Replace or remove browser-based subscription checkout for mobile release
- [x] Replace or remove browser-based subscription checkout for mobile release
- [ ] Unify entitlement logic for free vs Plus across mobile and backend
- [ ] Decide whether notifications should be added back after v1
- [x] If notifications are not in v1, remove reminder promises from onboarding
- [ ] If notifications are in v1, implement and test reminder permissions and delivery
- [x] Add `eas.json`
- [x] Define `development`, `preview`, and `production` build profiles
- [x] Set `ios.bundleIdentifier` in [app.json](/Users/Apple/projects/aksha/app.json)
- [x] Set `android.package` in [app.json](/Users/Apple/projects/aksha/app.json)
- [x] Define iOS build number strategy
- [x] Define Android version code strategy

## P1: Production Infrastructure

- [ ] Create production Clerk project and keys
- [ ] Create production Supabase project and keys
- [ ] Create RevenueCat project and app-specific API keys
- [ ] Create production PostHog project and keys
- [ ] Finalize production domain and callback URLs
- [x] Expand [.env.example](/Users/Apple/projects/aksha/.env.example) to include all required variables
- [x] Document dev, preview, and production env setup
- [x] Install `react-native-purchases` and `react-native-purchases-ui`
- [ ] Configure Apple App Store app in RevenueCat
- [ ] Configure Google Play app in RevenueCat
- [ ] Create `plus` entitlement and offerings in RevenueCat
- [ ] Verify PostHog config requirements and document them

## P1: App Compliance and Review Safety

- [x] Audit Android permissions in [AndroidManifest.xml](/Users/Apple/projects/aksha/android/app/src/main/AndroidManifest.xml)
- [x] Remove unused `READ_EXTERNAL_STORAGE`
- [x] Remove unused `WRITE_EXTERNAL_STORAGE`
- [x] Remove unused `SYSTEM_ALERT_WINDOW`
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

- [x] Decide whether Gurukul stays visible for v1
- [x] If Gurukul stays, keep it clearly labeled as coming soon
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
- [ ] Confirm acceptable seller-name tradeoff for Apple individual enrollment
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

- [x] Add `eas.json`
- [x] Decide iOS and Android billing architecture
- [x] Remove or implement onboarding reminder promise
- [x] Set bundle ID and Android package
- [x] Expand env documentation
- [x] Audit Android permissions
- [ ] Create legal URLs
