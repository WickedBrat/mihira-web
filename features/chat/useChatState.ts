// features/chat/useChatState.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { getHistory, saveHistory } from '@/lib/chatStorage';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'ai',
  text: "Welcome back to your sanctuary. I've been reflecting on our previous discussion about finding stillness. How is your mind feeling in this moment?",
  timestamp: new Date(),
};

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
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
        body: JSON.stringify({ message: text.trim(), history: historyForApi }),
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
  }, [messages, isTyping]);

  return { messages, isTyping, inputText, setInputText, sendMessage };
}
