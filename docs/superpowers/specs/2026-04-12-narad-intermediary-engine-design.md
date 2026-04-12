# Narad Intermediary Engine — Design Spec
**Date:** 2026-04-12  
**Feature:** Ask Narad (evolution of Ask Krishna)  
**Approach:** Minimal surgery (Option A) — new API route + new hooks/components layered onto existing infrastructure

---

## Overview

The Ask feature moves from a "Direct-to-Deity" chat model (user picks a deity, chats directly) to a **Celestial Proxy model**. The user always talks to **Narad**, a wise spiritual companion. Narad listens, internally routes to the most fitting deity (Krishna, Shiva, Lakshmi, or Ram), and returns a structured response containing his narrative, the deity's wisdom (Vani), and a relevant Sanskrit shloka.

The response is strict JSON — it drives both the UI text and the Skia realm backdrop animations. There is no streaming; a single `sonar-pro` request returns the full JSON on completion.

---

## Deities

Four deities only:

| Deity | Domain |
|---|---|
| Krishna | Dilemmas, relationships, duty (Bhagavad Gita) |
| Shiva | Transformation, letting go, meditation |
| Lakshmi | Abundance, flow, grace |
| Ram | Integrity, ethics, social duty |

Narad selects the deity internally based on the user's intent. The user never selects a deity.

---

## 1. Data & Types

### `features/ask/types.ts` (new file)

```ts
export type DeityName = 'Krishna' | 'Shiva' | 'Lakshmi' | 'Ram';

export type BubbleType =
  | 'narad_greeting'
  | 'narad_journey'
  | 'shloka'
  | 'vani'
  | 'narad_closing';

export interface NaradResponse {
  interaction_metadata: {
    consulted_deity: DeityName;
    realm: string;             // e.g. "Vaikuntha", "Kailash"
    ui_vibration_color: string; // hex code
    animation_trigger: string;  // e.g. "cosmic_glow", "gentle_pluck"
  };
  narad_narrative: {
    greeting: string;
    journey_description: string;
  };
  divine_vani: {
    shloka_devanagari: string;
    shloka_transliteration: string;
    wisdom_text: string;
    source_scripture: string;
  };
  narad_closing: string;
}

export interface NaradHistoryEntry {
  query: string;
  wisdom_text: string;
  deity: DeityName;
}

export interface NaradContext {
  userName: string;
  lastDeity: DeityName | null;
  lastTheme: string | null;
  interactionCount: number;
}
```

### Message type extension

The existing `Message` interface in `features/chat/useChatState.ts` gains two optional fields:

```ts
interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
  bubbleType?: BubbleType;       // present on Narad response messages
  visibleAfterMs?: number;       // stagger delay before FadeIn
  accentColor?: string;          // ui_vibration_color for shloka/vani border
  deityLabel?: string;           // deity name shown above vani bubble
}
```

Plain user messages and any legacy messages have no `bubbleType` and render unchanged.

---

## 2. API Route — `app/api/narad+api.ts`

### Request

```ts
POST /api/narad
{
  message: string;
  history: NaradHistoryEntry[];   // last 5 pairs
  userContext: NaradContext;
}
```

### Processing

1. Build a hidden `[INTERNAL CONTEXT]` block from `userContext` and `history` (server-side only, never returned to client).
2. Prepend the Narad system prompt (trimmed to 4 deities: Krishna, Shiva, Lakshmi, Ram).
3. Call Perplexity `sonar-pro` — non-streaming, full response captured.
4. Parse JSON. On parse failure, attempt to extract with `/\{[\s\S]*\}/` regex before returning `500`.
5. Return parsed `NaradResponse` as JSON.

### System prompt guardrails

- Intent maps only to the 4 deities above.
- No prophecy — focus on Karma and Bhava.
- Safety: if medical, legal, or self-harm topics arise, Narad redirects to professional help.
- No modern slang. Elevated, timeless tone.
- No Hindu-specific exclamations or symbols in the output text.
- Output must be strict JSON only — no markdown fences, no text outside the object.

### Error handling

- Malformed JSON → regex extraction attempt → `500` if still unparseable.
- Perplexity error → `502` with error message.

---

## 3. State Hook — `features/ask/useNaradState.ts`

Replaces `useChatState` for the Ask tab. Key differences:

- Sends `POST /api/narad` (not `/api/chat`) — no SSE, single `fetch`.
- On success, dispatches **5 sequential `Message` objects** from the parsed JSON:

| Index | `bubbleType` | Source field | `visibleAfterMs` |
|---|---|---|---|
| 0 | `narad_greeting` | `narad_narrative.greeting` | 0 |
| 1 | `narad_journey` | `narad_narrative.journey_description` | 600 |
| 2 | `shloka` | `divine_vani.shloka_devanagari` + transliteration + scripture | 1400 |
| 3 | `vani` | `divine_vani.wisdom_text` | 2400 |
| 4 | `narad_closing` | `narad_closing` | 3200 |

- `isTyping` remains `true` until message index 0 is dispatched (i.e. until JSON arrives).
- `TypingIndicator` text: `"Narad is journeying…"`
- History stored as `NaradHistoryEntry[]` in AsyncStorage key `narad_history` (last 5 entries).
- After each interaction, upserts `NaradContext` to AsyncStorage `narad_context` and fires a background Supabase upsert to `user_narad_context` table (no await — fire and forget).

### NaradContext loading

On mount, load from AsyncStorage. If not found, derive from Clerk user profile (`firstName` for `userName`, defaults for the rest).

---

## 4. Screens & Navigation

### Phase model (`app/(tabs)/ask.tsx`)

Phases: `'intro' | 'chat'` (replaces `'selector' | 'loading' | 'chat'`).

- First visit = `NaradContext.interactionCount === 0` → show `NaradIntro`.
- Subsequent visits → go straight to `'chat'`.
- The existing `guide` store and `commitToGuide` are left untouched but unused by this flow.

### `NaradIntro` screen (`features/ask/NaradIntro.tsx`)

Replaces `GuideSelector`. Shown on first visit only.

- Full-screen cinematic layout with `AmbientBlob` backdrop (saffron/gold tones).
- Narad illustration/image centered.
- Headline: `"Narad"` in headline font; essence label: `"Celestial Companion"`.
- Body copy (2–3 lines): explains the companion concept — Narad listens, seeks counsel from the wisest source, and returns with their words. Elevated, non-religious framing.
- Single `SacredButton`: `"Seek Counsel"` → transitions phase to `'chat'`.
- No "commit for life" mechanic. No permanence note.
- `GuideLoader` is retired from this flow — no equivalent needed.

### Chat screen changes

- `PageHero` title: `"Ask Narad"`, subtitle: `"Bring your question into the sacred space."`
- `AskBackdrop` replaced by `RealmBackdrop` (Skia, see Section 5).
- `TypingIndicator` text: `"Narad is journeying…"`
- Top-right menu retains the clear chat option.

---

## 5. Chat Bubble Rendering (`features/chat/ChatBubble.tsx`)

`ChatBubble` gains a `bubbleType` prop. All existing rendering is the default when `bubbleType` is absent.

| `bubbleType` | Rendering |
|---|---|
| `narad_greeting` | Standard AI bubble, italic body font, left-aligned |
| `narad_journey` | No bubble background. Smaller muted text, centered, italic — stage-direction feel |
| `shloka` | Card with subtle border in `accentColor`. Devanagari text in large serif/headline font with gold tint. Transliteration below in small italic. Scripture source as tiny label at bottom. |
| `vani` | Slightly larger font. Thin left-border accent in `accentColor`. `deityLabel` shown as small label above (e.g. `"Krishna"`). |
| `narad_closing` | Same as `narad_greeting`. Plain sign-off text, no fixed catchphrase. |

**Stagger:** Each message has `visibleAfterMs`. `ChatBubble` wraps in an `Animated.View` with `FadeIn` triggered after the delay via `useEffect` + `useState(false)` visibility gate.

**User bubbles** are unchanged — right-aligned, existing style.

---

## 6. Skia Realm Backdrop (`components/ui/RealmBackdrop.tsx`)

Replaces `AskBackdrop`. Full-screen `Canvas` (`StyleSheet.absoluteFill`, `pointerEvents="none"`).

### Per-deity shader config (`lib/skia/realmShaders.ts`)

| Deity | Hex | Shader feel |
|---|---|---|
| Krishna | `#4A90D9` | Flowing peacock-iridescent gradient, slow ripple |
| Shiva | `#B2BEB5` | Misty drifting smoke, cool grey |
| Lakshmi | `#D4AF37` | Warm radial glow, lotus-bloom pulse |
| Ram | `#E8A87C` | Steady grounded sunrise gradient |

### Animation phases

| Phase | Trigger | Visual |
|---|---|---|
| `idle` | Before any response | Subtle ambient drift, default saffron/purple |
| `journeying` | Request in-flight | Thin animated lines pulse outward from center in neutral gold (Veena string vibration) |
| `deity_reveal` | JSON arrives | Backdrop transitions to deity shader over ~1.2s via `withTiming` on a Reanimated shared value `uniform float progress` |
| `settled` | After reveal | Shader holds at full deity color, slow gentle drift |

### Implementation

- Shader GLSL strings defined in `lib/skia/realmShaders.ts`, keyed by `DeityName`.
- `RealmBackdrop` accepts `phase` and `deityName` props.
- Uses Skia `Shader` node with `uniforms` driven by `useSharedValue` (Reanimated 4) + `withTiming`.

### Fallback

If Skia is unavailable, falls back to `AmbientBlob` components with `ui_vibration_color` applied as the blob tint color.

---

## 7. Files Changed / Created

### New files
- `features/ask/types.ts`
- `features/ask/NaradIntro.tsx`
- `features/ask/useNaradState.ts`
- `app/api/narad+api.ts`
- `lib/skia/realmShaders.ts`
- `components/ui/RealmBackdrop.tsx`

### Modified files
- `features/chat/useChatState.ts` — extend `Message` interface
- `features/chat/ChatBubble.tsx` — add `bubbleType` rendering variants
- `app/(tabs)/ask.tsx` — replace phase model, swap components
- `lib/ai/prompts.ts` — add `NARAD_SYSTEM` prompt constant

### Untouched
- `features/ask/guidePersonas.ts`
- `features/ask/GuideSelector.tsx`
- `features/ask/GuideLoader.tsx`
- `lib/guideStore.tsx`
- `app/api/chat+api.ts`
- All existing paywall, usage, analytics wiring

---

## 8. Supabase

New table required: `user_narad_context`

```sql
create table user_narad_context (
  user_id text primary key,   -- Clerk user ID
  last_deity text,
  last_theme text,
  interaction_count integer default 0,
  updated_at timestamptz default now()
);
```

Upserted via `getSupabaseClient()` after each interaction (fire and forget, no await in client path).

---

## Out of Scope

- A/B testing between old deity chat and Narad
- Multi-language support for Devanagari rendering
- Narad avatar animations (beyond the Skia backdrop)
- Supabase RLS policies (assumed handled by existing Clerk JWT setup)
