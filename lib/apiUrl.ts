// lib/apiUrl.ts
import Constants from 'expo-constants';

export function apiUrl(path: string): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const base = hostUri ? `http://${hostUri}` : '';
  return base + path;
}
