import * as SecureStore from 'expo-secure-store';
import { tokenCache } from '@/lib/clerk';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('tokenCache', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getToken delegates to SecureStore.getItemAsync', async () => {
    mockSecureStore.getItemAsync.mockResolvedValue('tok-123');
    const result = await tokenCache.getToken('clerk-session');
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('clerk-session');
    expect(result).toBe('tok-123');
  });

  it('saveToken delegates to SecureStore.setItemAsync', async () => {
    mockSecureStore.setItemAsync.mockResolvedValue(undefined);
    await tokenCache.saveToken('clerk-session', 'tok-abc');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('clerk-session', 'tok-abc');
  });

  it('clearToken delegates to SecureStore.deleteItemAsync', async () => {
    mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
    await tokenCache.clearToken!('clerk-session');
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('clerk-session');
  });

  it('clearToken returns the promise from SecureStore.deleteItemAsync', async () => {
    mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
    const result = tokenCache.clearToken!('clerk-session');
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBeUndefined();
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('clerk-session');
  });
});
