import * as SecureStore from 'expo-secure-store';
import type { TokenCache } from '@clerk/expo';

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

export const tokenCache: TokenCache = {
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key, secureStoreOptions);
    } catch {
      await SecureStore.deleteItemAsync(key, secureStoreOptions);
      return null;
    }
  },
  saveToken: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value, secureStoreOptions),
  clearToken: (key: string) => SecureStore.deleteItemAsync(key, secureStoreOptions),
};
