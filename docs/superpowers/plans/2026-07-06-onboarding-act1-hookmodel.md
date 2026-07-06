# Onboarding Act I (S1–S6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the first 6 onboarding screens (arrival through first AI question) to match the "Onboarding Redesign v2 — Hook Model" spec's Act I, and insert one net-new reveal screen, without touching any backend or the `OnboardingData` schema.

**Architecture:** Six React Native / expo-router screens under `mobile/app/onboarding/`. Five are copy/interaction edits to existing files; one (`step-5b.tsx`) is a new file inserted into the routing chain between the existing `step-5.tsx` and `step-6.tsx`. No new shared components, no new persisted fields, no network calls added.

**Tech Stack:** Expo SDK 54, expo-router, React Native + NativeWind (Tailwind classes via `className`), `react-native-reanimated` for entrance animations, `expo-haptics`.

## Global Constraints

- Working directory for all file paths below is `mobile/` (i.e. `mobile/app/onboarding/index.tsx`, not repo root).
- Project convention: no unit tests exist for onboarding screens (spec's own Testing section confirms this) — verification is TypeScript compilation (`npx tsc --noEmit`) plus manual walkthrough via Expo, not new automated tests.
- Do not rename or renumber any existing `step-N.tsx` file. The new screen is `step-5b.tsx`; only `step-5.tsx`'s routing target changes.
- Do not modify `lib/onboardingStore.ts` — no new fields are needed for Act I.
- Follow existing palette (`OB` object / `ob-*` Tailwind classes) and font classes (`font-headline` = CormorantGaramond serif, `font-body`/`font-body-medium` = GoogleSans, `font-label` = GoogleSans SemiBold). No italic font weights are loaded in `app/_layout.tsx`, so emphasis is done via the `ob-gold` color, not `italic` styling.
- Every screen keeps `OnboardingDevBackButton`, `OnboardingStarField`, and (where already present) `OnboardingProgress phase="you"` — these are established per-screen conventions, not to be removed.
- Haptics: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` on every tap/selection, matching existing screens.

---

### Task 1: S1 Arrival copy update

**Files:**
- Modify: `mobile/app/onboarding/index.tsx:67-77`

**Interfaces:** None — pure JSX text change, no props/state affected. Downstream: still calls `continueOnboarding()` → `router.replace('/onboarding/step-2')`, unchanged.

- [ ] **Step 1: Replace the headline and button text**

In `mobile/app/onboarding/index.tsx`, replace:

```tsx
        <Animated.View entering={FadeIn.delay(900).duration(800)} className="mt-3 items-center gap-2.5">
          <Text className="text-center font-headline text-[22px] tracking-[-0.4px] text-ob-text">
            The universe is always moving.
          </Text>
          <Text className="text-center font-body text-base text-ob-muted">Find your rhythm within it.</Text>
        </Animated.View>
```

with:

```tsx
        <Animated.View entering={FadeIn.delay(900).duration(800)} className="mt-3 items-center gap-2.5">
          <Text className="text-center font-headline text-[22px] leading-[28px] tracking-[-0.4px] text-ob-text">
            You already know something is out of rhythm.
          </Text>
          <Text className="text-center font-headline text-[22px] leading-[28px] tracking-[-0.4px] text-ob-gold">
            You wouldn't be here otherwise.
          </Text>
        </Animated.View>
```

Then replace the button label:

```tsx
            <Text className="text-center font-label text-base tracking-[0.3px] text-white">
              Begin my alignment →
            </Text>
```

with:

```tsx
            <Text className="text-center font-label text-base tracking-[0.3px] text-white">
              Show me →
            </Text>
```

Leave the subtext (`You can save your account after Mihira shows your first guidance.`), the logo breathing animation, `analytics.onboardingStarted()`, and haptics untouched.

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: no new errors referencing `app/onboarding/index.tsx`.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/index.tsx
git commit -m "$(cat <<'EOF'
Update onboarding S1 arrival copy for hook-model redesign

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: S2 Naming the Ache — pill set + inline acknowledgment

**Files:**
- Modify: `mobile/app/onboarding/step-2.tsx` (full rewrite of pill data, toggle logic, and the toast → inline ack card)

**Interfaces:**
- Consumes: `setOnboardingData` from `@/lib/onboardingStore` (existing, takes `Partial<OnboardingData>`), specifically `painPoints: string[]` (existing field, unchanged shape — now populated from a 4-item pill set instead of 9).
- Produces: nothing consumed by later tasks in this plan (S3 does not read `painPoints`).

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `mobile/app/onboarding/step-2.tsx` with:

```tsx
// Screen 2: Naming the Ache
import React, { useState } from 'react';
import {
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

interface Ache {
  id: string;
  label: string;
  ack: string;
}

const ACHES: Ache[] = [
  { id: 'burnout', label: 'Burned out', ack: 'That takes more out of you than people know.' },
  { id: 'direction', label: 'Seeking direction', ack: "Not knowing which way to face is its own kind of tired." },
  { id: 'restless', label: "Mind won't settle", ack: "A mind that won't settle is asking for rhythm, not more effort." },
  { id: 'reconnect', label: 'Want to reconnect with myself', ack: "You can't be far from something that lives in you." },
];

const DEFAULT_ACK = 'Take your time. Nothing here is graded.';

export default function Screen2() {
  const [selected, setSelected] = useState<string[]>([]);
  const [lastAche, setLastAche] = useState<string | null>(null);

  function toggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
    setLastAche(id);
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const labels = ACHES.filter((a) => selected.includes(a.id)).map((a) => a.label);
    setOnboardingData({ painPoints: labels });
    router.push('/onboarding/step-3');
  }

  const ackText = selected.length === 0
    ? DEFAULT_ACK
    : ACHES.find((a) => a.id === lastAche)?.ack ?? DEFAULT_ACK;

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-6 px-8 pt-8 pb-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            What are you{'\n'}carrying today?
          </Text>
          <Text className="text-center font-body text-[15px] text-ob-muted">Choose everything that feels true right now.</Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {ACHES.map((ache, i) => {
            const active = selected.includes(ache.id);
            return (
              <Animated.View key={ache.id} entering={FadeInDown.delay(i * 70 + 200).duration(380)}>
                <Pressable
                  onPress={() => toggle(ache.id)}
                  className={`flex-row items-center justify-center gap-2.5 rounded-[14px] border px-[22px] py-4 mb-1 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                >
                  {active && (
                    <Animated.Text entering={ZoomIn.duration(200)} className="text-xs text-ob-saffron">
                      ✦
                    </Animated.Text>
                  )}
                  <Text className={`text-center font-body-medium text-[15px] ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                    {ache.label}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          key={lastAche ?? 'default'}
          entering={FadeIn.duration(400)}
          className="w-full max-w-[360px] items-center gap-2 px-4"
        >
          <View className="h-px w-[30px] bg-ob-gold" />
          <Text className="text-center font-headline text-[19px] leading-[26px] text-ob-text">
            {ackText}
          </Text>
        </Animated.View>

        <View className="h-[80px]" />
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11">
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            selected.length === 0 ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: no new errors referencing `app/onboarding/step-2.tsx`.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/step-2.tsx
git commit -m "$(cat <<'EOF'
Rework onboarding S2 to 4-pill ache set with inline acknowledgment

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: S3 Where It Lives — grid layout + Sacred Timing teaser

**Files:**
- Modify: `mobile/app/onboarding/step-3.tsx` (full rewrite of the chip layout and the "Noted" card)

**Interfaces:**
- Consumes: `setOnboardingData` for `guidanceContext: string[]` (existing field, unchanged shape and existing `CONTEXTS` label set).
- Produces: nothing consumed by later tasks in this plan. Note for a future Act II sub-project: `guidanceContext` is the field S14's "Sacred Timing, Revealed" payoff will read — no action needed now, just don't rename this field later without updating that future spec.

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `mobile/app/onboarding/step-3.tsx` with:

```tsx
// Screen 3: Where It Lives
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { setOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const CONTEXTS = [
  'Work',
  'Family',
  'Relationship',
  'Spiritual practice',
  'Identity / purpose',
  'Money / stability',
  'Health / energy',
  'I am not sure',
];

const NOT_SURE = 'I am not sure';

function buildContextLine(selected: string[]): string {
  if (selected.length === 0) {
    return "Choose where it shows up. There's a right window for what you're carrying — Mihira can find it.";
  }
  const words = selected.filter((c) => c !== NOT_SURE).map((c) => c.toLowerCase());
  if (words.length === 0) {
    return "There's a right window for what you're carrying. We'll need your birth rhythm to find it.";
  }
  const phrase = words.length > 1 ? `${words[0]} and ${words[1]}` : words[0];
  return `There's a right window for what you're carrying in ${phrase}. We'll need your birth rhythm to find it.`;
}

export default function Screen3() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  }

  function proceed() {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ guidanceContext: selected });
    router.push('/onboarding/step-4');
  }

  const contextLine = buildContextLine(selected);

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <View className="flex-1 items-center gap-8 px-8 pt-8">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            Where is this{'\n'}showing up?
          </Text>
          <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
            This helps Mihira respond to your real situation.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] flex-row flex-wrap justify-between gap-y-3">
          {CONTEXTS.map((item, index) => {
            const active = selected.includes(item);
            return (
              <Animated.View
                key={item}
                entering={FadeInDown.delay(index * 70 + 180).duration(400)}
                className="w-[48%]"
              >
                <Pressable
                  onPress={() => toggle(item)}
                  className={`flex-row items-center justify-center gap-2 rounded-full border px-4 py-3 ${
                    active
                      ? 'border-ob-saffron-border bg-ob-saffron-dim'
                      : 'border-ob-card-border bg-ob-card'
                  }`}
                >
                  {active ? (
                    <Animated.Text entering={ZoomIn.duration(180)} className="text-[11px] text-ob-saffron">
                      ✦
                    </Animated.Text>
                  ) : null}
                  <Text
                    numberOfLines={2}
                    className={`text-center font-body-medium text-[13px] ${active ? 'text-ob-text' : 'text-ob-muted'}`}
                  >
                    {item}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          entering={FadeIn.duration(400)}
          className="w-full max-w-[360px] gap-2 rounded-[20px] border border-ob-gold-border bg-ob-gold-dim p-4"
        >
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-ob-gold">
            Sacred timing · for later
          </Text>
          <Text className="font-body text-[14px] leading-[21px] text-ob-text">
            {contextLine}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(620).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            selected.length === 0 ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: no new errors referencing `app/onboarding/step-3.tsx`.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/step-3.tsx
git commit -m "$(cat <<'EOF'
Add Sacred Timing teaser and 2-col grid to onboarding S3

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: S4 Name — sages copy addition

**Files:**
- Modify: `mobile/app/onboarding/step-4.tsx:64-71`

**Interfaces:** None — pure JSX insertion, no state/props affected. `userName` persistence and routing to `step-5` unchanged.

- [ ] **Step 1: Insert the new paragraph**

In `mobile/app/onboarding/step-4.tsx`, replace:

```tsx
          <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-3.5">
            <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
              What should Mihira{'\n'}call you?
            </Text>
            <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
              A first name or nickname is enough.
            </Text>
          </Animated.View>
```

with:

```tsx
          <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-3.5">
            <Text className="text-center font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
              What should Mihira{'\n'}call you?
            </Text>
            <Text className="text-center font-body text-[15px] leading-[23px] text-ob-muted">
              A first name or nickname is enough.
            </Text>
            <Text className="max-w-[300px] text-center font-body text-[13px] leading-[20px] text-ob-muted">
              Sages rarely used a person's given name — they used the name of what the person was becoming. We'll start with what you're called now.
            </Text>
          </Animated.View>
```

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: no new errors referencing `app/onboarding/step-4.tsx`.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/step-4.tsx
git commit -m "$(cat <<'EOF'
Add sages framing copy to onboarding S4 name screen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: S5 Ask Saarthi — CTA copy, disclaimer, and route to S6

**Files:**
- Modify: `mobile/app/onboarding/step-5.tsx:173-208`

**Interfaces:**
- Produces: this is the last edit before Task 6 exists — after this task, `step-5.tsx` routes to `/onboarding/step-5b`, a file that does not exist yet. This is expected; Task 6 creates it immediately after. If executed by separate subagents, Task 6 must run before this route is exercised in a running app.

- [ ] **Step 1: Replace the bottom action block**

In `mobile/app/onboarding/step-5.tsx`, replace:

```tsx
        <Animated.View entering={FadeInUp.delay(520).duration(500)} className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11">
          <Pressable
            disabled={!question.trim() || loading}
            onPress={() => {
              if (answered) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding/step-6');
                return;
              }
              void handleSubmit();
            }}
            className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
              !question.trim() || loading ? 'opacity-[0.35]' : ''
            }`}
            style={({ pressed }) => [
              onboardingButtonShadow,
              pressed && pressedButtonStyle,
            ]}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              {answered ? 'Make this more personal →' : 'Ask Saarthi →'}
            </Text>
          </Pressable>

          {answered ? (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAnswered(false);
              }}
              className="mt-3"
            >
              <Text className="text-center font-body text-sm text-ob-muted">Ask another question</Text>
            </Pressable>
          ) : null}
        </Animated.View>
```

with:

```tsx
        <Animated.View entering={FadeInUp.delay(520).duration(500)} className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11">
          {answered ? (
            <Text className="mb-4 max-w-[320px] text-center font-body text-[12px] leading-[18px] text-ob-muted">
              This used only your words. Give it your birth rhythm, and the same question gets a sharper answer.
            </Text>
          ) : null}

          <Pressable
            disabled={!question.trim() || loading}
            onPress={() => {
              if (answered) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding/step-5b');
                return;
              }
              void handleSubmit();
            }}
            className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
              !question.trim() || loading ? 'opacity-[0.35]' : ''
            }`}
            style={({ pressed }) => [
              onboardingButtonShadow,
              pressed && pressedButtonStyle,
            ]}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              {answered ? 'Give it my birth rhythm →' : 'Ask Saarthi →'}
            </Text>
          </Pressable>

          {answered ? (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAnswered(false);
              }}
              className="mt-3"
            >
              <Text className="text-center font-body text-sm text-ob-muted">Ask another question</Text>
            </Pressable>
          ) : null}
        </Animated.View>
```

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: a `router.push('/onboarding/step-5b')` typed-route warning/error is acceptable at this point only if Task 6 has not yet run in the same session — if so, proceed to Task 6 immediately before treating any route-typing error as a real failure. If Task 6 is already done, expect no errors referencing `app/onboarding/step-5.tsx`.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/step-5.tsx
git commit -m "$(cat <<'EOF'
Update onboarding S5 CTA copy and route into new S6 reveal

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: S6 This Is Ask Mihira (new screen)

**Files:**
- Create: `mobile/app/onboarding/step-5b.tsx`

**Interfaces:**
- Consumes: `getOnboardingData()` from `@/lib/onboardingStore` → reads `.firstQuestion: string` (already persisted by `step-5.tsx`'s `handleSubmit`).
- Produces: `router.push('/onboarding/step-6')` on Continue — the existing Act II entry point, unmodified by this plan.

- [ ] **Step 1: Create the file**

Create `mobile/app/onboarding/step-5b.tsx`:

```tsx
// Screen 5b: This Is Ask Mihira
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default function Screen5b() {
  const stored = getOnboardingData();
  const question = stored.firstQuestion.trim();

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/step-6');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />
      <View className="items-center pt-3 pb-1">
        <OnboardingProgress phase="you" />
      </View>

      <View className="flex-1 items-center justify-center gap-8 px-8">
        {question ? (
          <Animated.View
            entering={FadeIn.delay(120).duration(500)}
            className="w-full max-w-[360px] gap-3 rounded-[20px] border border-ob-card-border bg-ob-card p-5"
          >
            <Text
              numberOfLines={2}
              className="max-w-[88%] self-end rounded-[16px] rounded-br border border-ob-saffron-border bg-ob-saffron-dim px-3.5 py-2.5 font-body text-[12px] leading-[18px] text-ob-text"
            >
              {truncate(question, 90)}
            </Text>
            <View className="gap-2">
              <Text className="font-label text-[9px] uppercase tracking-[2px] text-ob-gold">
                What I'm hearing · Scriptural anchor · For today
              </Text>
              <View className="h-[6px] w-[92%] rounded-full bg-white/10" />
              <View className="h-[6px] w-[78%] rounded-full bg-white/10" />
              <View className="h-[6px] w-[58%] rounded-full bg-white/[0.07]" />
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} className="max-w-[320px] items-center gap-3">
          <Text className="font-label text-[11px] uppercase tracking-[2.5px] text-ob-gold">
            A home for this
          </Text>
          <Text className="text-center font-headline text-[32px] leading-[38px] text-ob-text">
            This is called <Text className="text-ob-gold">Ask Mihira</Text>.
          </Text>
          <Text className="text-center font-body text-[14px] leading-[21px] text-ob-muted">
            It's where you just were. Any question, answered from scripture — waiting in the Guidance tab whenever you need it.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={proceed}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Continue →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `cd mobile && npx tsc --noEmit`
Expected: no errors referencing `app/onboarding/step-5b.tsx` or `app/onboarding/step-5.tsx` (the `step-5b` route typed by expo-router's typed routes should now resolve).

- [ ] **Step 3: Commit**

```bash
git add mobile/app/onboarding/step-5b.tsx
git commit -m "$(cat <<'EOF'
Add net-new onboarding S6 'This Is Ask Mihira' reveal screen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: End-to-end manual verification

**Files:** none (verification only, no code changes expected — if this task finds a bug, fix it in the relevant file from Tasks 1–6 and amend that task's commit history with a new small commit, don't reopen this task's checklist).

- [ ] **Step 1: Start the Expo dev server**

Run: `cd mobile && npx expo start` (use the preview tooling to launch and interact — do not just eyeball the code).

- [ ] **Step 2: Walk the full S1→S7 path**

Through the running app (or Expo web/preview), confirm in order:
1. S1 shows the new headline/button copy and routes to S2 on tap.
2. S2 shows exactly 4 pills; tapping a pill updates the acknowledgment line below to that pill's specific ack text; deselecting a pill leaves the ack line showing the last-tapped pill's text (it does not revert to the default until every pill is deselected); with zero pills selected the line reads "Take your time. Nothing here is graded."; Continue is disabled at zero selections.
3. S3 renders the 8 context options in a 2-column layout; the Sacred Timing card's copy changes correctly for 0 selected, 1 selected, and 2+ selected contexts (skip "I am not sure" when building the sentence).
4. S4 shows the new "sages rarely used a given name" paragraph between the headline and the input.
5. S5 behaves as before (ask a real question, get the 3-part canned answer), but the CTA now reads "Give it my birth rhythm →" with the new disclaimer line above it, and pressing it navigates to S6 (not straight to Gender).
6. S6 shows a recap card containing the question actually typed in S5 (not placeholder text) plus the three skeleton bars, then "This is called Ask Mihira.", then Continue routes into the existing S7 (current `step-6.tsx`, Personalization/Gender).
7. The dev back button steps backward correctly through the new `step-5b` screen (i.e. from S7 back-button goes to S6, not skipping it).

- [ ] **Step 3: Report results**

If every check in Step 2 passes, mark this task complete. If any check fails, identify which Task (1–6) owns the broken file, fix it there, re-run `npx tsc --noEmit`, and re-walk the full path from Step 2 before considering the plan done.
