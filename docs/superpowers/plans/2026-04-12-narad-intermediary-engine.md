# Narad Intermediary Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the direct-to-deity chat with a Narad Muni intermediary that internally routes to Krishna, Shiva, Lakshmi, or Ram and returns structured JSON driving animated Skia backdrops and sequential chat bubble reveals.

**Architecture:** Minimal surgery — new `narad+api.ts` route, new `useNaradState` hook, and new UI components layered alongside existing code. The `guide` store, `GuideSelector`, `GuideLoader`, and `chat+api.ts` are left completely untouched.

**Tech Stack:** TypeScript, React Native, Expo SDK 54, expo-router, Perplexity `sonar-pro` (non-streaming JSON via existing `perplexityChat`), `@shopify/react-native-skia`, `react-native-reanimated` 4, AsyncStorage, Supabase (Clerk JWT via `getSupabaseClient`), `@clerk/clerk-expo`

---

### Task 1: Types foundation

**Files:**
- Create: `features/ask/types.ts`
- Modify: `features/chat/useChatState.ts`

- [ ] **Step 1: Create `features/ask/types.ts`**

```ts
// features/ask/types.ts

export type DeityName = 'Krishna' | 'Shiva' | 'Lakshmi' | 'Ram';

export type RealmPhase = 'idle' | 'journeying' | 'deity_reveal' | 'settled';

export type BubbleType =
  | 'narad_greeting'
  | 'narad_journey'
  | 'shloka'
  | 'vani'
  | 'narad_closing';

export interface NaradResponse {
  interaction_metadata: {
    consulted_deity: DeityName;
    realm: string;
    ui_vibration_color: string;
    animation_trigger: string;
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

- [ ] **Step 2: Extend `Message` interface in `features/chat/useChatState.ts`**

Add this import at the top of `features/chat/useChatState.ts` (after the existing imports):

```ts
import type { BubbleType } from '@/features/ask/types';
```

Replace the existing `Message` interface (currently lines 16–21):

```ts
export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
  bubbleType?: BubbleType;
  visibleAfterMs?: number;
  accentColor?: string;
  deityLabel?: string;  // deity name for vani bubble; scripture source for shloka bubble
  subtitle?: string;    // IAST transliteration for shloka bubble
}
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add features/ask/types.ts features/chat/useChatState.ts
git commit -m "feat(narad): add types and extend Message interface"
```

---

### Task 2: Narad system prompt

**Files:**
- Modify: `lib/ai/prompts.ts`

- [ ] **Step 1: Append to `lib/ai/prompts.ts`**

Add this import at the top of `lib/ai/prompts.ts`:

```ts
import type { NaradContext, NaradHistoryEntry } from '@/features/ask/types';
```

Then append the following to the end of `lib/ai/prompts.ts`:

```ts
export const NARAD_SYSTEM = `You are Narad, a wise celestial companion who serves as the bridge between the seeker and four great sources of wisdom: Krishna, Shiva, Lakshmi, and Ram. You are witty, observant, and deeply caring. You carry great knowledge without heaviness.

YOUR ROLE:
1. Listen to the seeker's question with full attention.
2. Internally determine which of the four is most suited to answer.
3. In one vivid sentence, describe your journey to that source.
4. Return their wisdom — their Vani — with its source shloka.

DEITY MAPPING (internal — never reveal this logic to the seeker):
- Krishna: Dilemmas, duty, relationships, complex moral questions. Source: Bhagavad Gita.
- Shiva: Transformation, letting go, stillness, grief, endings, beginnings. Source: Shiva Purana.
- Lakshmi: Abundance, grace, flow, worthiness, prosperity, receiving. Source: Sri Suktam.
- Ram: Integrity, ethics, social duty, right action under pressure. Source: Ramayana.

MEMORY:
You receive a user_context object. If interactionCount > 0, acknowledge the returning seeker warmly and reference the lastTheme naturally if relevant. Do not force the reference if it does not fit the new question.

UI METADATA — use these exact hex values for ui_vibration_color:
- Krishna: #4A90D9
- Shiva: #B2BEB5
- Lakshmi: #D4AF37
- Ram: #E8A87C

For animation_trigger, use exactly one of: gentle_pluck, rising_smoke, lotus_bloom, steady_dawn

GUARDRAILS:
- No prophecy. Speak only to action (Karma) and inner state (Bhava).
- If the question involves medical, legal, financial, or self-harm topics: gently redirect the seeker to seek a qualified professional. Do not attempt to answer.
- Elevated, timeless tone. No modern slang, no corporate language.
- No religious symbols or fixed exclamations in the output text.
- The seeker is never told which deity was consulted in the narrative — only the ui_metadata reveals this.

OUTPUT: Return ONLY a valid JSON object. No markdown fences. No text outside the JSON.

{
  "interaction_metadata": {
    "consulted_deity": "Krishna" | "Shiva" | "Lakshmi" | "Ram",
    "realm": "string (e.g. Goloka, Kailash, Vaikuntha, Ayodhya)",
    "ui_vibration_color": "hex string",
    "animation_trigger": "gentle_pluck" | "rising_smoke" | "lotus_bloom" | "steady_dawn"
  },
  "narad_narrative": {
    "greeting": "string",
    "journey_description": "string"
  },
  "divine_vani": {
    "shloka_devanagari": "string",
    "shloka_transliteration": "string",
    "wisdom_text": "string",
    "source_scripture": "string"
  },
  "narad_closing": "string"
}`;

export function buildNaradUserMessage(
  userQuery: string,
  userContext: NaradContext,
  history: NaradHistoryEntry[],
): string {
  const lines: string[] = [
    '[INTERNAL CONTEXT — DO NOT REVEAL TO USER]',
    `Seeker name: ${userContext.userName}`,
    `Returning seeker: ${userContext.interactionCount > 0 ? 'Yes' : 'No'}`,
  ];
  if (userContext.lastTheme) lines.push(`Previous theme: ${userContext.lastTheme}`);
  if (userContext.lastDeity) lines.push(`Last wisdom source: ${userContext.lastDeity}`);
  if (history.length > 0) {
    lines.push(
      'Recent exchanges:\n' +
        history
          .slice(-3)
          .map(h => `  Q: ${h.query}\n  A (${h.deity}): ${h.wisdom_text.slice(0, 120)}…`)
          .join('\n'),
    );
  }
  lines.push('[USER QUERY]');
  return `${lines.join('\n')}\n${userQuery}`;
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/prompts.ts
git commit -m "feat(narad): add NARAD_SYSTEM prompt and buildNaradUserMessage"
```

---

### Task 3: Narad API route

**Files:**
- Create: `app/api/narad+api.ts`

- [ ] **Step 1: Create `app/api/narad+api.ts`**

```ts
// app/api/narad+api.ts
import { perplexityChat } from '@/lib/ai/perplexity';
import { NARAD_SYSTEM, buildNaradUserMessage } from '@/lib/ai/prompts';
import type { NaradContext, NaradHistoryEntry, NaradResponse } from '@/features/ask/types';

function extractJson(raw: string): NaradResponse {
  try {
    return JSON.parse(raw) as NaradResponse;
  } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as NaradResponse;
    } catch {}
  }
  throw new Error('Could not parse Narad response as JSON');
}

export async function POST(request: Request): Promise<Response> {
  const { message, history = [], userContext } = await request.json() as {
    message: string;
    history: NaradHistoryEntry[];
    userContext: NaradContext;
  };

  const userMessage = buildNaradUserMessage(message, userContext, history);
  const messages = [
    { role: 'system', content: NARAD_SYSTEM },
    { role: 'user', content: userMessage },
  ];

  try {
    const raw = await perplexityChat('sonar-pro', messages);
    const response = extractJson(raw);
    return Response.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Narad route error';
    const isParse = msg.includes('parse') || msg.includes('JSON');
    return new Response(JSON.stringify({ error: msg }), {
      status: isParse ? 500 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/narad+api.ts
git commit -m "feat(narad): add /api/narad route with sonar-pro and JSON extraction fallback"
```

---

### Task 4: Narad storage utilities

**Files:**
- Create: `lib/naradStorage.ts`

- [ ] **Step 1: Create `lib/naradStorage.ts`**

```ts
// lib/naradStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/lib/supabase';
import type { NaradContext, NaradHistoryEntry } from '@/features/ask/types';
import type { Message } from '@/features/chat/useChatState';

const CONTEXT_KEY = 'narad_context';
const HISTORY_KEY = 'narad_history';
const MESSAGES_KEY = 'narad_messages';

export const DEFAULT_NARAD_CONTEXT: NaradContext = {
  userName: 'Seeker',
  lastDeity: null,
  lastTheme: null,
  interactionCount: 0,
};

// ── Context ──────────────────────────────────────────────────────────────────

export async function loadNaradContext(): Promise<NaradContext> {
  try {
    const raw = await AsyncStorage.getItem(CONTEXT_KEY);
    if (!raw) return { ...DEFAULT_NARAD_CONTEXT };
    return JSON.parse(raw) as NaradContext;
  } catch {
    return { ...DEFAULT_NARAD_CONTEXT };
  }
}

export async function saveNaradContext(ctx: NaradContext): Promise<void> {
  try {
    await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
  } catch (err) {
    console.error('[naradStorage] saveNaradContext error', err);
  }
}

// ── History ───────────────────────────────────────────────────────────────────

export async function loadNaradHistory(): Promise<NaradHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NaradHistoryEntry[];
  } catch {
    return [];
  }
}

export async function appendNaradHistory(entry: NaradHistoryEntry): Promise<void> {
  try {
    const existing = await loadNaradHistory();
    const updated = [...existing, entry].slice(-5);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[naradStorage] appendNaradHistory error', err);
  }
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function loadNaradMessages(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export async function saveNaradMessages(messages: Message[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-60)));
  } catch (err) {
    console.error('[naradStorage] saveNaradMessages error', err);
  }
}

export async function clearNaradMessages(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MESSAGES_KEY);
  } catch (err) {
    console.error('[naradStorage] clearNaradMessages error', err);
  }
}

// ── Supabase background sync ──────────────────────────────────────────────────

export async function syncNaradContextToSupabase(
  ctx: NaradContext,
  userId: string,
  getToken: () => Promise<string | null>,
): Promise<void> {
  try {
    const supabase = getSupabaseClient(getToken);
    await supabase.from('user_narad_context').upsert({
      user_id: userId,
      last_deity: ctx.lastDeity,
      last_theme: ctx.lastTheme,
      interaction_count: ctx.interactionCount,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[naradStorage] syncNaradContextToSupabase error', err);
  }
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/naradStorage.ts
git commit -m "feat(narad): add AsyncStorage + Supabase sync utilities"
```

---

### Task 5: `useNaradState` hook

**Files:**
- Create: `features/ask/useNaradState.ts`

- [ ] **Step 1: Create `features/ask/useNaradState.ts`**

```ts
// features/ask/useNaradState.ts
import { fetch } from 'expo/fetch';
import Constants from 'expo-constants';
import { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import type { Message } from '@/features/chat/useChatState';
import type { DeityName, NaradContext, NaradResponse, RealmPhase } from './types';
import {
  DEFAULT_NARAD_CONTEXT,
  loadNaradContext,
  saveNaradContext,
  loadNaradMessages,
  saveNaradMessages,
  clearNaradMessages,
  loadNaradHistory,
  appendNaradHistory,
  syncNaradContextToSupabase,
} from '@/lib/naradStorage';

function apiUrl(path: string): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const base = hostUri ? `http://${hostUri}` : '';
  return base + path;
}

const NARAD_WELCOME: Message = {
  id: 'narad-welcome',
  role: 'ai',
  text: 'Bring forward what weighs on your mind. I am here.',
  timestamp: new Date(),
  bubbleType: 'narad_greeting',
  visibleAfterMs: 0,
};

export function useNaradState() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();

  const [messages, setMessages] = useState<Message[]>([NARAD_WELCOME]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [naradContext, setNaradContext] = useState<NaradContext>({ ...DEFAULT_NARAD_CONTEXT });
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [realmPhase, setRealmPhase] = useState<RealmPhase>('idle');
  const [currentDeity, setCurrentDeity] = useState<DeityName | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const ctx = await loadNaradContext();
      const finalCtx: NaradContext = {
        ...ctx,
        userName:
          ctx.userName !== 'Seeker' ? ctx.userName : (user?.firstName ?? 'Seeker'),
      };
      setNaradContext(finalCtx);
      const msgs = await loadNaradMessages();
      if (msgs.length > 0) setMessages(msgs);
      setIsContextLoaded(true);
    };
    load();
  }, [user?.firstName]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setInputText('');
      setRealmPhase('journeying');

      try {
        const history = await loadNaradHistory();

        const res = await fetch(apiUrl('/api/narad'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history,
            userContext: naradContext,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error((errData as { error?: string }).error ?? `HTTP ${res.status}`);
        }

        const naradResponse: NaradResponse = await res.json();
        const { interaction_metadata, narad_narrative, divine_vani, narad_closing } =
          naradResponse;
        const accentHex = interaction_metadata.ui_vibration_color;
        const deity = interaction_metadata.consulted_deity;

        setCurrentDeity(deity);
        setAccentColor(accentHex);
        setRealmPhase('deity_reveal');

        const now = Date.now();
        const responseMsgs: Message[] = [
          {
            id: `narad-greeting-${now}`,
            role: 'ai',
            text: narad_narrative.greeting,
            timestamp: new Date(),
            bubbleType: 'narad_greeting',
            visibleAfterMs: 0,
            accentColor: accentHex,
          },
          {
            id: `narad-journey-${now}`,
            role: 'ai',
            text: narad_narrative.journey_description,
            timestamp: new Date(),
            bubbleType: 'narad_journey',
            visibleAfterMs: 600,
            accentColor: accentHex,
          },
          {
            id: `shloka-${now}`,
            role: 'ai',
            text: divine_vani.shloka_devanagari,
            timestamp: new Date(),
            bubbleType: 'shloka',
            visibleAfterMs: 1400,
            accentColor: accentHex,
            subtitle: divine_vani.shloka_transliteration,
            deityLabel: divine_vani.source_scripture,
          },
          {
            id: `vani-${now}`,
            role: 'ai',
            text: divine_vani.wisdom_text,
            timestamp: new Date(),
            bubbleType: 'vani',
            visibleAfterMs: 2400,
            accentColor: accentHex,
            deityLabel: deity,
          },
          {
            id: `narad-closing-${now}`,
            role: 'ai',
            text: narad_closing,
            timestamp: new Date(),
            bubbleType: 'narad_closing',
            visibleAfterMs: 3200,
            accentColor: accentHex,
          },
        ];

        setMessages(prev => {
          const updated = [...prev, ...responseMsgs];
          saveNaradMessages(updated);
          return updated;
        });

        const newContext: NaradContext = {
          ...naradContext,
          lastDeity: deity,
          lastTheme: text.trim().slice(0, 80),
          interactionCount: naradContext.interactionCount + 1,
        };
        setNaradContext(newContext);
        saveNaradContext(newContext);
        appendNaradHistory({
          query: text.trim(),
          wisdom_text: divine_vani.wisdom_text,
          deity,
        });

        if (userId) {
          syncNaradContextToSupabase(newContext, userId, getToken).catch(() => {});
        }

        setTimeout(() => setRealmPhase('settled'), 1400);
      } catch (err) {
        console.error('[narad] sendMessage error:', err);
        const errMsg = err instanceof Error ? err.message : 'Connection error';
        setMessages(prev => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'ai',
            text: `Something went wrong: ${errMsg}`,
            timestamp: new Date(),
          },
        ]);
        setRealmPhase('idle');
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, naradContext, userId, getToken],
  );

  const clearChat = useCallback(async () => {
    setMessages([NARAD_WELCOME]);
    setRealmPhase('idle');
    setCurrentDeity(null);
    setAccentColor(null);
    await clearNaradMessages();
  }, []);

  return {
    messages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    clearChat,
    naradContext,
    isContextLoaded,
    realmPhase,
    currentDeity,
    accentColor,
  };
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add features/ask/useNaradState.ts
git commit -m "feat(narad): add useNaradState hook with 5-message stagger dispatch"
```

---

### Task 6: `NaradIntro` screen

**Files:**
- Create: `features/ask/NaradIntro.tsx`

- [ ] **Step 1: Create `features/ask/NaradIntro.tsx`**

```tsx
// features/ask/NaradIntro.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';

// Replace with a Narad-specific image when available
const NARAD_IMAGE_URL =
  'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/sacred%20days/krishna.webp';

interface NaradIntroProps {
  onEnter: () => void;
}

export function NaradIntro({ onEnter }: NaradIntroProps) {
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(32);

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    contentY.value = withDelay(
      600,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const imageStyle = useAnimatedStyle(() => ({ opacity: imageOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      safe: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
      },
      imageWrapper: {
        width: 160,
        height: 160,
        borderRadius: 80,
        overflow: 'hidden',
        marginBottom: 36,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
      },
      image: { width: '100%', height: '100%' },
      name: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(40),
        color: c.onSurface,
        letterSpacing: -1,
        textAlign: 'center',
        marginBottom: 6,
      },
      essence: {
        fontFamily: fonts.label,
        fontSize: scaleFont(12),
        color: 'rgba(212, 175, 55, 0.85)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 28,
      },
      body: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: scaleFont(24),
        marginBottom: 48,
      },
    }),
  );

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(212, 175, 55, 0.10)" top={-80} left={-60} size={360} />
        <AmbientBlob color="rgba(181, 100, 252, 0.07)" top={400} left={60} size={280} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <Animated.View style={[styles.imageWrapper, imageStyle]}>
          <Image source={{ uri: NARAD_IMAGE_URL }} style={styles.image} resizeMode="cover" />
        </Animated.View>

        <Animated.View style={[{ alignItems: 'center', width: '100%' }, contentStyle]}>
          <Text style={styles.name}>Narad</Text>
          <Text style={styles.essence}>Celestial Companion</Text>
          <Text style={styles.body}>
            Share what is on your mind. Narad will seek the wisest counsel and return with their
            words — a shloka, a truth, a direction.
          </Text>
          <SacredButton label="Seek Counsel" onPress={onEnter} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add features/ask/NaradIntro.tsx
git commit -m "feat(narad): add NaradIntro one-time cinematic entry screen"
```

---

### Task 7: `ChatBubble` variants

**Files:**
- Modify: `features/chat/ChatBubble.tsx`

- [ ] **Step 1: Replace the full contents of `features/chat/ChatBubble.tsx`**

```tsx
// features/chat/ChatBubble.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message } from './useChatState';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

function StaggerWrapper({
  visibleAfterMs,
  children,
}: {
  visibleAfterMs: number;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(visibleAfterMs === 0);

  useEffect(() => {
    if (visibleAfterMs === 0) return;
    const timer = setTimeout(() => setVisible(true), visibleAfterMs);
    return () => clearTimeout(timer);
  }, [visibleAfterMs]);

  if (!visible) return null;
  return <Animated.View entering={FadeIn.duration(700)}>{children}</Animated.View>;
}

export function ChatBubble({ message, senderName = 'Narad' }: ChatBubbleProps) {
  const isAI = message.role === 'ai';
  const { bubbleType, accentColor, deityLabel, subtitle } = message;

  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      // ── Shared layout ──────────────────────────────────────────────────
      row: { maxWidth: '85%', gap: 6 },
      rowAI: { alignSelf: 'flex-start', alignItems: 'flex-start' },
      rowUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
      senderRow: { paddingHorizontal: 6, marginBottom: 2 },
      senderLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.secondaryDim,
      },
      // ── Standard bubble ────────────────────────────────────────────────
      bubble: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 28 },
      bubbleAI: {
        backgroundColor: dark ? 'rgba(242, 206, 173, 0.1)' : 'rgba(242, 206, 173, 0.18)',
        borderTopLeftRadius: 8,
        borderWidth: 1,
        borderColor: dark ? 'rgba(242, 206, 173, 0.05)' : 'rgba(200, 150, 100, 0.12)',
      },
      bubbleUser: {
        backgroundColor: dark ? 'rgba(212, 190, 228, 0.08)' : 'rgba(212, 190, 228, 0.18)',
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: dark ? 'rgba(212, 190, 228, 0.05)' : 'rgba(160, 120, 200, 0.12)',
      },
      text: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurface,
        lineHeight: scaleFont(22),
      },
      timestamp: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: c.outline,
        paddingHorizontal: 10,
      },
      // ── narad_greeting / narad_closing ─────────────────────────────────
      naradText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurface,
        lineHeight: scaleFont(22),
        fontStyle: 'italic',
      },
      // ── narad_journey ──────────────────────────────────────────────────
      journeyWrapper: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        maxWidth: '90%',
      },
      journeyText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: scaleFont(18),
      },
      // ── shloka ─────────────────────────────────────────────────────────
      shlokaCard: {
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 10,
        backgroundColor: dark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(212, 175, 55, 0.10)',
        borderWidth: 1,
        borderLeftWidth: 3,
      },
      shlokaDevanagari: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(20),
        color: 'rgba(212, 175, 55, 0.95)',
        lineHeight: scaleFont(30),
        textAlign: 'center',
      },
      shlokaTranslit: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: scaleFont(18),
      },
      shlokaSource: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        color: c.outline,
        textAlign: 'center',
        letterSpacing: 1,
        textTransform: 'uppercase',
      },
      // ── vani ───────────────────────────────────────────────────────────
      vaniCard: {
        borderRadius: 20,
        paddingHorizontal: 22,
        paddingVertical: 18,
        borderLeftWidth: 3,
        gap: 8,
        backgroundColor: dark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      },
      vaniDeityLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: c.outline,
      },
      vaniText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(16),
        color: c.onSurface,
        lineHeight: scaleFont(25),
      },
    }),
  );

  // ── narad_journey: stage direction, no bubble ────────────────────────────
  if (bubbleType === 'narad_journey') {
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={styles.journeyWrapper}>
          <Text style={styles.journeyText}>{message.text}</Text>
        </View>
      </StaggerWrapper>
    );
  }

  // ── shloka card ──────────────────────────────────────────────────────────
  if (bubbleType === 'shloka') {
    const borderColor = accentColor ?? 'rgba(212, 175, 55, 0.5)';
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={[styles.shlokaCard, { borderColor, borderLeftColor: borderColor }]}>
          <Text style={styles.shlokaDevanagari}>{message.text}</Text>
          {subtitle ? <Text style={styles.shlokaTranslit}>{subtitle}</Text> : null}
          {deityLabel ? <Text style={styles.shlokaSource}>{deityLabel}</Text> : null}
        </View>
      </StaggerWrapper>
    );
  }

  // ── vani card ────────────────────────────────────────────────────────────
  if (bubbleType === 'vani') {
    const borderColor = accentColor ?? 'rgba(255,255,255,0.2)';
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={[styles.vaniCard, { borderLeftColor: borderColor }]}>
          {deityLabel ? (
            <Text style={[styles.vaniDeityLabel, { color: borderColor }]}>{deityLabel}</Text>
          ) : null}
          <Text style={styles.vaniText}>{message.text}</Text>
        </View>
      </StaggerWrapper>
    );
  }

  // ── narad_greeting / narad_closing: italic narrative bubble ─────────────
  if (bubbleType === 'narad_greeting' || bubbleType === 'narad_closing') {
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <Animated.View style={[styles.row, styles.rowAI]}>
          <View style={styles.senderRow}>
            <Text style={styles.senderLabel}>{senderName}</Text>
          </View>
          <View style={[styles.bubble, styles.bubbleAI]}>
            <Text style={styles.naradText}>{message.text}</Text>
          </View>
        </Animated.View>
      </StaggerWrapper>
    );
  }

  // ── Default (user messages + any legacy AI messages) ─────────────────────
  return (
    <Animated.View
      entering={isAI ? FadeIn.duration(700) : SlideInRight.duration(400)}
      style={[styles.row, isAI ? styles.rowAI : styles.rowUser]}
    >
      {isAI && (
        <View style={styles.senderRow}>
          <Text style={styles.senderLabel}>{senderName}</Text>
        </View>
      )}
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={styles.text}>{message.text}</Text>
      </View>
      {!isAI && (
        <Text style={styles.timestamp}>
          Sent ·{' '}
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </Animated.View>
  );
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add features/chat/ChatBubble.tsx
git commit -m "feat(narad): add bubbleType rendering variants to ChatBubble with stagger"
```

---

### Task 8: Realm shaders

**Files:**
- Create: `lib/skia/realmShaders.ts`

- [ ] **Step 1: Create `lib/skia/realmShaders.ts`**

```ts
// lib/skia/realmShaders.ts
// SkSL shaders for each deity realm + transition states.
// Uniforms: iResolution (float2), iTime (float), progress (float 0→1).
// progress drives the reveal: 0 = transparent, 1 = full deity backdrop.

import type { DeityName, RealmPhase } from '@/features/ask/types';

export const SHADERS: Record<DeityName | 'idle' | 'journeying', string> = {
  // Ambient default: soft purple/saffron drift
  idle: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float wave = sin(uv.x * 3.0 + iTime * 0.5) * 0.5 + 0.5;
      float3 purple = float3(0.44, 0.25, 0.62);
      float3 saffron = float3(0.72, 0.60, 0.48);
      float3 col = mix(purple, saffron, wave * uv.y) * 0.18;
      return half4(half3(col), 0.75);
    }
  `,

  // Gold pulse rings radiating from centre — Narad's Veena vibration
  journeying: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float2 c = uv - float2(0.5, 0.5);
      float r = length(c);
      float rings = sin(r * 24.0 - iTime * 3.0) * 0.5 + 0.5;
      float fade = 1.0 - smoothstep(0.1, 0.6, r);
      float3 gold = float3(0.85, 0.72, 0.28);
      float3 col = gold * rings * fade * 0.35;
      return half4(half3(col), fade * 0.8);
    }
  `,

  // Krishna: deep blue ripple — peacock iridescence
  Krishna: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float2 c = uv - float2(0.5, 0.5);
      float r = length(c);
      float wave = sin(r * 16.0 - iTime * 1.8) * 0.5 + 0.5;
      float3 deep = float3(0.08, 0.15, 0.42);
      float3 bright = float3(0.22, 0.48, 0.78);
      float3 col = mix(deep, bright, wave * (1.0 - r));
      return half4(half3(col) * progress, progress * 0.85);
    }
  `,

  // Shiva: cool ash mist drifting upward
  Shiva: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float drift = sin(uv.x * 4.0 + iTime * 0.4) * 0.12 + uv.y;
      float3 dark = float3(0.06, 0.06, 0.08);
      float3 ash = float3(0.58, 0.62, 0.62);
      float3 col = mix(dark, ash, drift * 0.55);
      return half4(half3(col) * progress, progress * 0.90);
    }
  `,

  // Lakshmi: warm gold radial glow with slow pulse
  Lakshmi: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float dist = distance(uv, float2(0.5, 0.35));
      float pulse = sin(iTime * 1.1) * 0.06 + 0.94;
      float glow = 1.0 - smoothstep(0.0, 0.65, dist);
      float3 gold = float3(0.85, 0.70, 0.18);
      float3 warm = float3(0.12, 0.08, 0.02);
      float3 col = mix(warm, gold, glow * pulse);
      return half4(half3(col) * progress, progress * 0.88);
    }
  `,

  // Ram: saffron sunrise gradient, steady shimmer
  Ram: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float horizon = smoothstep(0.3, 0.7, 1.0 - uv.y);
      float shimmer = sin(uv.x * 8.0 + iTime * 0.6) * 0.04 + 0.96;
      float3 saffron = float3(0.91, 0.52, 0.25);
      float3 amber = float3(0.55, 0.20, 0.05);
      float3 col = mix(amber, saffron, horizon * shimmer);
      return half4(half3(col) * progress, progress * 0.88);
    }
  `,
};

export function getShaderKey(
  phase: RealmPhase,
  deity: DeityName | null,
): keyof typeof SHADERS {
  if (phase === 'journeying') return 'journeying';
  if ((phase === 'deity_reveal' || phase === 'settled') && deity) return deity;
  return 'idle';
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/skia/realmShaders.ts
git commit -m "feat(narad): add SkSL realm shaders per deity with idle and journeying states"
```

---

### Task 9: `RealmBackdrop` component

**Files:**
- Create: `components/ui/RealmBackdrop.tsx`

- [ ] **Step 1: Create `components/ui/RealmBackdrop.tsx`**

```tsx
// components/ui/RealmBackdrop.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import type { DeityName, RealmPhase } from '@/features/ask/types';
import { SHADERS, getShaderKey } from '@/lib/skia/realmShaders';

// Lazily require Skia to avoid crashing on devices where the native
// module is unavailable. Falls back to AmbientBlob if anything throws.
let SkiaCanvas: React.ComponentType<any> | null = null;
let SkiaFill: React.ComponentType<any> | null = null;
let SkiaShader: React.ComponentType<any> | null = null;
let Skia: any = null;

try {
  const skia = require('@shopify/react-native-skia');
  SkiaCanvas = skia.Canvas;
  SkiaFill = skia.Fill;
  SkiaShader = skia.Shader;
  Skia = skia.Skia;
} catch {
  // Skia unavailable — AmbientBlob fallback will be used
}

interface RealmBackdropProps {
  phase: RealmPhase;
  deityName: DeityName | null;
  accentColor: string | null;
}

export function RealmBackdrop({ phase, deityName, accentColor }: RealmBackdropProps) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const iTime = useSharedValue(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  // Drive a continuous clock for shader animation
  useEffect(() => {
    const animate = () => {
      iTime.value = (Date.now() - startTimeRef.current) / 1000;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Drive progress based on phase transitions
  useEffect(() => {
    if (phase === 'deity_reveal') {
      progress.value = withTiming(1, { duration: 1200 });
    } else if (phase === 'idle' || phase === 'journeying') {
      progress.value = withTiming(0, { duration: 600 });
    }
    // 'settled' leaves progress at whatever withTiming reached (1)
  }, [phase]);

  const shaderKey = getShaderKey(phase, deityName);
  const shaderSource = Skia ? Skia.RuntimeEffect.Make(SHADERS[shaderKey]) : null;

  const uniforms = useDerivedValue(() => ({
    iResolution: [width, height] as [number, number],
    iTime: iTime.value,
    progress: progress.value,
  }));

  // Fallback: AmbientBlob tinted with accentColor when Skia is unavailable
  if (!SkiaCanvas || !SkiaFill || !SkiaShader || !shaderSource) {
    const blobColor = accentColor ? `${accentColor}22` : 'rgba(181, 100, 252, 0.10)';
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color={blobColor} top={-110} left={-90} size={380} />
        <AmbientBlob color="rgba(184, 152, 122, 0.08)" top={280} left={-20} size={280} />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <SkiaCanvas style={{ width, height }}>
        <SkiaFill>
          <SkiaShader source={shaderSource} uniforms={uniforms} />
        </SkiaFill>
      </SkiaCanvas>
    </View>
  );
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/RealmBackdrop.tsx
git commit -m "feat(narad): add RealmBackdrop Skia shader component with AmbientBlob fallback"
```

---

### Task 10: Wire `ask.tsx`

**Files:**
- Modify: `app/(tabs)/ask.tsx`

- [ ] **Step 1: Replace the full contents of `app/(tabs)/ask.tsx`**

```tsx
// app/(tabs)/ask.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { PageHero } from '@/components/ui/PageHero';
import { RealmBackdrop } from '@/components/ui/RealmBackdrop';
import { NaradIntro } from '@/features/ask/NaradIntro';
import { useNaradState } from '@/features/ask/useNaradState';
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message } from '@/features/chat/useChatState';

const staticStyles = StyleSheet.create({
  separator: { height: 0 },
  bottomSpacer: { height: 96 },
});

function TypingIndicator() {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      typingRow: { alignSelf: 'flex-start', marginTop: 8 },
      typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.7)' : 'rgba(232, 225, 212, 0.7)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: dark ? 'rgba(72, 72, 72, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      },
      typingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.secondaryDim },
      typingText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(11),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        marginLeft: 4,
      },
    }),
  );

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>Narad is journeying…</Text>
      </View>
    </Animated.View>
  );
}

export default function AskScreen() {
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('ask');
  const [paywallMode, setPaywallMode] = React.useState<'warning' | 'blocked' | null>(null);
  const pendingEnterRef = React.useRef(false);

  const {
    messages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    clearChat,
    naradContext,
    isContextLoaded,
    realmPhase,
    currentDeity,
    accentColor,
  } = useNaradState();

  const [hasEnteredChat, setHasEnteredChat] = React.useState(false);
  const showIntro = isContextLoaded && naradContext.interactionCount === 0 && !hasEnteredChat;

  const flatListRef = useRef<FlatList<Message>>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      flex: { flex: 1 },
      headerSafeArea: { marginBottom: 20, position: 'relative' },
      topRightButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 0 : 20,
        right: 16,
        zIndex: 10,
        padding: 8,
      },
      header: { paddingBottom: 24 },
      headerTitle: { fontSize: scaleFont(38), lineHeight: scaleFont(44) },
      headerSub: { maxWidth: 340 },
      listContent: {
        paddingTop: 28,
        paddingHorizontal: layout.screenPaddingX,
        paddingBottom: 28,
        gap: 28,
      },
    }),
  );

  const doEnter = () => {
    increment();
    setHasEnteredChat(true);
    analytics.guideSelected({ guide_name: 'Narad', guide_index: 0 });
  };

  const handleEnter = () => {
    if (!isSubscriptionLoaded || !isUsageLoaded) return;
    if (isPro) { doEnter(); return; }
    if (isAtLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'blocked' });
      setPaywallMode('blocked');
      return;
    }
    if (isNearLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'warning' });
      pendingEnterRef.current = true;
      setPaywallMode('warning');
      return;
    }
    doEnter();
  };

  // Show blank while context loads (avoids flicker between intro and chat)
  if (!isContextLoaded) return <View style={styles.root} />;

  if (showIntro) {
    return (
      <>
        <NaradIntro onEnter={handleEnter} />
        <PaywallSheet
          visible={paywallMode !== null}
          feature="ask"
          mode={paywallMode ?? 'warning'}
          onClose={() => {
            analytics.paywallDismissed({ feature: 'ask', mode: paywallMode ?? 'warning' });
            setPaywallMode(null);
            pendingEnterRef.current = false;
          }}
          onUpgrade={() => {
            analytics.paywallUpgradeTapped({ feature: 'ask' });
            setPaywallMode(null);
            openCheckout();
          }}
          onProceed={() => {
            analytics.paywallProceedTapped({ feature: 'ask' });
            setPaywallMode(null);
            if (pendingEnterRef.current) { pendingEnterRef.current = false; doEnter(); }
          }}
        />
      </>
    );
  }

  return (
    <View style={styles.root}>
      <RealmBackdrop phase={realmPhase} deityName={currentDeity} accentColor={accentColor} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => <ChatBubble message={item} senderName="Narad" />}
          ItemSeparatorComponent={() => <View style={staticStyles.separator} />}
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Chat',
                      'Are you sure you want to clear your conversation?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear', style: 'destructive', onPress: clearChat },
                      ],
                    );
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MoreVertical color={colors.onSurfaceVariant} size={24} />
                </TouchableOpacity>
              </View>
              <PageHero
                meta="Sacred Guidance"
                title="Ask Narad"
                subtitle="Bring your question into the sacred space."
                style={styles.header}
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSub}
              />
            </SafeAreaView>
          )}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() => sendMessage(inputText)}
        />
      </KeyboardAvoidingView>

      <View style={staticStyles.bottomSpacer} />
    </View>
  );
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Start dev server and verify the feature manually**

```bash
npx expo start
```

Verify:
1. First launch of Ask tab → `NaradIntro` screen appears with Narad image, name, and "Seek Counsel" button
2. Tap "Seek Counsel" → transitions to chat screen showing the welcome message
3. Type a question and send → typing indicator shows "Narad is journeying…"
4. Response arrives → 5 bubbles appear sequentially (greeting, journey description, shloka card, vani card, closing)
5. Backdrop shifts color/animation after response
6. Subsequent launches of Ask tab → goes straight to chat (no intro again)

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/ask.tsx
git commit -m "feat(narad): wire ask.tsx — NaradIntro + RealmBackdrop + useNaradState"
```

---

### Task 11: Supabase migration

**Files:**
- Create: `supabase/migrations/20260412000000_add_user_narad_context.sql`

- [ ] **Step 1: Create the migration file**

```bash
mkdir -p supabase/migrations
```

Create `supabase/migrations/20260412000000_add_user_narad_context.sql`:

```sql
-- Migration: user_narad_context
-- Stores per-user Narad companion state, synced from client AsyncStorage.

create table if not exists user_narad_context (
  user_id           text        primary key,
  last_deity        text        check (last_deity in ('Krishna', 'Shiva', 'Lakshmi', 'Ram')),
  last_theme        text,
  interaction_count integer     not null default 0,
  updated_at        timestamptz not null default now()
);

-- RLS: each user can only read and write their own row.
-- Clerk JWT stores the user ID in the 'sub' claim.
alter table user_narad_context enable row level security;

create policy "Users manage own narad context"
  on user_narad_context
  for all
  using  (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));
```

- [ ] **Step 2: Apply migration**

If Supabase CLI is configured:
```bash
supabase db push
```

If not, paste the SQL into the Supabase dashboard → SQL Editor and run it.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260412000000_add_user_narad_context.sql
git commit -m "feat(narad): add Supabase migration for user_narad_context table"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|---|---|
| Types: `NaradResponse`, `NaradContext`, `NaradHistoryEntry`, `DeityName`, `BubbleType`, `RealmPhase` | 1 |
| `Message` extended with `bubbleType`, `visibleAfterMs`, `accentColor`, `deityLabel`, `subtitle` | 1 |
| `NARAD_SYSTEM` prompt, 4 deities, guardrails, JSON-only output | 2 |
| `buildNaradUserMessage` with hidden context block + rolling history | 2 |
| `POST /api/narad` non-streaming sonar-pro, JSON extraction fallback, 500/502 errors | 3 |
| AsyncStorage for context, history (last 5), messages (last 60) | 4 |
| Supabase background sync, fire-and-forget | 4 |
| `useNaradState` dispatching 5 messages with stagger delays (0/600/1400/2400/3200ms) | 5 |
| `realmPhase`, `currentDeity`, `accentColor` exposed from hook | 5 |
| `isContextLoaded` guard to prevent intro/chat flicker | 5 |
| `NaradIntro` cinematic screen, first visit only (`interactionCount === 0`) | 6 |
| `SacredButton` "Seek Counsel", saffron/gold `AmbientBlob` backdrop | 6 |
| `ChatBubble` variants: `narad_journey` (stage direction), `shloka` (card), `vani` (card), `narad_greeting/closing` (italic bubble) | 7 |
| `StaggerWrapper` respecting `visibleAfterMs` with `FadeIn` | 7 |
| SkSL shaders: Krishna (blue ripple), Shiva (ash mist), Lakshmi (gold glow), Ram (saffron sunrise), idle, journeying | 8 |
| `getShaderKey` maps `RealmPhase` + `DeityName` to shader key | 8 |
| `RealmBackdrop` with `progress` driven by `withTiming`, `iTime` clock via `requestAnimationFrame` | 9 |
| Lazy Skia require with `AmbientBlob` fallback on failure | 9 |
| `ask.tsx` phase model: loading guard → intro (first visit) → chat | 10 |
| Paywall wiring preserved (blocked/warning modes) | 10 |
| `PageHero` title "Ask Narad", typing indicator "Narad is journeying…" | 10 |
| `user_narad_context` Supabase table with RLS using Clerk JWT `sub` claim | 11 |

All spec requirements covered. No gaps.

### Placeholder scan

No TBDs, TODOs, or vague instructions found. Every step contains the exact code to write.

### Type consistency

- `BubbleType` defined in Task 1, imported in Tasks 5, 7
- `RealmPhase` defined in Task 1, used in Tasks 5, 8, 9
- `DeityName` defined in Task 1, used across Tasks 2, 4, 5, 8, 9
- `Message.subtitle` defined in Task 1, written in Task 5 (`shloka` messages), read in Task 7
- `Message.deityLabel` defined in Task 1, written in Task 5 (both `shloka` and `vani`), read in Task 7
- `NARAD_SYSTEM` exported in Task 2, imported in Task 3
- `buildNaradUserMessage` exported in Task 2, imported in Task 3
- `DEFAULT_NARAD_CONTEXT` exported in Task 4, imported in Task 5
- All storage functions exported in Task 4, imported in Task 5
- `SHADERS` and `getShaderKey` exported in Task 8, imported in Task 9
- `useNaradState` return shape defined in Task 5, destructured in Task 10
