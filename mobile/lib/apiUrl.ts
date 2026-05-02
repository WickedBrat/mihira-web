// lib/apiUrl.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PRODUCTION_API_BASE = 'https://www.getmihira.com';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function normalizeProductionPath(path: string): string {
  if (path.startsWith('/v1/')) return path;
  if (path.startsWith('/api/')) return `/v1${path}`;
  return path;
}

export function apiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const configuredBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configuredBase) {
    const base = trimTrailingSlash(configuredBase);
    return `${base}${normalizeProductionPath(path)}`;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && Platform.OS === 'web') {
    return `http://${hostUri}${path}`;
  }

  const base = trimTrailingSlash(DEFAULT_PRODUCTION_API_BASE);
  return `${base}${normalizeProductionPath(path)}`;
}
