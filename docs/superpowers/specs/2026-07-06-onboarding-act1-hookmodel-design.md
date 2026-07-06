# Onboarding Redesign v2 — Act I: The Ache (S1–S6)

**Date:** 2026-07-06
**Source:** `Mihira Onboarding Redesign v2.dc.html` (22-screen hook-model redesign, provided by user)
**Scope of this spec:** Only Act I — the first 6 screens of the 22-screen redesign. Acts II–IV (S7–S22) are separate sub-projects, each to be brainstormed and spec'd independently once Act I ships.
**Approach:** UI/copy/interaction restructure first, using existing local/rule-based guidance logic (`personalGuidance.ts`) where the mock implies a "real" AI answer. Real backend wiring (actual Gemini call, Sacred Timing computation, vow/session persistence) is deferred to a later phase for the acts that need it — Act I itself does not require any new backend, since S1–S6 only touch data already captured by the existing onboarding flow (pain points, context, name, first question).

---

## Why this redesign

The current onboarding (`app/onboarding/index.tsx` + `step-2` through `step-17`) collects the same underlying data (ache, context, name, birth details, first question) but doesn't frame it as a hook-model loop (Trigger → Action → Variable Reward → Investment). The v2 redesign reframes the exact same early screens around sankalpa/vrata (vow) language, adds a variable-reward acknowledgment pattern to selection screens, and inserts a new reveal screen (S6) that names the "Ask Mihira" surface the user just used — closing the first full hook cycle before Act II begins.

---

## Architecture — insertion strategy

The redesign's Act I maps onto 5 existing files plus 1 new one:

| New design | Existing file | Change type |
|---|---|---|
| S1 Arrival | `index.tsx` | Copy only |
| S2 Naming the Ache | `step-2.tsx` | Content + interaction pattern change |
| S3 Where It Lives | `step-3.tsx` | Layout + new teaser card |
| S4 The Name | `step-4.tsx` | Copy addition |
| S5 First Whisper — Ask Saarthi | `step-5.tsx` | Copy + routing change |
| S6 This Is Ask Mihira | **`step-5b.tsx` (new)** | Net-new screen |

**Insertion, not renumbering.** S6 is inserted as `step-5b.tsx` rather than renumbering `step-6.tsx` through `step-17.tsx` to `step-7` through `step-18`. Only `step-5.tsx`'s `router.push` target changes, from `/onboarding/step-6` to `/onboarding/step-5b`; `step-5b.tsx` pushes to the existing `/onboarding/step-6`. No other file's routing changes. This keeps the diff for this sub-project contained to 6 files and leaves Acts II–IV's entry point (`step-6.tsx`, Personalization/Gender) completely untouched.

---

## Screen-by-screen spec

### S1 — Arrival (`index.tsx`)

Copy-only change, no structural/logic change:
- Headline: `"You already know something is out of rhythm. *You wouldn't be here otherwise.*"` (italic emphasis on second sentence, in `text-ob-gold`)
- Button label: `"Show me →"` (was `"Begin my alignment →"`)
- Subtext unchanged: `"You can save your account after Mihira shows your first guidance."`
- Everything else (breathing logo animation, starfield, haptics, `analytics.onboardingStarted()`, route to `step-2`) unchanged.

### S2 — Naming the Ache (`step-2.tsx`)

Replace the 9-pill list with the 4-pill set from the design doc. Each pill has its own acknowledgment line, matching the design's `ACHES` data exactly:

| id | label | ack (shown when this pill is the most-recently tapped) |
|---|---|---|
| `burnout` | Burned out | "That takes more out of you than people know." |
| `direction` | Seeking direction | "Not knowing which way to face is its own kind of tired." |
| `restless` | Mind won't settle | "A mind that won't settle is asking for rhythm, not more effort." |
| `reconnect` | Want to reconnect with myself | "You can't be far from something that lives in you." |

Interaction changes:
- Multi-select stays (unchanged from current behavior), but selection no longer triggers a toast.
- Below the pills, a single inline acknowledgment paragraph (italic, serif style consistent with `Cormorant Garamond`-equivalent in the app's type scale) shows the ack text for whichever pill was **most recently tapped** — this is the variable micro-reward. If nothing is selected yet, show: `"Take your time. Nothing here is graded."`
- Deselecting a pill does not change the ack line (it stays on the last-tapped pill until another pill is tapped).
- Continue button enabled once at least one pill is selected (unchanged gating logic).
- Persist selected pill labels to `painPoints` (existing `OnboardingData` field — no schema change).

### S3 — Where It Lives (`step-3.tsx`)

Layout change: switch the context chips from a wrapped single-row flex layout to a fixed 2-column grid (matches the design's `grid-template-columns:1fr 1fr`).

New "Sacred Timing" teaser card, replacing the current "Noted. Saarthi will respond..." card:
- Header label: `"Sacred timing · for later"`
- Body copy is dynamic based on selection, per the design's `contextLine` logic:
  - No selection: `"Choose where it shows up. There's a right window for what you're carrying — Mihira can find it."`
  - Selection made: `"There's a right window for what you're carrying in {first non-'not sure' context, lowercased}{and {second context} if a 2nd exists}. We'll need your birth rhythm to find it."`
- This card's copy is a narrative seed — its payoff is **S14 (Act II, out of scope for this spec)**, which will read back whichever context the user selected here. No new persistence is needed beyond the existing `guidanceContext` field; Act II's spec will read that field when it's built.
- Continue gating and haptics unchanged.

### S4 — The Name (`step-4.tsx`)

Copy addition only — one new paragraph inserted between the headline and the input, no logic change:
> "Sages rarely used a person's given name — they used the name of what the person was becoming. We'll start with what you're called now."

Everything else (auth-name prefill, edit tracking, `userName` persistence, routing to `step-5`) unchanged.

### S5 — First Whisper: Ask Saarthi (`step-5.tsx`)

This screen already implements the core mechanic correctly: free-text question → `getScriptureGuidance()` (local rule-based mapper in `personalGuidance.ts`) → 3-part answer (hearing / scriptural anchor / for today). No change to that logic for this sub-project — it stays local/rule-based rather than becoming a real Gemini call (that upgrade belongs to the later backend-wiring phase, and would apply equally to Act I and Act II screens that use guidance content).

Changes:
- Final CTA copy, after an answer is shown: `"Give it my birth rhythm →"` (was `"Make this more personal →"`)
- New disclaimer line above that CTA: `"This used only your words. Give it your birth rhythm, and the same question gets a sharper answer."`
- Routing: on press, go to **`step-5b`** (new S6) instead of directly to `step-6`.
- "Ask another question" secondary action, loading state, and prompt chips unchanged.

### S6 — This Is Ask Mihira (new `step-5b.tsx`)

Net-new screen. Purpose: names the surface the user just used (so it has a permanent home in-app) before moving into Act II's Personalization step.

Content:
- A miniature recap card at the top showing the just-asked question (truncated if long) and a redacted/skeleton preview of the 3-part answer structure (matches the design's blurred-line treatment — three horizontal bars of decreasing width standing in for "hearing / anchor / for today", not the actual answer text again).
- Headline: `"This is called **Ask Mihira**."` (emphasis on the name)
- Body: `"It's where you just were. Any question, answered from scripture — waiting in the Guidance tab whenever you need it."`
- Single CTA: `"Continue →"`, routes to existing `/onboarding/step-6`.

Data needed: reads `firstQuestion` from `onboardingStore` (already persisted by `step-5`) and re-derives the guidance via `getScriptureGuidance()` — no new state, no new persisted fields, no navigation params beyond the existing in-memory store.

Visual treatment: follows the same `OB` palette, `OnboardingStarField`, `OnboardingProgress` (phase `"you"`, same as S2–S5), `OnboardingDevBackButton` conventions as the surrounding screens — no new shared component needed.

---

## Data flow summary

No changes to `OnboardingData` shape (`lib/onboardingStore.ts`). Act I only reads/writes fields that already exist: `painPoints`, `guidanceContext`, `userName`, `firstQuestion`. The Sacred Timing teaser (S3) and the Ask Mihira recap (S6) are presentation-only — they read existing state, they don't introduce new fields.

## Error handling

No new failure modes introduced — no network calls added in this sub-project. Existing validation (must select ≥1 pill, must enter a name, must enter a question before submitting) is preserved as-is on each corresponding screen.

## Testing

Manual walkthrough via `npx expo start`, following existing project convention (no unit tests currently exist for onboarding screens). Verify:
1. S1 → S2 → S3 → S4 → S5 → S6 → S7 (existing `step-6`) routes correctly end-to-end.
2. S2's ack line updates live and reflects the last-tapped pill, including after deselecting.
3. S3's Sacred Timing card copy changes correctly for 0, 1, and 2+ selected contexts.
4. S5 → S6 recap shows the actual question/name entered earlier in the session (not placeholder data).
5. Back navigation (dev back button) still steps correctly through the new `step-5b` insertion.

---

## Out of scope (future sub-projects)

- Acts II–IV (S7–S22): Personalization, Deeper Layer investment gate, birth data collection, Mapping Ritual, Cosmic Signature, Sacred Timing payoff, Daily Alignment reveal, The Vow (sankalpa), Gurukul lock, alignment-window picker, Book of You, final Save screen.
- Real Gemini-backed Ask Saarthi (replacing `personalGuidance.ts`'s rule-based mapper).
- Sacred Timing computation tying S3's context selection to real muhurat data (`lib/vedic/muhurat.ts`).
- Any Supabase schema additions (vow/sankalpa storage, Book of You diary entries, notification-window scheduling) — none are needed for Act I.
