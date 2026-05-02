jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistory, saveHistory } from '@/lib/chatStorage';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;

describe('getHistory', () => {
  it('returns empty array when nothing stored', async () => {
    mockGet.mockResolvedValueOnce(null);
    expect(await getHistory()).toEqual([]);
  });
  it('parses stored JSON', async () => {
    const msgs = [{ id: '1', role: 'ai', text: 'Hi', timestamp: new Date().toISOString() }];
    mockGet.mockResolvedValueOnce(JSON.stringify(msgs));
    const result = await getHistory();
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hi');
  });
});

describe('saveHistory', () => {
  it('saves last 50 messages', async () => {
    mockSet.mockResolvedValueOnce(undefined);
    const msgs = Array.from({ length: 60 }, (_, i) => ({
      id: String(i), role: 'user' as const, text: `msg ${i}`, timestamp: new Date(),
    }));
    await saveHistory(msgs);
    const saved = JSON.parse((mockSet.mock.calls[0][1] as string));
    expect(saved).toHaveLength(50);
  });
});
