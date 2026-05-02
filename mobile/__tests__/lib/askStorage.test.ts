jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiRemove: jest.fn(),
  removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearAskConversation,
  clearAskState,
  loadAskMode,
  saveAskMode,
} from '@/lib/askStorage';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;
const mockMultiRemove = AsyncStorage.multiRemove as jest.Mock;
const mockRemove = AsyncStorage.removeItem as jest.Mock;

describe('askStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to quick mode when nothing stored', async () => {
    mockGet.mockResolvedValueOnce(null);
    await expect(loadAskMode()).resolves.toBe('quick');
  });

  it('saves the selected mode', async () => {
    mockSet.mockResolvedValueOnce(undefined);
    await saveAskMode('compare');
    expect(mockSet).toHaveBeenCalledWith('ask_v2_mode', 'compare');
  });

  it('clears only V2 ask keys', async () => {
    mockMultiRemove.mockResolvedValueOnce(undefined);
    await clearAskState();
    expect(mockMultiRemove).toHaveBeenCalledWith([
      'ask_v2_context',
      'ask_v2_messages',
      'ask_v2_mode',
      'ask_v2_saved_passages',
      'ask_v2_history',
    ]);
  });

  it('clears messages and history by default when clearing chat', async () => {
    mockRemove.mockResolvedValue(undefined);
    await clearAskConversation();
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'ask_v2_messages');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'ask_v2_history');
  });

  it('can preserve history when clearing only the visible chat', async () => {
    mockRemove.mockResolvedValue(undefined);
    await clearAskConversation({ clearHistory: false });
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith('ask_v2_messages');
  });
});
