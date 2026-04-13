// features/ask/useNaradState.ts
import { fetch } from 'expo/fetch';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { apiUrl } from '@/lib/apiUrl';
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

  const naradContextRef = useRef<NaradContext>({ ...DEFAULT_NARAD_CONTEXT });
  const settledTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effect 1: runs ONCE on mount — load context and messages from storage
  useEffect(() => {
    const load = async () => {
      const ctx = await loadNaradContext();
      setNaradContext(ctx);
      const msgs = await loadNaradMessages();
      if (msgs.length > 0) setMessages(msgs);
      setIsContextLoaded(true);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: sync firstName from Clerk once it resolves (no message overwrite)
  useEffect(() => {
    if (!user?.firstName) return;
    setNaradContext(prev => {
      if (prev.userName !== 'Seeker') return prev; // already has a real name
      return { ...prev, userName: user.firstName! };
    });
  }, [user?.firstName]);

  // Keep ref in sync with state
  useEffect(() => {
    naradContextRef.current = naradContext;
  }, [naradContext]);

  // Cleanup settled timer on unmount
  useEffect(() => {
    return () => {
      if (settledTimerRef.current) clearTimeout(settledTimerRef.current);
    };
  }, []);

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
            userContext: naradContextRef.current,
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
          ...naradContextRef.current,
          lastDeity: deity,
          lastTheme: text.trim().slice(0, 80),
          interactionCount: naradContextRef.current.interactionCount + 1,
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

        if (settledTimerRef.current) clearTimeout(settledTimerRef.current);
        settledTimerRef.current = setTimeout(() => setRealmPhase('settled'), 1400);
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
    [isTyping, userId, getToken],
  );

  const clearChat = useCallback(async () => {
    setMessages([NARAD_WELCOME]);
    setRealmPhase('idle');
    setCurrentDeity(null);
    setAccentColor(null);
    setNaradContext(prev => ({ ...prev, lastDeity: null, lastTheme: null }));
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
