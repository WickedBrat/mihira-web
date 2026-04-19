# Mihira Environment Setup

## Required Environment Variables

These variables are currently referenced by the app and release config.

### Public Expo Variables

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_WEB_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`
- `EXPO_PUBLIC_REVENUECAT_OFFERING_ID`

### Server-Side or Build-Time Variables

- `PERPLEXITY_API_KEY`
- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`
- `ENABLE_DEV_BUTTONS`

## Local Development

Recommended files:

- `.env.local` for your personal local values
- `.env.example` as the repo template

Recommended defaults:

- `ENABLE_DEV_BUTTONS=true` for local development if you want the debug controls visible
- use non-production Clerk, Supabase, RevenueCat, and PostHog credentials

## Preview Builds

Use preview builds for internal QA and stakeholder testing.

Recommended setup:

- point to preview or staging Clerk and Supabase projects
- use RevenueCat Test Store or store sandbox products
- use either a staging PostHog project or a filtered dev environment
- keep `ENABLE_DEV_BUTTONS=false`

## Production Builds

Use only production credentials here.

Required before public release:

- production Clerk instance
- production Supabase project
- production RevenueCat project
- production PostHog project
- production domain and callback URLs for `https://getmihira.com`

Recommended defaults:

- `ENABLE_DEV_BUTTONS=false`

## Expo and EAS Notes

The repo now includes [eas.json](/Users/Apple/projects/aksha/eas.json) with:

- `development` profile for dev client builds
- `preview` profile for internal distribution
- `production` profile with auto-increment enabled

The active Expo config is [app.config.js](/Users/Apple/projects/aksha/app.config.js). Keep production identifiers and build behavior there.

## Current Identifiers

- App name: `Mihira`
- Slug: `mihira`
- URL scheme: `mihira`
- iOS bundle identifier: `com.mihira.app`
- Android package: `com.mihira.app`
- RevenueCat entitlement placeholder: `plus`

## Inputs Still Needed From You

- Apple Developer account enrollment as an individual
- Google Play developer account as a personal account
- RevenueCat project and API keys once created
- production Clerk keys
- production Supabase URL and anon key
- production PostHog token and host

RevenueCat now replaces Stripe as the mobile release path for subscriptions.

## RevenueCat Test Setup

For local development, Mihira can run against RevenueCat test SDK keys.

- set `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY` to your RevenueCat Apple test SDK key
- set `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY` to your RevenueCat Google test SDK key
- set `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=plus`
- keep `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default` unless you named the offering differently

This is enough for development builds and sandbox purchase testing, but it does not remove the need to create store-side products in App Store Connect and Google Play Console.

## Launch Values Confirmed

- Production domain: `https://getmihira.com`
- Support email: `help@getmihira.com`
- Google Play developer name: `Mihira Labs`
- Gurukul: keep visible as coming soon
- Launch price target: `$9.99/mo`

## Recommended Next Step

Once you have production accounts ready, fill the values locally, run preview builds first, and verify auth, billing, analytics, and API-backed features before any store submission.
