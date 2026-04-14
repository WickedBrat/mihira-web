// features/ask/useNaradState.ts
import { fetch } from 'expo/fetch';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/expo';
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

const PAGE_SIZE = 12; // ~2 exchanges (each exchange = 1 user + 5 AI messages)

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

  // Source of truth for all messages — never truncated (pagination reads from here)
  const allMessagesRef = useRef<Message[]>([NARAD_WELCOME]);
  // Displayed slice — tail window into allMessagesRef
  const [messages, setMessages] = useState<Message[]>([NARAD_WELCOME]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
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
      if (msgs.length > 0) {
        allMessagesRef.current = msgs;
        const slice = msgs.slice(Math.max(0, msgs.length - PAGE_SIZE));
        setMessages(slice);
        setHasMoreMessages(msgs.length > PAGE_SIZE);
      }
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

  // Prepend an older page of messages (called when user scrolls to top)
  const loadMoreMessages = useCallback(() => {
    const all = allMessagesRef.current;
    setMessages(prev => {
      const currentStart = all.length - prev.length;
      if (currentStart <= 0) return prev;
      const newStart = Math.max(0, currentStart - PAGE_SIZE);
      setHasMoreMessages(newStart > 0);
      return all.slice(newStart);
    });
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

      allMessagesRef.current = [...allMessagesRef.current, userMsg];
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
        setIsTyping(false);

        const now = Date.now();
        const responseMsgs: Message[] = [
          {
            id: `narad-narrative-${now}`,
            role: 'ai',
            text: `${narad_narrative.greeting} ${narad_narrative.journey_description}`,
            timestamp: new Date(),
            bubbleType: 'narad_greeting',
            visibleAfterMs: 0,
            accentColor: accentHex,
          },
          {
            id: `vani-${now}`,
            role: 'ai',
            text: `${divine_vani.wisdom_text}\n\n${narad_closing}`,
            timestamp: new Date(),
            bubbleType: 'vani',
            visibleAfterMs: 800,
            accentColor: accentHex,
            shlokaData: {
              devanagari: divine_vani.shloka_devanagari,
              transliteration: divine_vani.shloka_transliteration,
              meaning: divine_vani.shloka_meaning,
              source: divine_vani.source_scripture,
            },
          },
        ];

        const fullHistory = [...allMessagesRef.current, ...responseMsgs];
        allMessagesRef.current = fullHistory;
        saveNaradMessages(fullHistory);
        setMessages(prev => [...prev, ...responseMsgs]);

        const newContext: NaradContext = {
          ...naradContextRef.current,
          lastDeity: deity,
          lastTheme: text.trim().slice(0, 80),
          interactionCount: naradContextRef.current.interactionCount + 1,
        };
        setNaradContext(newContext);
        saveNaradContext(newContext);
        await appendNaradHistory({
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
        const errMsg2: Message = {
          id: `error-${Date.now()}`,
          role: 'ai',
          text: `Something went wrong: ${errMsg}`,
          timestamp: new Date(),
        };
        allMessagesRef.current = [...allMessagesRef.current, errMsg2];
        setMessages(prev => [...prev, errMsg2]);
        setRealmPhase('idle');
        setIsTyping(false);
      }
    },
    [isTyping, userId, getToken],
  );

  const clearChat = useCallback(async () => {
    allMessagesRef.current = [NARAD_WELCOME];
    setMessages([NARAD_WELCOME]);
    setHasMoreMessages(false);
    setRealmPhase('idle');
    setCurrentDeity(null);
    setAccentColor(null);
    setNaradContext(prev => ({ ...prev, lastDeity: null, lastTheme: null }));
    await clearNaradMessages();
  }, []);

  return {
    messages,
    hasMoreMessages,
    loadMoreMessages,
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
