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
    expect(result.current.messages[0].text.toLowerCase()).toContain('dear one');
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
