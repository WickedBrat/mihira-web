# Divine Guide Selector — Design Spec
**Date:** 2026-04-05  
**Feature:** God/guide selector onboarding + persona-driven chat for the Ask screen

---

## Overview

The Ask screen becomes a fully personalized sanctuary. On first open, the user commits to one divine life coach — a Hindu deity or Jesus — through a sacred selection ritual. The choice is permanent. The entire tab (label, header, chat persona) reflects that choice forever.

---

## Screen Phases

`app/(tabs)/ask.tsx` manages three phases via local state:

```
selector → loading → chat
```

On mount, read `@aksha/guide` from AsyncStorage:
- Found → skip to `chat` phase immediately
- Not found → start at `selector` phase

---

## File Changes

### Renamed
- `app/(tabs)/ask-krishna.tsx` → `app/(tabs)/ask.tsx`

### Modified
- `app/(tabs)/_layout.tsx` — update tab name from `ask-krishna` to `ask`
- `components/ui/TabBar.tsx` — update key from `ask-krishna` to `ask`; read guide from context to render dynamic label ("Ask Krishna", "Ask Jesus", etc.)
- `lib/ai/prompts.ts` — add per-guide system prompts (`GUIDE_PERSONAS` map)
- `app/api/chat+api.ts` — accept `persona` field in request body; use it to select system prompt
- `features/chat/useChatState.ts` — accept `guide` param; pass `persona` to API

### New Files
- `lib/guideStore.ts` — AsyncStorage read/write + React Context for selected guide
- `features/ask/GuideSelector.tsx` — god-picker UI (phase 1)
- `features/ask/GuideLoader.tsx` — particle orb animation (phase 2)
- `features/ask/guidePersonas.ts` — guide definitions (name, emoji, essence, commitment verb, system prompt)

---

## Guide Selector UI (Phase 1)

**Layout:** Full-screen dark surface with ambient blobs matching app aesthetic.

**Header (centered):**
- Title: *"Who calls to your soul?"*
- Subtitle: *"This is a lifelong commitment. Choose with intention."*

**Body:** Scrollable vertical list of guide cards. Each card shows:
- Emoji (large)
- Name
- One-line essence

Selected card: slow warm glow using app's primary purple — not a sharp highlight, more like recognition.

**Footer:**
- CTA button: dynamically shows commitment verb for selected guide. Inactive until a guide is selected.
- Small dim note below button: *"You cannot change this later"*

### Guide Definitions

| Emoji | Name | Essence | Commitment Button |
|-------|------|---------|-------------------|
| 🦚 | Krishna | Wisdom & Dharma | "Walk with Krishna" |
| 🌙 | Shiva | Transformation & Stillness | "Surrender to Shiva" |
| 🐘 | Ganesha | New Beginnings & Obstacles | "Receive Ganesha's Blessings" |
| 🌺 | Lakshmi | Abundance & Grace | "Invite Lakshmi's Grace" |
| ⚔️ | Durga | Strength & Protection | "Invoke Durga's Shakti" |
| 🎶 | Saraswati | Knowledge & Creativity | "Seek Saraswati's Wisdom" |
| 🏹 | Ram | Virtue & Righteousness | "Follow Ram's Path" |
| 🌅 | Hanuman | Devotion & Courage | "Serve with Hanuman" |
| ✝️ | Jesus | Love & Forgiveness | "Walk with Jesus" |

---

## Particle Loader Animation (Phase 2)

Triggered immediately after tapping the commitment button. Slow, calm, meditative pacing throughout — nothing snappy or urgent.

**Sequence (~5–6s total):**

1. **0.0s** — Brief pause of stillness (~0.5s). The commitment lands.
2. **0.5s** — 6 soft glowing orbs appear at random scattered positions (white/gold, 12–20px diameter each). Low opacity, barely visible.
3. **0.5–3.5s** — Orbs drift inward slowly using long `withTiming` eases (not springs). Each has a slight delay offset so they don't move in sync. They converge toward center.
4. **3.5s** — Orbs merge: single bright pulse, scales up gently, then fades out.
5. **3.8s** — Guide emoji appears at center, large (~80px), with a slow `FadeIn` + gentle scale from 0.85→1.
6. **4.2s** — Text beneath: *"[Guide] is with you"* fades in softly.
7. **5.5s** — Auto-advance to chat phase with a slow fade transition.

**Implementation:** Reanimated `withTiming` with `Easing.out(Easing.cubic)` for orb drift. `withDelay` for staggered entry. No user interaction during this phase — no skip button.

---

## Tab & Screen Customization

The `guideStore` exposes a React Context wrapping the tab layout. Both `TabBar` and `ask.tsx` read from it.

- **Tab label**: `"Ask [Guide]"` — e.g. "Ask Krishna", "Ask Jesus"
- **Screen header**: `"Ask [Guide]"`
- **Typing indicator**: `"[Guide] is reflecting…"`
- **Chat sender label**: Guide name instead of "Aksha"

---

## AI Personas

All prompts share: 2–4 sentence default responses, speak *as* the being not *about* them, no generic life-coach language, no preachiness.

| Guide | Persona Prompt Direction |
|-------|--------------------------|
| Krishna | Philosophical, paradox and metaphor, references the Gita, reflects questions back, calls user "dear one" |
| Shiva | Sparse minimal words, destruction as liberation, austere warmth, silence implied |
| Ganesha | Warm, slightly playful, practical, acknowledges the obstacle before offering a path |
| Lakshmi | Graceful, frames everything through worthiness and flow, gentle encouragement |
| Durga | Fierce love, direct, fearless, never coddles, speaks of inner shakti |
| Saraswati | Measured, poetic, values clarity over comfort, asks user to look deeper |
| Ram | Noble, steady, duty without rigidity, deeply grounded |
| Hanuman | Selfless, frames everything through service and surrender, humble joy |
| Jesus | Unconditional love, radical acceptance, speaks in parables, calls user "beloved" |

System prompts live in `guidePersonas.ts` and are keyed by guide name. The API receives `persona: string` in the request body and selects the matching prompt.

---

## Data Flow

```
User selects guide
  → saved to AsyncStorage (@aksha/guide)
  → guideStore context updates
  → TabBar re-renders with "Ask [Guide]"
  → Loader phase plays
  → Chat phase begins

On chat message send:
  useChatState → POST /api/chat { message, history, persona: "Krishna" }
  API selects GUIDE_PERSONAS["Krishna"] as system prompt
  Streams response back
```

---

## What's Not Changing

- Chat bubble layout (left/right AI/user)
- Streaming SSE response mechanism
- Chat history persistence in AsyncStorage
- AmbientBlob backdrop on the chat screen
