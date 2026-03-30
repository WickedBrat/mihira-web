import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    text: "Welcome back to your sanctuary. I've been reflecting on our previous discussion about finding stillness. How is your mind feeling in this moment?",
    timestamp: new Date(),
  },
];

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setInputText('');

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'The noise is simply the world\'s natural rhythm; the quiet you seek is not the absence of sound, but the presence of your own centered awareness.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  }, []);

  return { messages, isTyping, inputText, setInputText, sendMessage };
}
