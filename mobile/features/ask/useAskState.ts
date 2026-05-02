import { fetch } from 'expo/fetch';
import { useAuth, useUser } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AskChatItem,
  AskContextV2,
  AskHistoryTurn,
  AskSavedPassage,
  AskTopic,
  ScriptureGuideResponse,
  ScriptureSource,
} from '@/features/ask/types';
import { apiUrl } from '@/lib/apiUrl';
import { analytics } from '@/lib/analytics';
import {
  DEFAULT_ASK_CONTEXT,
  clearAskConversation,
  loadAskContext,
  loadAskHistory,
  loadAskMessages,
  loadSavedPassages,
  saveAskContext,
  saveAskHistory,
  saveAskMessages,
  saveSavedPassages,
} from '@/lib/askStorage';

const PAGE_SIZE = 12;

export function useAskState() {
  const { user } = useUser();
  const { userId } = useAuth();
  const allMessagesRef = useRef<AskChatItem[]>([]);
  const [messages, setMessages] = useState<AskChatItem[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [savedPassages, setSavedPassages] = useState<AskSavedPassage[]>([]);
  const [askContext, setAskContext] = useState<AskContextV2>({ ...DEFAULT_ASK_CONTEXT });
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const askContextRef = useRef<AskContextV2>({ ...DEFAULT_ASK_CONTEXT });
  const mode = 'quick' as const;

  useEffect(() => {
    const load = async () => {
      const [context, storedMessages, storedPassages] = await Promise.all([
        loadAskContext(),
        loadAskMessages(),
        loadSavedPassages(),
      ]);

      setAskContext(context);
      askContextRef.current = context;
      setSavedPassages(storedPassages);
      allMessagesRef.current = storedMessages;
      const slice = storedMessages.slice(Math.max(0, storedMessages.length - PAGE_SIZE));
      setMessages(slice);
      setHasMoreMessages(storedMessages.length > PAGE_SIZE);
      setIsContextLoaded(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (!user?.firstName) return;
    setAskContext((prev) => {
      if (prev.userName !== 'Seeker') return prev;
      const next = { ...prev, userName: user.firstName! };
      askContextRef.current = next;
      saveAskContext(next).catch(() => {});
      return next;
    });
  }, [user?.firstName]);

  const loadMoreMessages = useCallback(() => {
    const all = allMessagesRef.current;
    setMessages((prev) => {
      const currentStart = all.length - prev.length;
      if (currentStart <= 0) return prev;
      const newStart = Math.max(0, currentStart - PAGE_SIZE);
      setHasMoreMessages(newStart > 0);
      return all.slice(newStart);
    });
  }, []);

  const toggleSavedPassage = useCallback(async (source: ScriptureSource) => {
    setSavedPassages((prev) => {
      const exists = prev.some((entry) => entry.source.id === source.id);
      const next = exists
        ? prev.filter((entry) => entry.source.id !== source.id)
        : [...prev, { source, savedAt: new Date().toISOString() }];

      saveSavedPassages(next).catch(() => {});
      analytics.askPassageSaved({
        source_id: source.id,
        scripture: source.scripture,
        saved: !exists,
      });
      return next;
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: AskChatItem = {
      id: `ask-user-${Date.now()}`,
      kind: 'user_message',
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    const nextAllMessages = [...allMessagesRef.current, userMessage];
    allMessagesRef.current = nextAllMessages;
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInputText('');

    try {
      const history = await loadAskHistory();
      analytics.askSubmitted({
        mode,
        message_length: trimmed.length,
        conversation_length: nextAllMessages.length,
      });

      const response = await fetch(apiUrl('/api/ask'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history,
          userContext: askContextRef.current,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error((errData as { error?: string }).error ?? `HTTP ${response.status}`);
      }

      const parsed = await response.json() as ScriptureGuideResponse;
      const assistantMessage: AskChatItem = {
        id: `ask-ai-${Date.now()}`,
        kind: 'assistant_response',
        role: 'ai',
        prompt: trimmed,
        timestamp: new Date(),
        response: parsed,
      };

      const fullHistory = [...nextAllMessages, assistantMessage];
      allMessagesRef.current = fullHistory;
      await saveAskMessages(fullHistory);
      setMessages((prev) => [...prev, assistantMessage]);

      const nextContext: AskContextV2 = {
        ...askContextRef.current,
        interactionCount: askContextRef.current.interactionCount + 1,
        lastMode: mode,
        lastTopic: parsed.topic,
        lastQuestion: trimmed,
      };

      askContextRef.current = nextContext;
      setAskContext(nextContext);
      await saveAskContext(nextContext);

      const nextHistory: AskHistoryTurn[] = [
        ...history,
        {
          question: trimmed,
          summary: parsed.answer.summary,
          mode,
          topic: parsed.topic as AskTopic,
          sourceIds: parsed.sources.map((source) => source.id),
        },
      ];
      await saveAskHistory(nextHistory);
    } catch (err) {
      console.error('[ask] sendMessage error:', err);
      const message = err instanceof Error ? err.message : 'Connection error';
      const errorMessage: AskChatItem = {
        id: `ask-ai-error-${Date.now()}`,
        kind: 'assistant_response',
        role: 'ai',
        prompt: trimmed,
        timestamp: new Date(),
        response: {
          mode,
          topic: 'general',
          answer: {
            title: 'Something Went Wrong',
            summary: 'Mihira could not complete this request.',
            practical_guidance: `Please try again in a moment. Details: ${message}`,
          },
          sources: [],
          interpretation: {
            synthesis: 'No scripture-grounded answer was returned because the request failed before synthesis completed.',
          },
          action_steps: ['Try the request again.', 'Shorten the question if needed.'],
          follow_up_prompts: [],
          safety: { has_boundary: false },
        },
      };
      const fullHistory = [...allMessagesRef.current, errorMessage];
      allMessagesRef.current = fullHistory;
      await saveAskMessages(fullHistory);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, mode]);

  const clearChat = useCallback(async (options?: { clearHistory?: boolean }) => {
    allMessagesRef.current = [];
    setMessages([]);
    setHasMoreMessages(false);
    await clearAskConversation(options);
  }, []);

  const setFollowUpPrompt = useCallback((prompt: string) => {
    analytics.askFollowUpPromptTapped({ prompt_length: prompt.length });
    setInputText(prompt);
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
    askContext,
    isContextLoaded,
    savedPassages,
    toggleSavedPassage,
    setFollowUpPrompt,
  };
}
