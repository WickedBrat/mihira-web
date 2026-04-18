# Aksha Product Overview

## Product Summary

Aksha is a mobile app that combines Vedic astrology, sacred timing, scripture-grounded guidance, and spiritual habit-building into one premium experience.

Today, the product is organized around four pillars:

1. Daily Alignment
2. Guidance
3. Sacred Timing
4. Profile and spiritual identity

There is also a fifth pillar in progress:

5. Gurukul, a guided learning library, currently positioned as coming soon

## Current Product Shape

The codebase currently contains:

- 22 user-facing route files
- 5 main tab screens
- 13 onboarding route files
- 4 support, commerce, and account routes
- 5 API routes

For a v1 launch, the real product is the combination of onboarding, daily alignment, guidance, sacred timing, sacred days, profile, and billing.

## Product Personas

### Persona 1: The Grounded Professional

- Lives abroad
- Wants direction at the start of the day
- Does not want a noisy, transactional astrology experience
- Values tasteful design, privacy, and clarity

Primary use cases:

- morning orientation
- difficult decisions
- work stress
- relationship tension

### Persona 2: The Ritual Planner

- Wants help timing events and important actions
- Cares about festivals, auspicious windows, and meaningful routines
- May not have easy access to trusted family guidance or a personal astrologer

Primary use cases:

- important conversations
- travel
- ceremonies
- family decisions
- home and life milestones

### Persona 3: The Cultural Seeker

- Wants spiritual depth without feeling overwhelmed
- Is curious about scripture and Vedic thought
- Wants a modern entry point into tradition

Primary use cases:

- questions about duty, grief, fear, purpose, and relationships
- festival discovery
- light daily practice

## Core User Journey

### 1. Onboarding

The app starts with a ritualized onboarding flow that introduces the brand, collects identity and birth data, previews the product, and frames the app as a daily spiritual rhythm.

### 2. Daily Use

After onboarding, users land in the tab-based app where they can:

- read their daily alignment
- ask a spiritual or practical question
- find auspicious timing
- explore sacred days
- manage profile and subscription

### 3. Monetization

The free tier creates habit and trust. Paid unlocks higher usage and eventually deeper ritual content.

## Screen Inventory

## Main App Screens

| Route | Purpose | Current State |
|---|---|---|
| `app/(tabs)/index.tsx` | Home screen with daily alignment and sacred day content | Live |
| `app/(tabs)/ask.tsx` | Scripture-grounded guidance chat | Live |
| `app/(tabs)/muhurat.tsx` | Sacred timing and auspicious window finder | Live |
| `app/(tabs)/gurukul.tsx` | Learning hub | Coming soon |
| `app/(tabs)/profile.tsx` | Profile, subscription entry point, auth, settings | Live |

## Onboarding Routes

| Route | Purpose |
|---|---|
| `app/onboarding/index.tsx` | Brand introduction and entry into onboarding |
| `app/onboarding/step-2.tsx` | Early preference and emotional setup |
| `app/onboarding/step-4.tsx` | Product framing and transition into birth data |
| `app/onboarding/step-5.tsx` | Birth date collection |
| `app/onboarding/step-5-tob.tsx` | Birth time collection |
| `app/onboarding/step-5-place.tsx` | Birth place collection |
| `app/onboarding/step-6.tsx` | Processing ritual while preparing output |
| `app/onboarding/step-7.tsx` | Birth alignment reveal |
| `app/onboarding/step-8.tsx` | Guide and spiritual framing setup |
| `app/onboarding/step-9.tsx` | Daily reminder teaser |
| `app/onboarding/step-10.tsx` | Product expectation and trust-building |
| `app/onboarding/step-11.tsx` | Commitment tier selection |
| `app/onboarding/step-12.tsx` | Long-press initiation into the app |

## Support, Commerce, and Utility Screens

| Route | Purpose | Current State |
|---|---|---|
| `app/pricing.tsx` | Web pricing screen using Clerk pricing table | Live on web |
| `app/payment-success.tsx` | Post-checkout confirmation | Live |
| `app/user-profile.tsx` | Account management and delete-account flow | Live |
| `app/sacred-day/[id].tsx` | Sacred day detail page with context and rituals | Live |

## API Routes

| Route | Purpose |
|---|---|
| `app/api/ask+api.ts` | Structured scripture guidance generation |
| `app/api/chat+api.ts` | Streaming chat route |
| `app/api/narad+api.ts` | Deprecated route kept for compatibility |
| `app/api/wisdom/daily+api.ts` | Daily alignment generation |
| `app/api/wisdom/muhurat+api.ts` | Sacred timing calculation plus commentary |

## Feature Inventory

## 1. Daily Alignment

What it does:

- uses birth data and Vedic chart logic
- creates a daily reading for where the user should place their energy
- combines summary, focus areas, and reasoning

Why it matters:

- gives users a reason to return daily
- creates ritual and retention
- makes the app feel personal from the start

Status:

- implemented
- central to the product

## 2. Guidance

What it does:

- lets users ask real-life questions
- returns guidance grounded in scripture
- includes citations, interpretation, and follow-up prompts
- uses saved passages and response modes to deepen value

Why it matters:

- this is the strongest emotional feature in the product
- it can become the retention engine and subscription driver

Status:

- implemented
- differentiated

## 3. Sacred Timing

What it does:

- lets users describe an event or decision
- scans a date range
- returns auspicious windows with reasoning and warnings

Why it matters:

- it is practical and specific
- it gives the app a clear use case beyond daily content
- it can drive upgrades because users will return at moments of intent

Status:

- implemented
- already tied to free-versus-pro usage limits

## 4. Sacred Days

What it does:

- surfaces festival and sacred day content
- links to a detail page with explanation and rituals

Why it matters:

- helps the app feel culturally alive
- strengthens ritual connection and shareability

Status:

- implemented

## 5. Profile and Identity

What it does:

- stores profile, language, region, and birth details
- shows zodiac and moon-profile context
- offers sign-in, account management, and delete-account entry

Why it matters:

- keeps the app personalized
- supports account sync and subscriber management

Status:

- implemented

## 6. Billing and Plans

What it does today:

- exposes a free-versus-pro structure
- applies usage limits to guidance and sacred timing
- shows a plans screen on mobile
- opens a web checkout flow

Why it matters:

- monetization exists in concept and in UI
- the implementation still needs production-hardening for launch

Status:

- partially implemented

## 7. Gurukul

What it does today:

- presents itself as a future guided library of wisdom, breathwork, and philosophy

Why it matters:

- it can become the depth and retention layer later
- it is not needed to validate the core business thesis

Status:

- not yet built
- currently a teaser screen

## Product Strengths

### 1. Strong Emotional Positioning

The app does not feel like a generic astrology clone. It feels thoughtful, premium, and spiritually serious.

### 2. Clear Differentiation

The combination of daily alignment, scripture guidance, and sacred timing is unusual and defensible.

### 3. Strong Onboarding Drama

The onboarding feels ceremonial and distinct. That can improve memorability if completion remains high.

### 4. Good Early Monetization Shape

The app already has usage-limited features that naturally map to a free-plus-paid model.

## Product Risks

### 1. Too Much Friction in Onboarding

The onboarding is rich and immersive, but it is also long. If completion is weak, the product will struggle before users ever feel the value.

### 2. Gurukul Is Visible but Not Ready

This is acceptable if framed clearly as coming soon. It becomes a problem if users expect depth and find a placeholder.

### 3. Product Promise Versus Infrastructure

The product experience feels premium, but parts of the release and billing stack are not yet production-ready.

## Current Feature Status

| Area | Status | Notes |
|---|---|---|
| Onboarding | Strong but long | Distinctive flow, needs completion-rate validation |
| Daily Alignment | Implemented | Core retention feature |
| Guidance | Implemented | Strong differentiation |
| Sacred Timing | Implemented | Strong upgrade trigger |
| Sacred Days | Implemented | Good cultural layer |
| Profile | Implemented | Includes account management entry |
| Billing | Partial | Paywall logic exists, checkout approach needs work |
| Notifications | Not implemented | Onboarding promises them, code does not deliver |
| Gurukul | Not implemented | Visible teaser only |
| Production release setup | Not implemented | Missing release plumbing |

## Suggested v1 Scope

If the goal is to launch well, not launch big, v1 should emphasize:

- Daily Alignment
- Guidance
- Sacred Timing
- Sacred Days
- Profile and subscription

Gurukul can remain clearly marked as coming soon if everything else is stable.

## One-Sentence Product Description

Aksha is a premium Vedic guidance app that helps Indians abroad navigate daily life through personalized alignment, sacred timing, and scripture-grounded clarity.
