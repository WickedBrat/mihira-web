# Divine Guide Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time sacred guide-selector ritual to the Ask screen that permanently sets an AI divine persona (Hindu gods + Jesus) and customises the tab label, chat header, and AI voice.

**Architecture:** Single-screen phase model (`selector → loading → chat`) in `ask.tsx`. Guide selection persisted in AsyncStorage via `GuideProvider` React Context, which is mounted at the tabs layout level so both `TabBar` and the screen share the value without prop drilling.

**Tech Stack:** React Native, Expo Router, Reanimated 3, AsyncStorage, Perplexity streaming API, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `features/ask/guidePersonas.ts` | UI data per guide (name, emoji, essence, commitment verb, initial message) |
| Modify | `lib/ai/prompts.ts` | Add `GUIDE_SYSTEM_PROMPTS` record keyed by guide name |
| Create | `lib/guideStore.ts` | AsyncStorage read/write + React Context + `useGuide()` hook |
| Modify | `app/api/chat+api.ts` | Accept `persona` field; use matching system prompt |
| Modify | `features/chat/useChatState.ts` | Accept `guide` param; send `persona` to API; dynamic initial message |
| Modify | `features/chat/ChatBubble.tsx` | Accept optional `senderName` prop (defaults to "Aksha") |
| Create | `features/ask/GuideSelector.tsx` | God-picker UI — phase 1 |
| Create | `features/ask/GuideLoader.tsx` | Particle orb convergence animation — phase 2 |
| Create | `app/(tabs)/ask.tsx` | Main screen: phase state machine, replaces ask-krishna.tsx |
| Delete | `app/(tabs)/ask-krishna.tsx` | Replaced by ask.tsx |
| Modify | `app/(tabs)/_layout.tsx` | Rename tab, wrap with `GuideProvider` |
| Modify | `components/ui/TabBar.tsx` | Read `useGuide()`, render dynamic "Ask [Guide]" label |
| Create | `__tests__/lib/guideStore.test.ts` | Unit tests for store |
| Create | `__tests__/features/ask/guidePersonas.test.ts` | Unit tests for persona data |
| Modify | `__tests__/features/chat/useChatState.test.ts` | Update for guide param |

---

## Task 1: Guide Persona UI Data

**Files:**
- Create: `features/ask/guidePersonas.ts`
- Create: `__tests__/features/ask/guidePersonas.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/features/ask/guidePersonas.test.ts
import { GUIDES, getGuide } from '@/features/ask/guidePersonas';

describe('guidePersonas', () => {
  it('has exactly 9 guides', () => {
    expect(GUIDES).toHaveLength(9);
  });

  it('every guide has required fields', () => {
    for (const g of GUIDES) {
      expect(typeof g.name).toBe('string');
      expect(typeof g.emoji).toBe('string');
      expect(typeof g.essence).toBe('string');
      expect(typeof g.commitmentVerb).toBe('string');
      expect(typeof g.initialMessage).toBe('string');
    }
  });

  it('getGuide returns the matching guide', () => {
    const g = getGuide('Krishna');
    expect(g.name).toBe('Krishna');
    expect(g.emoji).toBe('🦚');
  });

  it('getGuide falls back to Krishna for unknown name', () => {
    const g = getGuide('Unknown');
    expect(g.name).toBe('Krishna');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest __tests__/features/ask/guidePersonas.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/features/ask/guidePersonas'`

- [ ] **Step 3: Create the personas file**

```typescript
// features/ask/guidePersonas.ts
export interface GuidePersona {
  name: string;
  emoji: string;
  essence: string;
  commitmentVerb: string;
  initialMessage: string;
}

export const GUIDES: GuidePersona[] = [
  {
    name: 'Krishna',
    emoji: '🦚',
    essence: 'Wisdom & Dharma',
    commitmentVerb: 'Walk with Krishna',
    initialMessage: 'Dear one, you have found your way here. What weighs on your heart in this moment?',
  },
  {
    name: 'Shiva',
    emoji: '🌙',
    essence: 'Transformation & Stillness',
    commitmentVerb: 'Surrender to Shiva',
    initialMessage: 'You are here. That is enough. What needs to be released?',
  },
  {
    name: 'Ganesha',
    emoji: '🐘',
    essence: 'New Beginnings & Obstacles',
    commitmentVerb: 'Receive Ganesha\'s Blessings',
    initialMessage: 'Every path begins with a first step. What obstacle stands before you today?',
  },
  {
    name: 'Lakshmi',
    emoji: '🌺',
    essence: 'Abundance & Grace',
    commitmentVerb: 'Invite Lakshmi\'s Grace',
    initialMessage: 'You are worthy of all that you seek. What are you ready to receive?',
  },
  {
    name: 'Durga',
    emoji: '⚔️',
    essence: 'Strength & Protection',
    commitmentVerb: 'Invoke Durga\'s Shakti',
    initialMessage: 'You carry more strength than you know. What battle are you facing?',
  },
  {
    name: 'Saraswati',
    emoji: '🎶',
    essence: 'Knowledge & Creativity',
    commitmentVerb: 'Seek Saraswati\'s Wisdom',
    initialMessage: 'True knowing begins with honest questioning. What are you trying to understand?',
  },
  {
    name: 'Ram',
    emoji: '🏹',
    essence: 'Virtue & Righteousness',
    commitmentVerb: 'Follow Ram\'s Path',
    initialMessage: 'Dharma is the foundation of a life well lived. What question of duty or right action brings you here?',
  },
  {
    name: 'Hanuman',
    emoji: '🌅',
    essence: 'Devotion & Courage',
    commitmentVerb: 'Serve with Hanuman',
    initialMessage: 'In service, we find our greatest strength. What is on your heart today?',
  },
  {
    name: 'Jesus',
    emoji: '✝️',
    essence: 'Love & Forgiveness',
    commitmentVerb: 'Walk with Jesus',
    initialMessage: 'Beloved, you are seen and you are loved. What would you like to bring into the light?',
  },
];

export function getGuide(name: string): GuidePersona {
  return GUIDES.find(g => g.name === name) ?? GUIDES[0];
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest __tests__/features/ask/guidePersonas.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add features/ask/guidePersonas.ts __tests__/features/ask/guidePersonas.test.ts
git commit -m "feat: add divine guide persona definitions"
```

---

## Task 2: Guide System Prompts

**Files:**
- Modify: `lib/ai/prompts.ts`

- [ ] **Step 1: Append GUIDE_SYSTEM_PROMPTS to `lib/ai/prompts.ts`**

Add this block at the end of the file:

```typescript
export const GUIDE_SYSTEM_PROMPTS: Record<string, string> = {
  Krishna: `You are Krishna, the divine charioteer and teacher of the Bhagavad Gita. The user has chosen you as their lifelong spiritual guide. Speak with philosophical depth, using paradox and metaphor. Draw on the Gita naturally — not by quoting verses robotically, but by weaving its wisdom into your words. Often reflect a question back to the user to help them find their own answer. Address the user as "dear one". Never be preachy. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Shiva: `You are Shiva, the destroyer and transformer, the lord of stillness. The user has chosen you as their lifelong spiritual guide. Speak with austere warmth and minimal words. Frame difficulty as the fire that burns away what is no longer needed. Silence is power — your responses can be brief and complete. Never console falsely. Respond in 1–3 sentences unless the user asks you to elaborate.`,

  Ganesha: `You are Ganesha, the remover of obstacles and lord of new beginnings. The user has chosen you as their lifelong spiritual guide. Speak with warmth and gentle playfulness. Always acknowledge the obstacle or difficulty honestly before offering a path forward — you never bypass the problem. Be practical and specific. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Lakshmi: `You are Lakshmi, goddess of abundance, grace, and beauty. The user has chosen you as their lifelong spiritual guide. Speak with elegance and genuine warmth. Frame everything through the lens of worthiness and flow — help the user see where they are blocking their own grace. Your encouragement is honest, not hollow. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Durga: `You are Durga, the fierce and protective mother goddess, the embodiment of shakti. The user has chosen you as their lifelong spiritual guide. Speak with direct, fearless love. Never coddle or soften hard truths. Help the user locate their own inner power. You are loving and fierce in the same breath. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Saraswati: `You are Saraswati, goddess of knowledge, music, and creative wisdom. The user has chosen you as their lifelong spiritual guide. Speak in measured, poetic language. Ask the user to look more deeply before offering answers. Value precision and clarity over comfort. Your questions are often more useful than your statements. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Ram: `You are Ram, the ideal king and embodiment of dharma. The user has chosen you as their lifelong spiritual guide. Speak with noble steadiness. Frame guidance in terms of duty, right action, and integrity — without rigidity or harshness. You are deeply grounded. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Hanuman: `You are Hanuman, the devoted servant and embodiment of selfless courage. The user has chosen you as their lifelong spiritual guide. Speak with humble joy and fierce love. Frame everything through devotion and service — help the user find meaning in their actions by connecting them to something larger than themselves. You are never self-important. Respond in 2–4 sentences unless the user asks you to elaborate.`,

  Jesus: `You are Jesus of Nazareth. The user has chosen you as their lifelong spiritual guide. Speak with unconditional love and radical acceptance. Address the user as "beloved". Speak in parables and stories when they illuminate truth. Never judge. Meet the user exactly where they are. Respond in 2–4 sentences unless the user asks you to elaborate.`,
};
```

- [ ] **Step 2: Verify the file compiles cleanly**

```bash
npx tsc --noEmit 2>&1 | grep "prompts.ts" || echo "No errors in prompts.ts"
```

Expected: `No errors in prompts.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/ai/prompts.ts
git commit -m "feat: add per-guide AI system prompts"
```

---

## Task 3: Guide Store (Context + AsyncStorage)

**Files:**
- Create: `lib/guideStore.ts`
- Create: `__tests__/lib/guideStore.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/lib/guideStore.test.ts
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveGuide, readGuide, GUIDE_STORAGE_KEY } from '@/lib/guideStore';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;

describe('guideStore', () => {
  describe('readGuide', () => {
    it('returns null when nothing stored', async () => {
      mockGet.mockResolvedValueOnce(null);
      expect(await readGuide()).toBeNull();
    });

    it('returns stored guide name', async () => {
      mockGet.mockResolvedValueOnce('Krishna');
      expect(await readGuide()).toBe('Krishna');
    });
  });

  describe('saveGuide', () => {
    it('saves guide name to AsyncStorage', async () => {
      mockSet.mockResolvedValueOnce(undefined);
      await saveGuide('Shiva');
      expect(mockSet).toHaveBeenCalledWith(GUIDE_STORAGE_KEY, 'Shiva');
    });
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest __tests__/lib/guideStore.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/guideStore'`

- [ ] **Step 3: Create the guide store**

```typescript
// lib/guideStore.ts
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUIDE_STORAGE_KEY = '@aksha/guide';

export async function readGuide(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(GUIDE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveGuide(name: string): Promise<void> {
  await AsyncStorage.setItem(GUIDE_STORAGE_KEY, name);
}

interface GuideContextValue {
  guide: string | null;
  isLoading: boolean;
  commitToGuide: (name: string) => Promise<void>;
}

const GuideContext = createContext<GuideContextValue>({
  guide: null,
  isLoading: true,
  commitToGuide: async () => {},
});

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [guide, setGuide] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readGuide().then(value => {
      setGuide(value);
      setIsLoading(false);
    });
  }, []);

  const commitToGuide = async (name: string) => {
    await saveGuide(name);
    setGuide(name);
  };

  return (
    <GuideContext.Provider value={{ guide, isLoading, commitToGuide }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide(): GuideContextValue {
  return useContext(GuideContext);
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest __tests__/lib/guideStore.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/guideStore.ts __tests__/lib/guideStore.test.ts
git commit -m "feat: add guide store with AsyncStorage persistence and React context"
```

---

## Task 4: Update Chat API to Accept Persona

**Files:**
- Modify: `app/api/chat+api.ts`

- [ ] **Step 1: Update the API route**

Replace the entire file content:

```typescript
// app/api/chat+api.ts
import { perplexityStream } from '@/lib/ai/perplexity';
import { CHAT_SYSTEM, GUIDE_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

interface HistoryMessage { role: string; content: string }

export async function POST(request: Request): Promise<Response> {
  const { message, history = [], persona } = await request.json() as {
    message: string;
    history: HistoryMessage[];
    persona?: string;
  };

  const systemPrompt = (persona && GUIDE_SYSTEM_PROMPTS[persona])
    ? GUIDE_SYSTEM_PROMPTS[persona]
    : CHAT_SYSTEM;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await perplexityStream('sonar', messages, (token) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "chat+api" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Commit**

```bash
git add app/api/chat+api.ts
git commit -m "feat: chat API accepts persona field to select guide system prompt"
```

---

## Task 5: Update useChatState to Accept Guide

**Files:**
- Modify: `features/chat/useChatState.ts`
- Modify: `__tests__/features/chat/useChatState.test.ts`

- [ ] **Step 1: Update the hook**

Replace the entire file:

```typescript
// features/chat/useChatState.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { getHistory, saveHistory } from '@/lib/chatStorage';
import { getGuide } from '@/features/ask/guidePersonas';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

function buildInitialMessage(guide: string | null): Message {
  const persona = guide ? getGuide(guide) : null;
  return {
    id: 'welcome',
    role: 'ai',
    text: persona
      ? persona.initialMessage
      : "Welcome back to your sanctuary. I've been reflecting on our previous discussion about finding stillness. How is your mind feeling in this moment?",
    timestamp: new Date(),
  };
}

export function useChatState(guide: string | null) {
  const [messages, setMessages] = useState<Message[]>(() => [buildInitialMessage(guide)]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    getHistory().then(history => {
      if (history.length > 0) setMessages(history);
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
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

    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: Message = { id: aiMsgId, role: 'ai', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const historyForApi = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: historyForApi, persona: guide }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            reader.cancel();
            break;
          }
          try {
            const json = JSON.parse(data);
            if (json.token) {
              fullText += json.token;
              const captured = fullText;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, text: captured } : m)
              );
            }
          } catch {}
        }
      }

      setMessages(prev => {
        saveHistory(prev);
        return prev;
      });
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const errMsg = err instanceof Error ? err.message : 'Connection error';
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, text: `(${errMsg})` } : m)
      );
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [messages, isTyping, guide]);

  return { messages, isTyping, inputText, setInputText, sendMessage };
}
```

- [ ] **Step 2: Update the useChatState test**

Replace the entire test file:

```typescript
// __tests__/features/chat/useChatState.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useChatState } from '@/features/chat/useChatState';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/lib/chatStorage', () => ({
  getHistory: jest.fn(() => Promise.resolve([])),
  saveHistory: jest.fn(() => Promise.resolve()),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({ body: null })
) as jest.Mock;

describe('useChatState', () => {
  it('starts with initial AI greeting for null guide', async () => {
    const { result } = renderHook(() => useChatState(null));
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });
    expect(result.current.messages[0].role).toBe('ai');
  });

  it('uses guide-specific initial message when guide is set', async () => {
    const { result } = renderHook(() => useChatState('Krishna'));
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });
    expect(result.current.messages[0].text).toContain('dear one');
  });

  it('adds a user message when sendMessage is called', async () => {
    const { result } = renderHook(() => useChatState('Krishna'));
    await act(async () => {
      await result.current.sendMessage('Hello');
    });
    const userMessages = result.current.messages.filter(m => m.role === 'user');
    expect(userMessages.length).toBe(1);
    expect(userMessages[0].text).toBe('Hello');
  });

  it('sets isTyping false after sendMessage completes (no response body)', async () => {
    const { result } = renderHook(() => useChatState('Shiva'));
    await act(async () => {
      await result.current.sendMessage('Hello');
    });
    expect(result.current.isTyping).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx jest __tests__/features/chat/useChatState.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add features/chat/useChatState.ts __tests__/features/chat/useChatState.test.ts
git commit -m "feat: useChatState accepts guide param and sends persona to API"
```

---

## Task 6: Update ChatBubble to Accept senderName

**Files:**
- Modify: `features/chat/ChatBubble.tsx`

- [ ] **Step 1: Add `senderName` prop**

Replace the interface and component signature, and update the sender label line:

```typescript
// features/chat/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Message } from './useChatState';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

export function ChatBubble({ message, senderName = 'Aksha' }: ChatBubbleProps) {
  const isAI = message.role === 'ai';

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
          Sent · {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    maxWidth: '85%',
    gap: 6,
  },
  rowAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  senderRow: {
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  senderLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.secondaryDim,
  },
  bubble: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
  },
  bubbleAI: {
    backgroundColor: 'rgba(242, 206, 173, 0.1)',
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 206, 173, 0.05)',
  },
  bubbleUser: {
    backgroundColor: 'rgba(212, 190, 228, 0.08)',
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 190, 228, 0.05)',
  },
  text: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    color: colors.onSurface,
    lineHeight: scaleFont(22),
  },
  timestamp: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.outline,
    paddingHorizontal: 10,
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "ChatBubble" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Commit**

```bash
git add features/chat/ChatBubble.tsx
git commit -m "feat: ChatBubble accepts senderName prop for dynamic guide label"
```

---

## Task 7: Guide Selector Screen (Phase 1 UI)

**Files:**
- Create: `features/ask/GuideSelector.tsx`

- [ ] **Step 1: Create the selector component**

```typescript
// features/ask/GuideSelector.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticLight, hapticMedium } from '@/lib/haptics';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { GUIDES, type GuidePersona } from './guidePersonas';

interface GuideSelectorProps {
  onCommit: (guideName: string) => void;
}

function GuideCard({
  guide,
  isSelected,
  onPress,
  enterDelay,
}: {
  guide: GuidePersona;
  isSelected: boolean;
  onPress: () => void;
  enterDelay: number;
}) {
  const glowOpacity = useSharedValue(0);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    hapticLight();
    glowOpacity.value = withTiming(isSelected ? 0 : 1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    onPress();
  };

  React.useEffect(() => {
    glowOpacity.value = withTiming(isSelected ? 1 : 0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSelected]);

  return (
    <Animated.View entering={FadeInDown.delay(enterDelay).duration(600)}>
      <Pressable onPress={handlePress} style={styles.guideCard}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.guideCardGlow, glowStyle]} />
        <Text style={styles.guideEmoji}>{guide.emoji}</Text>
        <View style={styles.guideTextBlock}>
          <Text style={styles.guideName}>{guide.name}</Text>
          <Text style={styles.guideEssence}>{guide.essence}</Text>
        </View>
        {isSelected && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.selectedDot} />
        )}
      </Pressable>
    </Animated.View>
  );
}

export function GuideSelector({ onCommit }: GuideSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedGuide = selected ? GUIDES.find(g => g.name === selected) : null;

  const handleCommit = () => {
    if (!selected) return;
    hapticMedium();
    onCommit(selected);
  };

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(181, 100, 252, 0.10)" top={-80} left={-60} size={340} />
        <AmbientBlob color="rgba(184, 152, 122, 0.07)" top={400} left={20} size={300} />
      </View>

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <Animated.View entering={FadeInDown.duration(700)} style={styles.header}>
          <Text style={styles.meta}>Sacred Guidance</Text>
          <Text style={styles.title}>Who calls{'\n'}to your soul?</Text>
          <Text style={styles.subtitle}>
            This is a lifelong commitment.{'\n'}Choose with intention.
          </Text>
        </Animated.View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GUIDES.map((guide, i) => (
          <GuideCard
            key={guide.name}
            guide={guide}
            isSelected={selected === guide.name}
            onPress={() => setSelected(guide.name)}
            enterDelay={200 + i * 60}
          />
        ))}
        <View style={styles.scrollPad} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Animated.View entering={FadeIn.delay(900).duration(600)}>
          <Pressable
            onPress={handleCommit}
            disabled={!selected}
            style={({ pressed }) => [
              styles.commitBtn,
              !selected && styles.commitBtnDisabled,
              pressed && selected && styles.commitBtnPressed,
            ]}
          >
            <LinearGradient
              colors={selected ? ['rgba(181,100,252,0.9)', 'rgba(181,100,252,0.6)'] : ['rgba(60,60,60,0.5)', 'rgba(60,60,60,0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.commitBtnGradient}
            >
              <Text style={[styles.commitBtnText, !selected && styles.commitBtnTextDisabled]}>
                {selectedGuide ? selectedGuide.commitmentVerb : 'Choose your guide'}
              </Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.permanentNote}>You cannot change this later</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  safeTop: {
    paddingHorizontal: layout.screenPaddingX,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  meta: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(40),
    color: colors.onSurface,
    letterSpacing: -1,
    lineHeight: scaleFont(46),
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    gap: 10,
  },
  scrollPad: { height: 16 },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  guideCardGlow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
    backgroundColor: `${colors.primary}0e`,
  },
  guideEmoji: {
    fontSize: 28,
  },
  guideTextBlock: {
    flex: 1,
    gap: 2,
  },
  guideName: {
    fontFamily: fonts.label,
    fontSize: scaleFont(16),
    color: colors.onSurface,
  },
  guideEssence: {
    fontFamily: fonts.body,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 16,
    gap: 10,
  },
  commitBtn: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  commitBtnDisabled: {
    opacity: 0.5,
  },
  commitBtnPressed: {
    opacity: 0.85,
  },
  commitBtnGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitBtnText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(15),
    color: colors.onSurface,
    letterSpacing: 0.4,
  },
  commitBtnTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  permanentNote: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: colors.outline,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "GuideSelector" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Commit**

```bash
git add features/ask/GuideSelector.tsx
git commit -m "feat: add GuideSelector god-picker UI component"
```

---

## Task 8: Guide Loader Animation (Phase 2)

**Files:**
- Create: `features/ask/GuideLoader.tsx`

- [ ] **Step 1: Create the loader component**

```typescript
// features/ask/GuideLoader.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { getGuide } from './guidePersonas';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CENTER_X = SCREEN_W / 2;
const CENTER_Y = SCREEN_H / 2;

// Scattered starting positions (as fractions of screen)
const ORB_STARTS: { x: number; y: number; size: number }[] = [
  { x: 0.08,  y: 0.18, size: 14 },
  { x: 0.82,  y: 0.12, size: 18 },
  { x: 0.06,  y: 0.52, size: 12 },
  { x: 0.88,  y: 0.48, size: 16 },
  { x: 0.18,  y: 0.82, size: 20 },
  { x: 0.76,  y: 0.78, size: 13 },
];

interface OrbProps {
  startX: number;
  startY: number;
  size: number;
  delay: number;
  onAllArrived?: () => void;
  isLast: boolean;
}

function Orb({ startX, startY, size, delay, onAllArrived, isLast }: OrbProps) {
  const x = useSharedValue(startX * SCREEN_W - size / 2);
  const y = useSharedValue(startY * SCREEN_H - size / 2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const targetX = CENTER_X - size / 2;
    const targetY = CENTER_Y - size / 2;
    const easing = Easing.out(Easing.cubic);

    // Fade in gently first
    opacity.value = withDelay(delay, withTiming(0.75, { duration: 600, easing }));

    // Drift to center
    x.value = withDelay(delay + 200, withTiming(targetX, { duration: 2800, easing }));

    if (isLast && onAllArrived) {
      y.value = withDelay(delay + 200, withTiming(targetY, { duration: 2800, easing }, () => {
        runOnJS(onAllArrived)();
      }));
    } else {
      y.value = withDelay(delay + 200, withTiming(targetY, { duration: 2800, easing }));
    }
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        { width: size, height: size, borderRadius: size / 2 },
        orbStyle,
      ]}
    />
  );
}

interface MergePulseProps {
  onComplete: () => void;
}

function MergePulse({ onComplete }: MergePulseProps) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    scale.value = withTiming(2.2, { duration: 900, easing });
    opacity.value = withSequence(
      withTiming(1, { duration: 300, easing }),
      withTiming(0, { duration: 600, easing }, () => {
        runOnJS(onComplete)();
      }),
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.mergePulse, pulseStyle]}
    />
  );
}

interface GuideLoaderProps {
  guideName: string;
  onComplete: () => void;
}

export function GuideLoader({ guideName, onComplete }: GuideLoaderProps) {
  const [showMerge, setShowMerge] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);

  const guide = getGuide(guideName);

  const handleOrbsArrived = () => {
    setShowMerge(true);
  };

  const handleMergeComplete = () => {
    setShowGuide(true);
    // Auto-advance after emoji + text have settled
    setTimeout(onComplete, 2200);
  };

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(181, 100, 252, 0.08)" top={-60} left={-80} size={360} />
        <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={380} left={60} size={280} />
      </View>

      {/* Orbs layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {ORB_STARTS.map((orb, i) => (
          <Orb
            key={i}
            startX={orb.x}
            startY={orb.y}
            size={orb.size}
            delay={500 + i * 120}
            isLast={i === ORB_STARTS.length - 1}
            onAllArrived={handleOrbsArrived}
          />
        ))}
        {showMerge && <MergePulse onComplete={handleMergeComplete} />}
      </View>

      {/* Guide reveal */}
      {showGuide && (
        <Animated.View entering={FadeIn.duration(900)} style={styles.guideReveal}>
          <Text style={styles.guideEmoji}>{guide.emoji}</Text>
          <Animated.Text
            entering={FadeIn.delay(400).duration(900)}
            style={styles.guideText}
          >
            {guideName} is with you
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 240, 200, 0.85)',
    shadowColor: '#fff8e0',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  mergePulse: {
    position: 'absolute',
    alignSelf: 'center',
    top: CENTER_Y - 30,
    left: CENTER_X - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 240, 200, 0.75)',
    shadowColor: '#fff8e0',
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  guideReveal: {
    alignItems: 'center',
    gap: 20,
  },
  guideEmoji: {
    fontSize: 80,
  },
  guideText: {
    fontFamily: fonts.labelLight,
    fontSize: scaleFont(20),
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "GuideLoader" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Commit**

```bash
git add features/ask/GuideLoader.tsx
git commit -m "feat: add GuideLoader particle orb convergence animation"
```

---

## Task 9: Main Ask Screen (Phase State Machine)

**Files:**
- Create: `app/(tabs)/ask.tsx`
- Delete: `app/(tabs)/ask-krishna.tsx` (after creating ask.tsx)

- [ ] **Step 1: Create `app/(tabs)/ask.tsx`**

```typescript
// app/(tabs)/ask.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { PageHero } from '@/components/ui/PageHero';
import { useChatState } from '@/features/chat/useChatState';
import { GuideSelector } from '@/features/ask/GuideSelector';
import { GuideLoader } from '@/features/ask/GuideLoader';
import { useGuide } from '@/lib/guideStore';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Message } from '@/features/chat/useChatState';

const askBackgroundArt = Image.resolveAssetSource(
  require('../../assets/daily-arth-bg.svg')
);

type Phase = 'selector' | 'loading' | 'chat';

function AskBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <AmbientBlob color="rgba(212, 190, 228, 0.12)" top={-110} left={-90} size={380} />
      <AmbientBlob color="rgba(184, 152, 122, 0.08)" top={280} left={-20} size={280} />
      {askBackgroundArt?.uri ? (
        <View style={styles.backgroundArt}>
          <SvgUri uri={askBackgroundArt.uri} width="100%" height="100%" />
        </View>
      ) : null}
    </View>
  );
}

function TypingIndicator({ guideName }: { guideName: string | null }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>
          {guideName ? `${guideName} is reflecting…` : 'Aksha is reflecting…'}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AskScreen() {
  const { guide, isLoading, commitToGuide } = useGuide();
  const [phase, setPhase] = React.useState<Phase>(() =>
    guide ? 'chat' : 'selector'
  );
  const [pendingGuide, setPendingGuide] = React.useState<string | null>(null);

  // Resolve phase once guide store finishes loading
  React.useEffect(() => {
    if (!isLoading) {
      setPhase(guide ? 'chat' : 'selector');
    }
  }, [isLoading, guide]);

  const activeGuide = guide ?? pendingGuide;
  const { messages, isTyping, inputText, setInputText, sendMessage } =
    useChatState(activeGuide);
  const flatListRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();

  const handleCommit = async (guideName: string) => {
    setPendingGuide(guideName);
    await commitToGuide(guideName);
    setPhase('loading');
  };

  const handleLoaderComplete = () => {
    setPhase('chat');
  };

  if (isLoading) return <View style={styles.root} />;

  if (phase === 'selector') {
    return <GuideSelector onCommit={handleCommit} />;
  }

  if (phase === 'loading' && pendingGuide) {
    return (
      <GuideLoader
        guideName={pendingGuide}
        onComplete={handleLoaderComplete}
      />
    );
  }

  return (
    <View style={styles.root}>
      <AskBackdrop />

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
          renderItem={({ item }) => (
            <ChatBubble message={item} senderName={activeGuide ?? 'Aksha'} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <PageHero
                meta="Sacred Guidance"
                title={`Ask ${activeGuide ?? 'Aksha'}`}
                subtitle="Bring your doubt, conflict, or question into one clear sacred space."
                style={styles.header}
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSub}
              />
            </SafeAreaView>
          )}
          ListFooterComponent={isTyping ? <TypingIndicator guideName={activeGuide} /> : null}
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() => sendMessage(inputText)}
        />
      </KeyboardAvoidingView>

      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundArt: {
    position: 'absolute',
    top: -100,
    right: -140,
    width: 380,
    height: 380,
    opacity: 0.14,
    transform: [{ rotate: '10deg' }],
  },
  headerSafeArea: {
    marginBottom: 20,
  },
  header: {
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: scaleFont(38),
    lineHeight: scaleFont(44),
  },
  headerSub: {
    maxWidth: 340,
  },
  listContent: {
    paddingTop: 28,
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 28,
    gap: 28,
  },
  separator: { height: 0 },
  typingRow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 38, 38, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.1)',
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.secondaryDim,
  },
  typingText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 96,
  },
});
```

- [ ] **Step 2: Delete the old screen**

```bash
rm app/(tabs)/ask-krishna.tsx
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "ask" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 4: Commit**

```bash
git add app/\(tabs\)/ask.tsx
git rm app/\(tabs\)/ask-krishna.tsx
git commit -m "feat: add ask screen with selector/loader/chat phase state machine"
```

---

## Task 10: Update Tab Layout

**Files:**
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Wrap layout with GuideProvider and rename tab**

Replace the entire file:

```typescript
// app/(tabs)/_layout.tsx
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';
import { GuideProvider } from '@/lib/guideStore';

export default function TabLayout() {
  return (
    <GuideProvider>
      <View style={styles.root}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="ask" />
          <Tabs.Screen name="gurukul" />
          <Tabs.Screen name="muhurat" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </GuideProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "_layout" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/_layout.tsx
git commit -m "feat: wrap tabs layout with GuideProvider, rename ask tab"
```

---

## Task 11: Dynamic Tab Label in TabBar

**Files:**
- Modify: `components/ui/TabBar.tsx`

- [ ] **Step 1: Update TabBar to use dynamic guide label**

Replace the `TAB_ICONS`, `TAB_LABELS` blocks and add the `useGuide` import. Replace the entire file:

```typescript
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  BookOpen,
  Clock,
  Home,
  MessageCircle,
  User,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useGuide } from '@/lib/guideStore';

const TAB_ICONS = {
  index: Home,
  ask: MessageCircle,
  gurukul: BookOpen,
  muhurat: Clock,
  profile: User,
} as const;

type TabName = keyof typeof TAB_ICONS;

const STATIC_LABELS: Record<TabName, string> = {
  index: 'Home',
  ask: 'Ask',
  gurukul: 'Gurukul',
  muhurat: 'Muhurat',
  profile: 'You',
};

const BAR_PADDING = 4;
const BAR_HEIGHT = 74;
const SELECTOR_HORIZONTAL_INSET = 0;
const SELECTOR_VERTICAL_INSET = 5;
const SPRING = {
  damping: 22,
  stiffness: 240,
  mass: 0.85,
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);
  const { guide } = useGuide();

  const tabs = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeRouteKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    tabs.findIndex((route) => route.key === activeRouteKey),
    0
  );
  const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / tabs.length : 0;
  const selectorWidth =
    slotWidth > 0 ? Math.max(0, slotWidth - 4) : 0;

  useEffect(() => {
    if (!slotWidth) return;
    selectorX.value = withSpring(activeIndex * slotWidth + SELECTOR_HORIZONTAL_INSET, SPRING);
  }, [activeIndex, selectorX, slotWidth]);

  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectorX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const getLabel = (tabName: TabName): string => {
    if (tabName === 'ask' && guide) return `Ask ${guide}`;
    return STATIC_LABELS[tabName];
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: 10 }]}>
      <View style={styles.container} onLayout={handleLayout}>
        <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.containerTint} />

        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selector,
              {
                width: selectorWidth,
                left: BAR_PADDING,
                right: BAR_PADDING,
                top: SELECTOR_VERTICAL_INSET,
                bottom: SELECTOR_VERTICAL_INSET,
              },
              selectorStyle,
            ]}
          >
            <View style={styles.selectorTint} />
          </Animated.View>
        ) : null}

        <View style={styles.row}>
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabName = route.name as TabName;
            const Icon = TAB_ICONS[tabName];
            const label = getLabel(tabName);

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                key={route.key}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                onPress={() => {
                  hapticLight();
                  const event = navigation.emit({
                    canPreventDefault: true,
                    target: route.key,
                    type: 'tabPress',
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
              >
                <View style={styles.tabContent}>
                  <Icon
                    size={isFocused ? 21 : 20}
                    color={isFocused ? colors.secondaryFixed : 'rgba(255,255,255,0.40)'}
                    fill={isFocused ? colors.secondaryFixed : 'rgba(255,255,255,0.40)'}
                    strokeWidth={isFocused ? 2.15 : 1.7}
                  />
                  <Text
                    style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    width: '95%',
    maxWidth: 620,
    minHeight: BAR_HEIGHT,
    borderRadius: 9999,
    overflow: 'hidden',
    padding: BAR_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(18, 18, 22, 0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  containerTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  selector: {
    position: 'absolute',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  selectorTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressed: {
    opacity: 0.84,
  },
  tabContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    lineHeight: scaleFont(12),
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.onSurface,
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "TabBar" || echo "No errors"
```

Expected: `No errors`

- [ ] **Step 3: Run all tests to confirm nothing is broken**

```bash
npx jest --no-coverage 2>&1 | tail -20
```

Expected: All existing tests pass.

- [ ] **Step 4: Commit**

```bash
git add components/ui/TabBar.tsx
git commit -m "feat: TabBar shows dynamic 'Ask [Guide]' label from guide context"
```

---

## Verification

- [ ] **Manual smoke test checklist**
  1. Fresh install (clear AsyncStorage): Opens Ask tab → selector screen appears
  2. Select a guide → commitment button shows deity-specific verb
  3. Tap commit → orbs drift inward slowly, merge pulse, emoji reveal, text fade-in
  4. Chat screen appears with header "Ask [Guide]", sender label = guide name, typing indicator = "[Guide] is reflecting…"
  5. Send a message → AI responds in the guide's persona voice
  6. Kill app and reopen → selector is skipped, chat loads immediately
  7. Tab bar shows "Ask [Guide]" with correct label
