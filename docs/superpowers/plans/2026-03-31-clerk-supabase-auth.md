# Clerk + Supabase Auth & Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google + Apple OAuth via Clerk, persist user profiles (name, birth date/time, birth place, language, region, focus area) to Supabase with Row-Level Security, and wire the existing Profile screen + settings drawer to auth state.

**Architecture:** Clerk manages sessions via `expo-secure-store`. A Clerk JWT template signed with the Supabase JWT secret bridges auth — Supabase validates Clerk tokens natively. A `getSupabaseClient(getToken)` factory injects fresh Clerk JWTs into every Supabase request. `useProfile` hook owns data fetching and 800ms debounced auto-save. Profile screen becomes auth-aware with an inline auth sheet for sign-in.

**Tech Stack:** `@clerk/clerk-expo` · `expo-secure-store` · `expo-web-browser` · `@supabase/supabase-js` · existing Expo SDK 54 / React Native / Moti stack

---

## File Map

```
New files:
  lib/clerk.ts                         — tokenCache for Clerk session persistence
  lib/supabase.ts                      — getSupabaseClient(getToken) factory
  features/auth/useSignIn.ts           — useOAuth wrappers for Google + Apple
  features/auth/OAuthButton.tsx        — styled OAuth provider button
  features/profile/useProfile.ts       — fetch/auto-save profile hook
  .env.example                         — committed env var template
  __tests__/lib/clerk.test.ts          — tokenCache unit tests
  __tests__/lib/supabase.test.ts       — getSupabaseClient unit tests
  __tests__/features/profile/useProfile.test.ts  — hook tests

Modified files:
  app/_layout.tsx                      — wrap root with ClerkProvider
  app/(tabs)/profile.tsx               — auth-aware UI, wire useProfile
  app/onboarding/index.tsx             — write focus_area to Supabase on complete
```

---

## Task 1: Manual Prerequisites (Dashboard Setup)

**Files:** None — manual one-time config in two dashboards.

- [ ] **Step 1: Get Supabase JWT secret**

  In Supabase dashboard → your project → Settings (gear icon) → API → scroll to "JWT Settings" → copy the value under **JWT Secret**.

- [ ] **Step 2: Create Clerk JWT template**

  In Clerk dashboard → your app → JWT Templates → **+ New template** → choose **Blank**.
  - Name: `supabase`
  - Algorithm: `HS256`
  - Signing key: paste the Supabase JWT Secret from Step 1
  - Claims JSON:
    ```json
    {
      "sub": "{{user.id}}",
      "role": "authenticated"
    }
    ```
  - Save.

- [ ] **Step 3: Create Supabase profiles table**

  In Supabase dashboard → SQL Editor → run:

  ```sql
  CREATE TABLE profiles (
    id           text PRIMARY KEY,
    name         text,
    birth_dt     text,
    birth_place  text,
    language     text NOT NULL DEFAULT 'English',
    region       text NOT NULL DEFAULT 'India',
    focus_area   text,
    updated_at   timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "select_own" ON profiles FOR SELECT
    USING (auth.jwt() ->> 'sub' = id);

  CREATE POLICY "insert_own" ON profiles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = id);

  CREATE POLICY "update_own" ON profiles FOR UPDATE
    USING (auth.jwt() ->> 'sub' = id);
  ```

- [ ] **Step 4: Enable Google + Apple OAuth in Clerk**

  In Clerk dashboard → your app → User & Authentication → Social Connections → enable **Google** and **Apple**. Configure each with your OAuth credentials from Google Cloud Console / Apple Developer portal.

---

## Task 2: Install Packages + Env Files

**Files:**
- Modify: `package.json` (via install commands)
- Create: `.env.local`, `.env.example`

- [ ] **Step 1: Install Expo-managed packages**

  ```bash
  cd /Users/Apple/projects/aksha
  npx expo install expo-secure-store expo-web-browser
  ```

  Expected: packages added to `package.json` at SDK 54-compatible versions.

- [ ] **Step 2: Install third-party packages**

  ```bash
  npm install @clerk/clerk-expo @supabase/supabase-js
  ```

  Expected: both appear in `package.json` dependencies.

- [ ] **Step 3: Create `.env.example`**

  Create `/Users/Apple/projects/aksha/.env.example`:

  ```
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_ANON_KEY=
  ```

- [ ] **Step 4: Create `.env.local` (git-ignored)**

  Create `/Users/Apple/projects/aksha/.env.local` and fill in real values:

  ```
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```

  Check `.gitignore` includes `.env.local` — if not, add it.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/Apple/projects/aksha
  git add package.json package-lock.json .env.example
  git commit -m "chore: install clerk, supabase, secure-store, web-browser"
  ```

---

## Task 3: `lib/clerk.ts` + Tests

**Files:**
- Create: `lib/clerk.ts`
- Create: `__tests__/lib/clerk.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `__tests__/lib/clerk.test.ts`:

  ```typescript
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
  });
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  cd /Users/Apple/projects/aksha
  npx jest __tests__/lib/clerk.test.ts --no-coverage
  ```

  Expected: FAIL — `Cannot find module '@/lib/clerk'`

- [ ] **Step 3: Implement `lib/clerk.ts`**

  Create `lib/clerk.ts`:

  ```typescript
  import * as SecureStore from 'expo-secure-store';
  import type { TokenCache } from '@clerk/clerk-expo';

  export const tokenCache: TokenCache = {
    getToken: (key: string) => SecureStore.getItemAsync(key),
    saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    clearToken: (key: string) => SecureStore.deleteItemAsync(key),
  };
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  npx jest __tests__/lib/clerk.test.ts --no-coverage
  ```

  Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

  ```bash
  git add lib/clerk.ts __tests__/lib/clerk.test.ts
  git commit -m "feat: add Clerk tokenCache with SecureStore"
  ```

---

## Task 4: `lib/supabase.ts` + Tests

**Files:**
- Create: `lib/supabase.ts`
- Create: `__tests__/lib/supabase.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `__tests__/lib/supabase.test.ts`:

  ```typescript
  import { getSupabaseClient } from '@/lib/supabase';

  // @supabase/supabase-js createClient — verify we can get a client back
  describe('getSupabaseClient', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      process.env = {
        ...OLD_ENV,
        EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-test',
      };
    });

    afterEach(() => {
      process.env = OLD_ENV;
      jest.resetModules();
    });

    it('returns a client with a from() method', () => {
      const client = getSupabaseClient(async () => 'test-token');
      expect(typeof client.from).toBe('function');
    });

    it('throws if EXPO_PUBLIC_SUPABASE_URL is missing', () => {
      delete process.env.EXPO_PUBLIC_SUPABASE_URL;
      expect(() => getSupabaseClient(async () => null)).toThrow(
        'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
      );
    });

    it('throws if EXPO_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
      delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      expect(() => getSupabaseClient(async () => null)).toThrow(
        'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
      );
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  npx jest __tests__/lib/supabase.test.ts --no-coverage
  ```

  Expected: FAIL — `Cannot find module '@/lib/supabase'`

- [ ] **Step 3: Implement `lib/supabase.ts`**

  Create `lib/supabase.ts`:

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  export function getSupabaseClient(getToken: () => Promise<string | null>) {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
    }

    return createClient(url, key, {
      global: {
        fetch: async (input, init = {}) => {
          const token = await getToken();
          const headers = new Headers((init.headers as HeadersInit) ?? {});
          if (token) headers.set('Authorization', `Bearer ${token}`);
          return fetch(input, { ...init, headers });
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionFromUrl: false,
      },
    });
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  npx jest __tests__/lib/supabase.test.ts --no-coverage
  ```

  Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

  ```bash
  git add lib/supabase.ts __tests__/lib/supabase.test.ts
  git commit -m "feat: add Supabase client factory with Clerk JWT injection"
  ```

---

## Task 5: Wrap Root Layout with ClerkProvider

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update `app/_layout.tsx`**

  Replace the entire file contents:

  ```typescript
  import { useEffect } from 'react';
  import { Stack, SplashScreen } from 'expo-router';
  import { StatusBar } from 'expo-status-bar';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import { ClerkProvider } from '@clerk/clerk-expo';
  import {
    useFonts,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  } from '@expo-google-fonts/lexend';
  import { tokenCache } from '@/lib/clerk';
  import '../global.css';

  SplashScreen.preventAutoHideAsync();

  const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!CLERK_KEY) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');

  export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
      Lexend_300Light,
      Lexend_400Regular,
      Lexend_500Medium,
      Lexend_600SemiBold,
      Lexend_700Bold,
      Lexend_800ExtraBold,
    });

    useEffect(() => {
      if (fontsLoaded || fontError) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) return null;

    return (
      <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar style="light" backgroundColor="#0e0e0e" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0e0e0e' } }}>
              <Stack.Screen name="onboarding/index" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
              <Stack.Screen
                name="ask-krishna"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                  gestureEnabled: true,
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ClerkProvider>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors

- [ ] **Step 3: Commit**

  ```bash
  git add app/_layout.tsx
  git commit -m "feat: wrap root layout with ClerkProvider"
  ```

---

## Task 6: `features/auth/useSignIn.ts` + `features/auth/OAuthButton.tsx`

**Files:**
- Create: `features/auth/useSignIn.ts`
- Create: `features/auth/OAuthButton.tsx`

- [ ] **Step 1: Create `features/auth/useSignIn.ts`**

  ```typescript
  import { useState } from 'react';
  import { useOAuth } from '@clerk/clerk-expo';
  import * as WebBrowser from 'expo-web-browser';

  WebBrowser.maybeCompleteAuthSession();

  export function useSignIn(onSuccess?: () => void) {
    const googleOAuth = useOAuth({ strategy: 'oauth_google' });
    const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
    const [isLoading, setIsLoading] = useState(false);

    const signInWithGoogle = async () => {
      setIsLoading(true);
      try {
        const { createdSessionId, setActive } = await googleOAuth.startOAuthFlow();
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          onSuccess?.();
        }
      } catch (err) {
        console.error('[useSignIn] Google OAuth error', err);
      } finally {
        setIsLoading(false);
      }
    };

    const signInWithApple = async () => {
      setIsLoading(true);
      try {
        const { createdSessionId, setActive } = await appleOAuth.startOAuthFlow();
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          onSuccess?.();
        }
      } catch (err) {
        console.error('[useSignIn] Apple OAuth error', err);
      } finally {
        setIsLoading(false);
      }
    };

    return { signInWithGoogle, signInWithApple, isLoading };
  }
  ```

- [ ] **Step 2: Create `features/auth/OAuthButton.tsx`**

  ```typescript
  import React from 'react';
  import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
  import { colors, fonts } from '@/lib/theme';

  interface OAuthButtonProps {
    provider: 'google' | 'apple';
    onPress: () => void;
    isLoading?: boolean;
  }

  const PROVIDER_LABEL: Record<OAuthButtonProps['provider'], string> = {
    google: 'Continue with Google',
    apple: 'Continue with Apple',
  };

  const PROVIDER_SYMBOL: Record<OAuthButtonProps['provider'], string> = {
    google: 'G',
    apple: '',
  };

  export function OAuthButton({ provider, onPress, isLoading }: OAuthButtonProps) {
    return (
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={onPress}
        disabled={isLoading}
      >
        <View style={styles.inner}>
          <View style={styles.symbolWrap}>
            <Text style={styles.symbol}>{PROVIDER_SYMBOL[provider]}</Text>
          </View>
          <Text style={styles.label}>{PROVIDER_LABEL[provider]}</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.onSurface} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </Pressable>
    );
  }

  const styles = StyleSheet.create({
    button: {
      borderRadius: 16,
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.07)',
    },
    pressed: {
      opacity: 0.7,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 14,
    },
    symbolWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.06)',
    },
    symbol: {
      fontFamily: fonts.headline,
      fontSize: 14,
      color: colors.onSurface,
    },
    label: {
      flex: 1,
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: colors.onSurface,
    },
    placeholder: {
      width: 20,
    },
  });
  ```

- [ ] **Step 3: Verify TypeScript**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors

- [ ] **Step 4: Commit**

  ```bash
  git add features/auth/useSignIn.ts features/auth/OAuthButton.tsx
  git commit -m "feat: add useSignIn hook and OAuthButton component"
  ```

---

## Task 7: `features/profile/useProfile.ts` + Tests

**Files:**
- Create: `features/profile/useProfile.ts`
- Create: `__tests__/features/profile/useProfile.test.ts`

- [ ] **Step 1: Write the failing tests**

  Create `__tests__/features/profile/useProfile.test.ts`:

  ```typescript
  import { renderHook, act, waitFor } from '@testing-library/react-native';
  import { useProfile } from '@/features/profile/useProfile';

  // Mock Clerk
  const mockGetToken = jest.fn().mockResolvedValue('test-jwt');
  jest.mock('@clerk/clerk-expo', () => ({
    useAuth: jest.fn(),
  }));

  // Mock Supabase client
  const mockSingle = jest.fn();
  const mockEq = jest.fn(() => ({ single: mockSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockUpdate = jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) }));
  const mockUpsert = jest.fn().mockResolvedValue({ error: null });
  const mockFrom = jest.fn(() => ({
    upsert: mockUpsert,
    select: mockSelect,
    update: mockUpdate,
  }));
  const mockClient = { from: mockFrom };

  jest.mock('@/lib/supabase', () => ({
    getSupabaseClient: jest.fn(() => mockClient),
  }));

  const { useAuth } = require('@clerk/clerk-expo') as { useAuth: jest.Mock };

  describe('useProfile (signed out)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useAuth.mockReturnValue({ isLoaded: true, isSignedIn: false, userId: null, getToken: mockGetToken });
    });

    it('returns initial empty profile when signed out', () => {
      const { result } = renderHook(() => useProfile());
      expect(result.current.profile.name).toBe('');
      expect(result.current.profile.language).toBe('English');
    });

    it('does not call Supabase when signed out', () => {
      renderHook(() => useProfile());
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('useProfile (signed in)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_123',
        getToken: mockGetToken,
      });
      mockSingle.mockResolvedValue({
        data: {
          id: 'user_123',
          name: 'Arjun',
          birth_dt: '01/01/2000, 9:00 AM',
          birth_place: 'Mumbai, India',
          language: 'Hindi',
          region: 'India',
          focus_area: 'purpose',
        },
        error: null,
      });
    });

    it('fetches and populates profile from Supabase on mount', async () => {
      const { result } = renderHook(() => useProfile());
      await waitFor(() => expect(result.current.profile.name).toBe('Arjun'));
      expect(result.current.profile.language).toBe('Hindi');
      expect(result.current.profile.birth_place).toBe('Mumbai, India');
    });

    it('updateField updates local state immediately', async () => {
      const { result } = renderHook(() => useProfile());
      await waitFor(() => expect(result.current.profile.name).toBe('Arjun'));
      act(() => {
        result.current.updateField('name', 'Krishna');
      });
      expect(result.current.profile.name).toBe('Krishna');
    });
  });
  ```

- [ ] **Step 2: Run tests to verify they fail**

  ```bash
  npx jest __tests__/features/profile/useProfile.test.ts --no-coverage
  ```

  Expected: FAIL — `Cannot find module '@/features/profile/useProfile'`

- [ ] **Step 3: Create `features/profile/useProfile.ts`**

  ```typescript
  import { useState, useEffect, useRef, useCallback } from 'react';
  import { useAuth } from '@clerk/clerk-expo';
  import { getSupabaseClient } from '@/lib/supabase';

  export interface ProfileData {
    name: string;
    birth_dt: string;
    birth_place: string;
    language: 'English' | 'Hindi';
    region: string;
    focus_area: string;
  }

  const INITIAL_PROFILE: ProfileData = {
    name: '',
    birth_dt: '',
    birth_place: '',
    language: 'English',
    region: 'India',
    focus_area: '',
  };

  export function useProfile() {
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
    const [isSaving, setIsSaving] = useState(false);
    const isLoadedFromDB = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getClient = useCallback(
      () => getSupabaseClient(() => getToken({ template: 'supabase' })),
      [getToken]
    );

    // Fetch on sign-in
    useEffect(() => {
      if (!isLoaded || !isSignedIn || !userId) {
        setProfile(INITIAL_PROFILE);
        isLoadedFromDB.current = false;
        return;
      }

      const client = getClient();
      client
        .from('profiles')
        .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true })
        .then(() => client.from('profiles').select('*').eq('id', userId).single())
        .then(({ data }) => {
          if (data) {
            setProfile({
              name: data.name ?? '',
              birth_dt: data.birth_dt ?? '',
              birth_place: data.birth_place ?? '',
              language: (data.language as ProfileData['language']) ?? 'English',
              region: data.region ?? 'India',
              focus_area: data.focus_area ?? '',
            });
          }
          isLoadedFromDB.current = true;
        })
        .catch((err) => console.error('[useProfile] fetch error', err));
    }, [isLoaded, isSignedIn, userId, getClient]);

    const updateField = useCallback(
      <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
        setProfile((current) => ({ ...current, [key]: value }));
      },
      []
    );

    // Debounced auto-save
    useEffect(() => {
      if (!isSignedIn || !userId || !isLoadedFromDB.current) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          const client = getClient();
          await client
            .from('profiles')
            .update({ ...profile, updated_at: new Date().toISOString() })
            .eq('id', userId);
        } catch (err) {
          console.error('[useProfile] save error', err);
        } finally {
          setIsSaving(false);
        }
      }, 800);

      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, [profile, isSignedIn, userId, getClient]);

    return { profile, updateField, isSaving };
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  npx jest __tests__/features/profile/useProfile.test.ts --no-coverage
  ```

  Expected: PASS — 4 tests

- [ ] **Step 5: Run full suite to confirm no regressions**

  ```bash
  npx jest --no-coverage
  ```

  Expected: all existing tests still pass

- [ ] **Step 6: Commit**

  ```bash
  git add features/profile/useProfile.ts __tests__/features/profile/useProfile.test.ts
  git commit -m "feat: add useProfile hook with Supabase auto-save"
  ```

---

## Task 8: Update `app/(tabs)/profile.tsx`

**Files:**
- Modify: `app/(tabs)/profile.tsx`

This task rewrites `profile.tsx` to be auth-aware. Key changes:
- Replace local `profile` state with `useProfile()`
- Update `PROFILE_FIELDS` ids to match DB schema (`birth_dt`, `birth_place`)
- Replace local `contentLanguage` state — language is now in `profile.language`
- Add `isAuthSheetOpen` state + auth sheet MotiView
- Settings drawer: signed-out shows "Sign In" → opens auth sheet; signed-in shows identity row + sign out

- [ ] **Step 1: Replace `app/(tabs)/profile.tsx` with the auth-aware version**

  ```typescript
  import React, { useState } from 'react';
  import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { BlurView } from 'expo-blur';
  import { LinearGradient } from 'expo-linear-gradient';
  import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
  import { AnimatePresence, MotiView } from 'moti';
  import {
    Settings2,
    UserRound,
    CalendarClock,
    MapPin,
    BadgeCheck,
    ChevronDown,
    X,
    Check,
    LogOut,
  } from 'lucide-react-native';
  import { useAuth, useUser } from '@clerk/clerk-expo';
  import { AmbientBlob } from '@/components/ui/AmbientBlob';
  import { SacredButton } from '@/components/ui/SacredButton';
  import { OAuthButton } from '@/features/auth/OAuthButton';
  import { useSignIn } from '@/features/auth/useSignIn';
  import { useProfile } from '@/features/profile/useProfile';
  import { colors, fonts } from '@/lib/theme';

  type ProfileFieldId = 'name' | 'birth_dt' | 'birth_place';

  const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1, 9, 0);

  const PROFILE_FIELDS: {
    id: ProfileFieldId;
    label: string;
    placeholder: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    autoCapitalize: 'none' | 'words';
  }[] = [
    {
      id: 'name',
      label: 'Name',
      placeholder: 'Enter your full name',
      icon: UserRound,
      autoCapitalize: 'words',
    },
    {
      id: 'birth_dt',
      label: 'Date & Time of Birth',
      placeholder: 'DD/MM/YYYY, HH:MM AM',
      icon: CalendarClock,
      autoCapitalize: 'none',
    },
    {
      id: 'birth_place',
      label: 'Place of Birth',
      placeholder: 'City, State, Country',
      icon: MapPin,
      autoCapitalize: 'words',
    },
  ];

  export default function ProfileScreen() {
    const { isSignedIn, userId, signOut } = useAuth();
    const { user } = useUser();
    const { profile, updateField } = useProfile();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
    const [selectedBirthDateTime, setSelectedBirthDateTime] = useState<Date | null>(null);
    const [isIosDatePickerOpen, setIsIosDatePickerOpen] = useState(false);
    const [iosPickerValue, setIosPickerValue] = useState(DEFAULT_BIRTH_DATE);

    const { signInWithGoogle, signInWithApple, isLoading: isSigningIn } = useSignIn(() => {
      setIsAuthSheetOpen(false);
    });

    const formatBirthDateTime = (value: Date) => {
      const day = String(value.getDate()).padStart(2, '0');
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const year = value.getFullYear();
      const rawHours = value.getHours();
      const minutes = String(value.getMinutes()).padStart(2, '0');
      const meridiem = rawHours >= 12 ? 'PM' : 'AM';
      const hours = rawHours % 12 || 12;
      return `${day}/${month}/${year}, ${hours}:${minutes} ${meridiem}`;
    };

    const saveBirthDateTime = (value: Date) => {
      setSelectedBirthDateTime(value);
      updateField('birth_dt', formatBirthDateTime(value));
    };

    const mergeDateAndTime = (datePart: Date, timePart: Date) =>
      new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        timePart.getHours(),
        timePart.getMinutes()
      );

    const openBirthDateTimePicker = () => {
      Keyboard.dismiss();
      const initialValue = selectedBirthDateTime ?? DEFAULT_BIRTH_DATE;

      if (Platform.OS === 'android') {
        DateTimePickerAndroid.open({
          value: initialValue,
          mode: 'date',
          onChange: (dateEvent, pickedDate) => {
            if (dateEvent.type !== 'set' || !pickedDate) return;
            const chosenDate = pickedDate;
            DateTimePickerAndroid.open({
              value: mergeDateAndTime(chosenDate, initialValue),
              mode: 'time',
              is24Hour: false,
              onChange: (timeEvent, pickedTime) => {
                if (timeEvent.type !== 'set' || !pickedTime) return;
                saveBirthDateTime(mergeDateAndTime(chosenDate, pickedTime));
              },
            });
          },
        });
        return;
      }

      setIosPickerValue(initialValue);
      setIsIosDatePickerOpen(true);
    };

    const closeSettingsDrawer = () => {
      setIsLanguageDropdownOpen(false);
      setIsSettingsOpen(false);
    };

    const selectLanguage = (language: 'English' | 'Hindi') => {
      updateField('language', language);
      setIsLanguageDropdownOpen(false);
    };

    const displayName = profile.name.trim()
      ? profile.name.trim()
      : user?.firstName
        ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
        : 'Your Aksha Profile';

    const initials = user?.firstName
      ? `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
      : '?';

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AmbientBlob color="rgba(212, 190, 228, 0.08)" top={-90} left={-80} size={340} />
        <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={280} left={190} size={280} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            automaticallyAdjustKeyboardInsets
          >
            <View style={styles.headerRow}>
              <Text style={styles.title}>You</Text>
              <View style={styles.headerActions}>
                <View style={styles.planBadge}>
                  <BadgeCheck size={13} color={colors.secondaryFixed} />
                  <Text style={styles.planBadgeText}>Aksha FREE</Text>
                </View>
                <Pressable style={styles.settingsButton} onPress={() => setIsSettingsOpen(true)}>
                  <Settings2 size={18} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
            </View>

            <View style={styles.hero}>
              <View style={styles.avatarGlow} />
              <LinearGradient
                colors={[`${colors.primary}D9`, `${colors.primaryFixedDim}99`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={styles.avatarCore}>
                  {isSignedIn ? (
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  ) : (
                    <UserRound size={58} color={colors.onSurface} strokeWidth={1.7} />
                  )}
                </View>
              </LinearGradient>
              <Text style={styles.heroName}>{displayName}</Text>
              <Text style={styles.heroSub}>
                Keep your core details ready for a more personal spiritual journey.
              </Text>
            </View>

            <View style={styles.sectionList}>
              {PROFILE_FIELDS.map(({ id, label, placeholder, icon: Icon, autoCapitalize }) => (
                <View key={id} style={styles.infoCard}>
                  <View style={styles.infoIconWrap}>
                    <Icon size={18} color={colors.primaryFixed} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>{label}</Text>
                    {id === 'birth_dt' ? (
                      <Pressable style={styles.infoInput} onPress={openBirthDateTimePicker}>
                        <Text
                          style={[
                            styles.infoInputText,
                            !profile[id] && styles.infoInputPlaceholder,
                          ]}
                        >
                          {profile[id] || placeholder}
                        </Text>
                      </Pressable>
                    ) : (
                      <TextInput
                        value={profile[id]}
                        onChangeText={(text) => updateField(id, text)}
                        placeholder={placeholder}
                        placeholderTextColor={colors.outline}
                        autoCapitalize={autoCapitalize}
                        autoCorrect={false}
                        selectionColor={colors.primary}
                        style={styles.infoInput}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <AnimatePresence>
          {isIosDatePickerOpen && (
            <>
              <MotiView
                key="birth-datetime-backdrop"
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 180 }}
                style={styles.drawerBackdrop}
              >
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setIsIosDatePickerOpen(false)}
                />
              </MotiView>

              <MotiView
                key="birth-datetime-sheet"
                from={{ opacity: 0, translateY: 28 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 28 }}
                transition={{ type: 'timing', duration: 220 }}
                style={styles.dateSheetWrap}
              >
                <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.dateSheetOverlay} />
                <SafeAreaView style={styles.dateSheetSafe} edges={['bottom']}>
                  <View style={styles.dateSheetHeader}>
                    <Pressable onPress={() => setIsIosDatePickerOpen(false)}>
                      <Text style={styles.dateSheetAction}>Cancel</Text>
                    </Pressable>
                    <Text style={styles.dateSheetTitle}>Birth Date & Time</Text>
                    <Pressable
                      onPress={() => {
                        saveBirthDateTime(iosPickerValue);
                        setIsIosDatePickerOpen(false);
                      }}
                    >
                      <Text style={styles.dateSheetAction}>Done</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    mode="datetime"
                    display="spinner"
                    value={iosPickerValue}
                    onChange={(_, nextValue) => {
                      if (nextValue) setIosPickerValue(nextValue);
                    }}
                    style={styles.iosDatePicker}
                  />
                </SafeAreaView>
              </MotiView>
            </>
          )}

          {isSettingsOpen && (
            <>
              <MotiView
                key="settings-backdrop"
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 180 }}
                style={styles.drawerBackdrop}
              >
                <Pressable style={StyleSheet.absoluteFill} onPress={closeSettingsDrawer} />
              </MotiView>

              <MotiView
                key="settings-drawer"
                from={{ opacity: 0, translateY: 32 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 32 }}
                transition={{ type: 'timing', duration: 220 }}
                style={styles.drawerWrap}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.drawerOverlay} />

                <SafeAreaView style={styles.drawerSafe} edges={['bottom']}>
                  <View style={styles.drawerHandle} />
                  <View style={styles.drawerHeader}>
                    <View>
                      <Text style={styles.drawerTitle}>Settings</Text>
                      <Text style={styles.drawerSub}>Profile controls and content preferences.</Text>
                    </View>
                    <Pressable style={styles.drawerCloseButton} onPress={closeSettingsDrawer}>
                      <X size={18} color={colors.onSurfaceVariant} />
                    </Pressable>
                  </View>

                  {isSignedIn ? (
                    <>
                      <View style={styles.identityRow}>
                        <View style={styles.identityAvatar}>
                          <Text style={styles.identityInitials}>{initials}</Text>
                        </View>
                        <View style={styles.identityText}>
                          <Text style={styles.identityName}>
                            {user?.firstName} {user?.lastName}
                          </Text>
                          <Text style={styles.identityEmail}>
                            {user?.primaryEmailAddress?.emailAddress ?? ''}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <SacredButton
                      label="Sign In"
                      onPress={() => setIsAuthSheetOpen(true)}
                      style={styles.signInButton}
                    />
                  )}

                  <View style={styles.drawerSection}>
                    <Text style={styles.drawerLabel}>Content Language</Text>
                    <Pressable
                      style={styles.dropdownTrigger}
                      onPress={() => setIsLanguageDropdownOpen((current) => !current)}
                    >
                      <Text style={styles.dropdownTriggerText}>{profile.language}</Text>
                      <ChevronDown
                        size={18}
                        color={colors.onSurfaceVariant}
                        style={isLanguageDropdownOpen ? styles.dropdownChevronOpen : undefined}
                      />
                    </Pressable>

                    {isLanguageDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        {(['English', 'Hindi'] as const).map((language) => {
                          const isSelected = profile.language === language;
                          return (
                            <Pressable
                              key={language}
                              style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                              onPress={() => selectLanguage(language)}
                            >
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  isSelected && styles.dropdownOptionTextSelected,
                                ]}
                              >
                                {language}
                              </Text>
                              {isSelected && <Check size={16} color={colors.primaryFixed} />}
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  <View style={styles.drawerSection}>
                    <Text style={styles.drawerLabel}>Region</Text>
                    <View style={styles.drawerInfoRow}>
                      <Text style={styles.drawerInfoValue}>{profile.region}</Text>
                    </View>
                  </View>

                  <View style={styles.drawerSection}>
                    <Text style={styles.drawerLabel}>User ID</Text>
                    <View style={styles.drawerInfoRow}>
                      <Text style={styles.drawerInfoValue}>
                        {isSignedIn ? (userId?.slice(0, 12) ?? '—') : '—'}
                      </Text>
                    </View>
                  </View>

                  {isSignedIn && (
                    <Pressable
                      style={styles.signOutRow}
                      onPress={async () => {
                        await signOut();
                        closeSettingsDrawer();
                      }}
                    >
                      <LogOut size={16} color={colors.error ?? '#CF6679'} />
                      <Text style={styles.signOutText}>Sign Out</Text>
                    </Pressable>
                  )}
                </SafeAreaView>
              </MotiView>
            </>
          )}

          {isAuthSheetOpen && (
            <>
              <MotiView
                key="auth-backdrop"
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 180 }}
                style={styles.drawerBackdrop}
              >
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setIsAuthSheetOpen(false)}
                />
              </MotiView>

              <MotiView
                key="auth-sheet"
                from={{ opacity: 0, translateY: 28 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 28 }}
                transition={{ type: 'timing', duration: 220 }}
                style={styles.drawerWrap}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.drawerOverlay} />

                <SafeAreaView style={styles.drawerSafe} edges={['bottom']}>
                  <View style={styles.drawerHandle} />
                  <View style={styles.drawerHeader}>
                    <View>
                      <Text style={styles.drawerTitle}>Welcome</Text>
                      <Text style={styles.drawerSub}>Sign in to save your spiritual profile.</Text>
                    </View>
                    <Pressable
                      style={styles.drawerCloseButton}
                      onPress={() => setIsAuthSheetOpen(false)}
                    >
                      <X size={18} color={colors.onSurfaceVariant} />
                    </Pressable>
                  </View>

                  <View style={styles.oauthList}>
                    <OAuthButton
                      provider="google"
                      onPress={signInWithGoogle}
                      isLoading={isSigningIn}
                    />
                    <OAuthButton
                      provider="apple"
                      onPress={signInWithApple}
                      isLoading={isSigningIn}
                    />
                  </View>
                </SafeAreaView>
              </MotiView>
            </>
          )}
        </AnimatePresence>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    flex: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 160,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 36,
    },
    title: {
      fontFamily: fonts.headlineExtra,
      fontSize: 34,
      color: colors.onSurface,
      letterSpacing: -0.8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    planBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 9999,
      backgroundColor: `${colors.secondary}22`,
      borderWidth: 1,
      borderColor: `${colors.secondary}26`,
    },
    planBadgeText: {
      fontFamily: fonts.label,
      fontSize: 10,
      color: colors.secondaryFixed,
      letterSpacing: 1.2,
    },
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${colors.outlineVariant}33`,
    },
    hero: { alignItems: 'center', marginBottom: 36 },
    avatarGlow: {
      position: 'absolute',
      top: 28,
      width: 180,
      height: 180,
      borderRadius: 9999,
      backgroundColor: `${colors.primary}18`,
      shadowColor: colors.primary,
      shadowOpacity: 0.28,
      shadowRadius: 48,
      shadowOffset: { width: 0, height: 0 },
    },
    avatarRing: {
      width: 172,
      height: 172,
      borderRadius: 86,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    avatarCore: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(19, 19, 19, 0.94)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
    },
    avatarInitials: {
      fontFamily: fonts.headline,
      fontSize: 48,
      color: colors.onSurface,
      letterSpacing: -1,
    },
    heroName: {
      fontFamily: fonts.headline,
      fontSize: 26,
      color: colors.onSurface,
      letterSpacing: -0.4,
      marginBottom: 8,
    },
    heroSub: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 280,
    },
    sectionList: { gap: 14 },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 18,
      borderRadius: 24,
      backgroundColor: 'rgba(37, 38, 38, 0.62)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
    infoIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}18`,
    },
    infoText: { flex: 1, gap: 4 },
    infoLabel: {
      fontFamily: fonts.label,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 1.8,
      color: colors.onSurfaceVariant,
    },
    infoInput: {
      fontFamily: fonts.bodyMedium,
      fontSize: 16,
      color: colors.onSurface,
      letterSpacing: -0.2,
      backgroundColor: 'rgba(14, 14, 14, 0.45)',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: `${colors.outlineVariant}40`,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    infoInputText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 16,
      color: colors.onSurface,
      letterSpacing: -0.2,
    },
    infoInputPlaceholder: { color: colors.outline },
    drawerBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 40,
    },
    dateSheetWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 55,
      overflow: 'hidden',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
    },
    dateSheetOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(19, 19, 19, 0.92)',
    },
    dateSheetSafe: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 10,
    },
    dateSheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    dateSheetTitle: {
      fontFamily: fonts.headline,
      fontSize: 17,
      color: colors.onSurface,
      letterSpacing: -0.2,
    },
    dateSheetAction: {
      fontFamily: fonts.label,
      fontSize: 13,
      color: colors.primaryFixed,
    },
    iosDatePicker: { alignSelf: 'stretch' },
    drawerWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      justifyContent: 'flex-end',
    },
    drawerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(19, 19, 19, 0.9)',
    },
    drawerSafe: {
      maxHeight: '78%',
      overflow: 'hidden',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      backgroundColor: 'rgba(19, 19, 19, 0.92)',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 24,
    },
    drawerHandle: {
      alignSelf: 'center',
      width: 44,
      height: 4,
      borderRadius: 9999,
      backgroundColor: `${colors.onSurfaceVariant}66`,
      marginBottom: 18,
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 28,
      gap: 12,
    },
    drawerTitle: {
      fontFamily: fonts.headline,
      fontSize: 24,
      color: colors.onSurface,
      letterSpacing: -0.4,
      marginBottom: 4,
    },
    drawerSub: {
      fontFamily: fonts.body,
      fontSize: 13,
      color: colors.onSurfaceVariant,
      lineHeight: 19,
      maxWidth: 220,
    },
    drawerCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${colors.outlineVariant}33`,
    },
    identityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 28,
      padding: 14,
      borderRadius: 18,
      backgroundColor: `${colors.primary}12`,
      borderWidth: 1,
      borderColor: `${colors.primary}22`,
    },
    identityAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}30`,
    },
    identityInitials: {
      fontFamily: fonts.headline,
      fontSize: 16,
      color: colors.primaryFixed,
    },
    identityText: { flex: 1 },
    identityName: {
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: colors.onSurface,
      marginBottom: 2,
    },
    identityEmail: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.onSurfaceVariant,
    },
    signInButton: {
      alignSelf: 'stretch',
      marginBottom: 24,
    },
    drawerSection: { marginBottom: 18 },
    drawerLabel: {
      fontFamily: fonts.label,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 1.8,
      color: colors.onSurfaceVariant,
      marginBottom: 10,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    dropdownTriggerText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: colors.onSurface,
    },
    dropdownChevronOpen: { transform: [{ rotate: '180deg' }] },
    dropdownMenu: {
      marginTop: 10,
      borderRadius: 18,
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      overflow: 'hidden',
    },
    dropdownOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    dropdownOptionSelected: { backgroundColor: `${colors.primary}14` },
    dropdownOptionText: {
      fontFamily: fonts.body,
      fontSize: 15,
      color: colors.onSurface,
    },
    dropdownOptionTextSelected: {
      fontFamily: fonts.bodyMedium,
      color: colors.primaryFixed,
    },
    drawerInfoRow: {
      borderRadius: 16,
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    drawerInfoValue: {
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: colors.onSurface,
    },
    oauthList: { gap: 12 },
    signOutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: 'rgba(207, 102, 121, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(207, 102, 121, 0.15)',
      marginTop: 8,
    },
    signOutText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: '#CF6679',
    },
  });
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors. If `colors.error` is missing, the `signOutRow` uses the hardcoded `#CF6679` fallback already shown in the code — no fix needed.

- [ ] **Step 3: Run full test suite**

  ```bash
  npx jest --no-coverage
  ```

  Expected: all tests pass

- [ ] **Step 4: Commit**

  ```bash
  git add app/(tabs)/profile.tsx
  git commit -m "feat: wire profile screen to Clerk auth and Supabase useProfile"
  ```

---

## Task 9: Update `app/onboarding/index.tsx` — Write Focus Area

**Files:**
- Modify: `app/onboarding/index.tsx`

- [ ] **Step 1: Add focus_area save on onboarding complete**

  In `app/onboarding/index.tsx`, add these imports after the existing imports:

  ```typescript
  import { useAuth } from '@clerk/clerk-expo';
  import { useProfile } from '@/features/profile/useProfile';
  ```

  Inside `OnboardingScreen`, add after the existing `useState` call:

  ```typescript
  const { isSignedIn } = useAuth();
  const { updateField } = useProfile();
  ```

  Replace the existing `onPress` handler on `SacredButton`:

  ```typescript
  onPress={() => {
    if (!selected) return;
    if (isSignedIn) updateField('focus_area', selected);
    router.replace('/(tabs)');
  }}
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors

- [ ] **Step 3: Run full test suite**

  ```bash
  npx jest --no-coverage
  ```

  Expected: all tests pass

- [ ] **Step 4: Commit**

  ```bash
  git add app/onboarding/index.tsx
  git commit -m "feat: persist onboarding focus_area to Supabase when signed in"
  ```
