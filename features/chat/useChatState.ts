// features/chat/useChatState.ts
import { fetch } from 'expo/fetch';
import Constants from 'expo-constants';
import { useState, useCallback, useEffect, useRef } from 'react';
import { getHistory, saveHistory, clearHistory } from '@/lib/chatStorage';
import { getGuide } from '@/features/ask/guidePersonas';
import { analytics } from '@/lib/analytics';
import type { BubbleType } from '@/features/ask/types';

function apiUrl(path: string): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const base = hostUri ? `http://${hostUri}` : '';
  console.log('[chat] apiUrl:', base + path);
  return base + path;
}

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

    analytics.chatMessageSent({
      guide: guide ?? null,
      message_length: text.trim().length,
      conversation_length: messages.length,
    });

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

      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: historyForApi, persona: guide }),
        signal: controller.signal,
      });

      console.log('[chat] response status:', res.status, 'has body:', !!res.body);

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) { console.log('[chat] stream done'); break; }
        const chunk = decoder.decode(value, { stream: true });
        console.log('[chat] chunk:', chunk);
        buffer += chunk;
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
            console.log('[chat] parsed:', json);
            if (json.token) {
              fullText += json.token;
              const captured = fullText;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, text: captured } : m)
              );
            }
          } catch (e) { console.warn('[chat] parse error:', e, 'raw:', data); }
        }
      }

      setMessages(prev => {
        saveHistory(prev);
        return prev;
      });
    } catch (err: unknown) {
      console.error('[chat] error:', err);
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

  const clearChat = useCallback(async () => {
    setMessages([buildInitialMessage(guide)]);
    await clearHistory();
  }, [guide]);

  return { messages, isTyping, inputText, setInputText, sendMessage, clearChat };
}
