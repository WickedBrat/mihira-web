import { renderHook, act } from '@testing-library/react-native';
import { useChatState } from '@/features/chat/useChatState';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('useChatState', () => {
  it('starts with initial AI greeting', () => {
    const { result } = renderHook(() => useChatState());
    expect(result.current.messages.length).toBeGreaterThan(0);
    expect(result.current.messages[0].role).toBe('ai');
  });

  it('adds a user message when sendMessage is called', () => {
    const { result } = renderHook(() => useChatState());
    act(() => {
      result.current.sendMessage('Hello');
    });
    const userMessages = result.current.messages.filter((m) => m.role === 'user');
    expect(userMessages.length).toBe(1);
    expect(userMessages[0].text).toBe('Hello');
  });

  it('sets isTyping true immediately after sendMessage', () => {
    const { result } = renderHook(() => useChatState());
    act(() => {
      result.current.sendMessage('Hello');
    });
    expect(result.current.isTyping).toBe(true);
  });
});
