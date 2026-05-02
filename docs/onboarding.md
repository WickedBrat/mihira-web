# Aksha Onboarding Flow

## Overview

The current onboarding flow is implemented as a route-based sequence under `app/onboarding/` and shared state in `lib/onboardingStore.ts`.

Important structural note:

- The route numbering has a gap: `step-3.tsx` is deleted.
- The birth-data collection has been split into three separate route screens: `step-5.tsx`, `step-5-tob.tsx`, and `step-5-place.tsx`.
- In practice, the current onboarding is 13 route screens:
  - `index`
  - `step-2`
  - `step-4`
  - `step-5`
  - `step-5-tob`
  - `step-5-place`
  - `step-6`
  - `step-7`
  - `step-8`
  - `step-9`
  - `step-10`
  - `step-11`
  - `step-12`

## Flow Intent

The flow is built less like a standard utility onboarding and more like a guided ritual:

- Start with emotional resonance, not product education.
- Capture the user's motivation and identity early.
- Collect birth data as the foundation for personalized astrology outputs.
- Create a perceived "processing" and "reveal" moment.
- Introduce the AI guide and daily ritual value before entering the main app.
- End with a commitment choice and ceremonial long-press entry.

## Shared System

### State collected

`lib/onboardingStore.ts` stores:

- `painPoints`
- `userName`
- `birthDate`
- `birthTime`
- `birthPlace`
- `unknownBirthTime`
- `commitmentTier`
- `firstQuestion`

### Visual language

Across the flow, the design system is consistent:

- Dark celestial background using `bg-ob-bg`
- Gold and saffron accents for meaning, emphasis, and CTA hierarchy
- Headline-led typography with large spiritual/luxury framing
- Soft borders, glow shadows, glass-like cards, and ambient star fields
- Reanimated entry transitions on most screens
- Haptic feedback on most important taps

### UX pattern

The onboarding uses a repeating pattern:

- One primary action per screen
- Minimal competing controls
- Short, thematic copy instead of dense explanation
- Progressive disclosure
- Frequent emotional framing to make data entry feel intentional

## Screen-by-Screen

### 1. Welcome / Initial Spark

- Route: `app/onboarding/index.tsx`
- Intent: Start the journey with atmosphere and brand positioning.
- Visual:
  - Minimal star field on a dark background
  - Pulsing moon symbol
  - Large `Aksha` wordmark
  - Quiet cinematic reveal with fade timing
- UI:
  - Primary CTA: `Begin My Alignment`
  - Secondary action: `Skip Onboarding`
- UX:
  - Strong emotional opening
  - No friction before entry
  - Good use of skip to respect experienced users
  - Starts analytics with `onboarding_started`

### 2. Pain Point Intake

- Route: `app/onboarding/step-2.tsx`
- Intent: Understand why the user came and make them feel seen.
- Visual:
  - Clean stacked list of selectable pills
  - Active state uses saffron tint and border
  - Toast feedback adds affirmation after first selection
- UI:
  - Multi-select pill choices:
    - `Decision Fatigue`
    - `Career Burnout`
    - `Search for Purpose`
    - `Disconnected from Roots`
    - `Restless Mind`
  - CTA: `Continue ->`
- UX:
  - Multi-intent is a strong choice; it avoids forcing a single reason too early
  - The affirmation toast reduces coldness and gives the first small emotional reward
  - CTA is disabled visually until at least one choice is selected

### 3. Name Capture / Sacred Identity

- Route: `app/onboarding/step-4.tsx`
- Intent: Personalize the flow and create a sense of sacred address.
- Visual:
  - Large single text input with strong typography
  - Minimal underline instead of a heavy form field
  - Name echo preview with moon symbol
- UI:
  - Text input: `Your name...`
  - Dynamic CTA label: `Enter as {firstName} ->`
- UX:
  - Feels intimate rather than administrative
  - Immediate reuse of the user's name improves later screens
  - Low friction, single-field step

### 4. Birth Data Part 1 / Date of Birth

- Route: `app/onboarding/step-5.tsx`
- Intent: Begin chart setup with the least intimidating birth detail.
- Visual:
  - Shared `BirthDataScaffold` with step badge `BIRTH DETAILS 1/3`
  - Tactile date row and inline picker reveal
  - Reassurance card below the field
- UI:
  - Back button
  - Date selector row
  - Hide/show picker behavior
  - CTA: `Next: Birth time ->`
- UX:
  - Smart decomposition of birth data into smaller steps
  - Date first is easier than asking for full datetime/place in one screen
  - Reassurance copy lowers anxiety around precision

### 5. Birth Data Part 2 / Time of Birth

- Route: `app/onboarding/step-5-tob.tsx`
- Intent: Improve chart precision while preserving forward momentum for users who do not know the exact time.
- Visual:
  - Same scaffold for continuity
  - Time row mirrors the date screen
  - Dedicated card for the "unknown time" option
- UI:
  - Time picker
  - Toggle: `I do not know my exact time`
  - CTA: `Next: Birth place ->`
- UX:
  - This is one of the strongest UX decisions in the flow
  - The unknown-time path prevents users from stalling
  - The fallback is explained clearly: Aksha will use a solar chart / neutral reference

### 6. Birth Data Part 3 / Place of Birth

- Route: `app/onboarding/step-5-place.tsx`
- Intent: Capture the final required input for chart calculation.
- Visual:
  - Same scaffold and styling
  - Simple text input inside a soft bordered card
  - Privacy footer with lock icon
- UI:
  - Text input: `City, Country...`
  - CTA: `Calculate My Chart ->`
  - Privacy reassurance block
- UX:
  - Good final step in the birth-data trilogy
  - Privacy note is important because this is sensitive data
  - Input is lightweight, but there is no autocomplete or geocoding guidance yet

### 7. Mapping / Processing Ritual

- Route: `app/onboarding/step-6.tsx`
- Intent: Turn system processing into a ritualized moment of anticipation.
- Visual:
  - Large Skia celestial dial
  - Rotating outer and inner markers
  - Animated central moon
  - Cycling status lines
  - Progress dots that advance with each status
- UI:
  - No user controls
  - Auto-advance after status sequence completes
- UX:
  - Strong "wait state as experience" treatment
  - Makes computation feel meaningful rather than blank
  - Effective transition into the reveal
  - Time cost is forced, but the animation gives it narrative value

### 8. Cosmic Signature Reveal

- Route: `app/onboarding/step-7.tsx`
- Intent: Deliver the first clear personalized payoff.
- Visual:
  - Hero reveal screen with celestial backdrop
  - Premium-looking glass card
  - User initial medallion
  - Nakshatra pill
  - Rashi pill with zodiac icon
  - Soul insight copy block
- UI:
  - CTA: `Meet Your Sarathi ->`
- UX:
  - This is the onboarding's first real "aha" moment
  - It transforms the previously entered birth data into identity
  - Strong emotional reward after the heavier data-entry sequence
  - The payoff is immediate and legible even if the underlying astrology is unfamiliar

### 9. Sarathi / First Question

- Route: `app/onboarding/step-8.tsx`
- Intent: Introduce the AI guide through a personal, emotionally framed first interaction.
- Visual:
  - Guide avatar with pulsing status dot
  - Chat bubble layout
  - User input composer
  - Loading dots during response delay
- UI:
  - Prompt asks for one question weighing on the user's heart
  - Multiline text input
  - Send button
  - Continue CTA only appears after the simulated response
- UX:
  - Good use of a guided first prompt instead of a blank AI canvas
  - The user contributes something meaningful before entering the app
  - The response is currently symbolic rather than real AI output, but it still reinforces the tone
  - This step deepens emotional investment

### 10. Daily Alignment Dial / Notification Primer

- Route: `app/onboarding/step-9.tsx`
- Intent: Tease a repeatable daily value loop before asking for reminder acceptance.
- Visual:
  - Circular dial visualization with highlighted `Abhijit` segment
  - Soft glow behind the dial
  - Small legend markers explaining meaning
- UI:
  - CTA: `Allow Daily Reminders ->`
  - Secondary action: `Skip for now`
- UX:
  - Good pattern: explain the value of notifications before requesting them
  - However, the current implementation does not actually request notification permissions yet
  - It behaves as a conceptual primer, not a real permission step

### 11. Social Proof Carousel

- Route: `app/onboarding/step-10.tsx`
- Intent: Build confidence after the value tease and before commitment.
- Visual:
  - Horizontal testimonial carousel
  - Each card includes quote, avatar initial, title, and nakshatra tag
  - Pagination dots support direct selection
- UI:
  - Swipeable cards
  - Tapable page dots
  - CTA: `I'm Ready ->`
- UX:
  - Good placement after personalization and before commitment
  - Helps reduce skepticism for a spiritual/astrology product
  - The social proof is emotionally framed, not feature-framed

### 12. Commitment Tier / Sankalpa

- Route: `app/onboarding/step-11.tsx`
- Intent: Let the user choose the depth of their daily practice.
- Visual:
  - Three richly styled tier cards
  - Recommended state for `The Growth`
  - Expanded features only for the currently selected tier
- UI:
  - Tier choices:
    - `The Seed`
    - `The Growth`
    - `The Mastery`
  - CTA: `Set My Sankalpa ->`
- UX:
  - Strong framing of commitment in terms of ritual and time, not pricing
  - Good default on the middle tier
  - Helps the product feel customizable before entering the main app
  - This step shapes expectation, even if the selection is only partially persisted

### 13. Threshold / Long-Press Entry

- Route: `app/onboarding/step-12.tsx`
- Intent: Turn the final transition into an initiation rather than a simple tap.
- Visual:
  - Full-screen gradient with star field
  - Expanding ripple rings
  - Circular hold target with progressive fill
  - Large ceremonial headline using the user's name
- UI:
  - Long press target: `Hold to Enter`
  - No alternate CTA
- UX:
  - Very distinctive ending; memorable and on-brand
  - Long-press plus haptic milestones creates a sense of ceremony
  - On completion, analytics fires `onboarding_completed`
  - If the user is signed in, only some fields are persisted to profile:
    - `name`
    - `birth_place`
    - `focus_area` from `commitmentTier`

## Navigation Summary

The current route sequence is:

1. `/onboarding`
2. `/onboarding/step-2`
3. `/onboarding/step-4`
4. `/onboarding/step-5`
5. `/onboarding/step-5-tob`
6. `/onboarding/step-5-place`
7. `/onboarding/step-6`
8. `/onboarding/step-7`
9. `/onboarding/step-8`
10. `/onboarding/step-9`
11. `/onboarding/step-10`
12. `/onboarding/step-11`
13. `/onboarding/step-12`
14. `/(tabs)`

## What The Flow Does Well

- Strong thematic consistency from first screen to final entry
- Good emotional framing instead of feature dumping
- Clear use of personalization as the main engine of value
- Sensible decomposition of birth-data capture into smaller steps
- Strong first payoff with the cosmic signature screen
- Effective introduction of AI through a guided first question
- Memorable transitions and haptic feedback across the journey

## Current UX Gaps And Implementation Notes

- `step-3` is missing, so the numbering is inconsistent from an implementation standpoint.
- The onboarding has no explicit auth gate inside the flow right now; it ends by routing to `/(tabs)`.
- The notification step is a primer only; it does not call a real permission request.
- Birth date and birth time are collected but not persisted to profile in `step-12`.
- Birth place uses plain text entry only; there is no location search, validation, or suggestion layer.
- The AI question step simulates a response delay rather than generating a real answer.

## Overall Read

This onboarding is intentionally high-theater and identity-driven. It does not try to be short. It tries to make the user feel seen, interpreted, and initiated. The best parts of the flow are the birth-data progression, the cosmic signature reveal, and the ceremonial ending. The weakest parts are not conceptual. They are implementation gaps where promised behaviors are still placeholders, especially notifications, persistence completeness, and the absent `step-3` route.
