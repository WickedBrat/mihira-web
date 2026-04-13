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
