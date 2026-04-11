# Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a warm cream/parchment light theme that follows the OS preference by default, with a user override toggle in Settings, applied to all screens including onboarding.

**Architecture:** A new `lib/theme-context.tsx` exports `ThemeProvider`, `useTheme()`, and `useThemedStyles(factory)`. `ThemeProvider` merges OS color scheme with an AsyncStorage preference (`'system' | 'light' | 'dark'`). Components replace top-level `StyleSheet.create` color references with `useThemedStyles((colors) => StyleSheet.create(...))` called inside the component body. The OB onboarding palette gets `OB_DARK`/`OB_LIGHT` variants in `lib/onboardingStore.ts`.

**Tech Stack:** React Native `Appearance` API, `useColorScheme`, `AsyncStorage`, `expo-router`, TypeScript.

---

## Task 1: Update `lib/theme.ts` — add light palette and types

**Files:**
- Modify: `lib/theme.ts`
- Test: `__tests__/lib/theme.test.ts`

- [ ] **Step 1: Write failing tests for new exports**

Replace `__tests__/lib/theme.test.ts` with:

```ts
import {
  darkColors,
  lightColors,
  darkGlassMorphism,
  lightGlassMorphism,
  darkGradients,
  lightGradients,
  fonts,
  layout,
  type Colors,
  type GlassMorphism,
  type Gradients,
} from '@/lib/theme';

describe('theme — dark palette', () => {
  it('exports obsidian surface', () => expect(darkColors.surface).toBe('#0e0e0e'));
  it('exports primary', () => expect(darkColors.primary).toBe('#b564fc'));
  it('exports glassMorphism background', () => expect(darkGlassMorphism.background).toMatch(/rgba/));
});

describe('theme — light palette', () => {
  it('exports cream surface', () => expect(lightColors.surface).toBe('#faf7f2'));
  it('exports deeper violet primary', () => expect(lightColors.primary).toBe('#7c3aed'));
  it('exports dark onSurface text', () => expect(lightColors.onSurface).toBe('#1a1410'));
  it('exports glassMorphism background', () => expect(lightGlassMorphism.background).toMatch(/rgba/));
  it('exports peaceBg gradient', () => expect(lightGradients.peaceBg).toHaveLength(4));
});

describe('theme — shared', () => {
  it('exports Lexend font names', () => {
    expect(fonts.headline).toBe('Lexend_700Bold');
    expect(fonts.body).toBe('Lexend_400Regular');
  });
  it('Colors type has surface token', () => {
    const c: Colors = darkColors;
    expect(c.surface).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npx jest __tests__/lib/theme.test.ts --no-coverage
```

Expected: FAIL — `darkColors` not exported.

- [ ] **Step 3: Replace `lib/theme.ts` with full updated implementation**

```ts
export const darkColors = {
  surface: '#0e0e0e',
  surfaceDim: '#0e0e0e',
  surfaceContainerLowest: '#000000',
  surfaceContainerLow: '#131313',
  surfaceContainer: '#191a1a',
  surfaceContainerHigh: '#1f2020',
  surfaceContainerHighest: '#252626',
  surfaceBright: '#2b2c2c',
  surfaceBrightGlass: 'rgba(43, 44, 44, 0.6)',
  surfaceVariant: '#252626',

  primary: '#b564fc',
  primaryDim: '#c6b1d6',
  primaryFixed: '#f0dbff',
  primaryFixedDim: '#b44affff',
  primaryContainer: '#b564fc',
  onPrimary: '#ffffffff',
  onPrimaryFixed: '#b564fc',

  secondary: '#b8987a',
  secondaryDim: '#b8987a',
  secondaryFixed: '#ff9500ff',
  secondaryFixedDim: '#ff9239',
  secondaryContainer: '#4e371f',
  onSecondary: '#2f1c07',
  onSecondaryContainer: '#dcb99a',

  onSurface: '#fff',
  onSurfaceVariant: '#d3cec9',
  onBackground: '#fff',
  background: '#0e0e0e',

  outline: '#767575',
  outlineVariant: '#484848',

  error: '#ee7d77',
  errorContainer: '#7f2927',
} as const;

export const lightColors = {
  surface: '#faf7f2',
  surfaceDim: '#f5f0e8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2ede4',
  surfaceContainer: '#ede7db',
  surfaceContainerHigh: '#e8e1d4',
  surfaceContainerHighest: '#e2dacb',
  surfaceBright: '#fdfaf6',
  surfaceBrightGlass: 'rgba(250, 247, 242, 0.8)',
  surfaceVariant: '#e8e1d4',

  primary: '#7c3aed',
  primaryDim: '#9a6cc4',
  primaryFixed: '#4c1d95',
  primaryFixedDim: '#6d28d9',
  primaryContainer: '#7c3aed',
  onPrimary: '#ffffff',
  onPrimaryFixed: '#6d28d9',

  secondary: '#92722a',
  secondaryDim: '#92722a',
  secondaryFixed: '#c47c00',
  secondaryFixedDim: '#d4890f',
  secondaryContainer: '#f5e6c8',
  onSecondary: '#5c3f00',
  onSecondaryContainer: '#7a5500',

  onSurface: '#1a1410',
  onSurfaceVariant: '#6b5e4e',
  onBackground: '#1a1410',
  background: '#faf7f2',

  outline: '#a89880',
  outlineVariant: '#d4c8b8',

  error: '#c0392b',
  errorContainer: '#fde8e6',
} as const;

// Legacy re-export so existing code that hasn't been migrated yet keeps working.
// Remove after all 47 files are migrated.
export const colors = darkColors;

export const fonts = {
  headlineExtra: 'Lexend_800ExtraBold',
  headline: 'Lexend_700Bold',
  label: 'Lexend_600SemiBold',
  bodyMedium: 'Lexend_500Medium',
  body: 'Lexend_400Regular',
  labelLight: 'Lexend_300Light',
} as const;

export const darkGlassMorphism = {
  background: 'rgba(43, 44, 44, 0.6)',
  backgroundLight: 'rgba(43, 44, 44, 0.4)',
  backgroundInput: 'rgba(37, 38, 38, 0.7)',
} as const;

export const lightGlassMorphism = {
  background: 'rgba(250, 247, 242, 0.8)',
  backgroundLight: 'rgba(250, 247, 242, 0.6)',
  backgroundInput: 'rgba(242, 237, 228, 0.9)',
} as const;

// Legacy re-export
export const glassMorphism = darkGlassMorphism;

export const darkGradients = {
  primaryToContainer: [darkColors.primary, darkColors.primaryContainer] as const,
  secondaryToContainer: [darkColors.secondary, darkColors.secondaryContainer] as const,
  peaceBg: [
    'rgba(149, 0, 255, 0.15)',
    'transparent',
    'rgba(184, 152, 122, 0.1)',
    'transparent',
  ] as const,
} as const;

export const lightGradients = {
  primaryToContainer: [lightColors.primary, lightColors.primaryContainer] as const,
  secondaryToContainer: [lightColors.secondary, lightColors.secondaryContainer] as const,
  peaceBg: [
    'rgba(124, 58, 237, 0.10)',
    'transparent',
    'rgba(146, 114, 42, 0.08)',
    'transparent',
  ] as const,
} as const;

// Legacy re-export
export const gradients = darkGradients;

export const layout = {
  screenPaddingX: 24,
} as const;

export type Colors = typeof darkColors;
export type GlassMorphism = typeof darkGlassMorphism;
export type Gradients = typeof darkGradients;
export type ColorKey = keyof Colors;
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
npx jest __tests__/lib/theme.test.ts --no-coverage
```

Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add lib/theme.ts __tests__/lib/theme.test.ts
git commit -m "feat: add light colour palette and typed exports to theme.ts"
```

---

## Task 2: Create `lib/theme-context.tsx`

**Files:**
- Create: `lib/theme-context.tsx`
- Create: `__tests__/lib/theme-context.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/theme-context.test.tsx`:

```tsx
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme, useThemedStyles } from '@/lib/theme-context';
import { darkColors, lightColors } from '@/lib/theme';
import { StyleSheet } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme', () => {
  it('defaults to system (dark in test env)', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.preference).toBe('system');
  });

  it('setPreference light switches colors', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await act(async () => {
      result.current.setPreference('light');
    });
    expect(result.current.isDark).toBe(false);
    expect(result.current.colors.surface).toBe(lightColors.surface);
  });

  it('setPreference dark switches colors', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await act(async () => {
      result.current.setPreference('dark');
    });
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors.surface).toBe(darkColors.surface);
  });

  it('persists preference to AsyncStorage', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await act(async () => {
      result.current.setPreference('light');
    });
    const stored = await AsyncStorage.getItem('@aksha/theme-preference');
    expect(stored).toBe('light');
  });
});

describe('useThemedStyles', () => {
  it('returns memoized styles', () => {
    const { result } = renderHook(
      () => useThemedStyles((c) => StyleSheet.create({ box: { backgroundColor: c.surface } })),
      { wrapper }
    );
    expect(result.current.box).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npx jest __tests__/lib/theme-context.test.tsx --no-coverage
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `lib/theme-context.tsx`**

```tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Appearance, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  darkColors,
  lightColors,
  darkGlassMorphism,
  lightGlassMorphism,
  darkGradients,
  lightGradients,
  type Colors,
  type GlassMorphism,
  type Gradients,
} from '@/lib/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@aksha/theme-preference';

interface ThemeContextValue {
  colors: Colors;
  glassMorphism: GlassMorphism;
  gradients: Gradients;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveIsDark(preference: ThemePreference): boolean {
  if (preference === 'light') return false;
  if (preference === 'dark') return true;
  return Appearance.getColorScheme() !== 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  // Track OS changes independently so we can re-resolve 'system' preference
  const [osScheme, setOsScheme] = useState(Appearance.getColorScheme());
  const isMounted = useRef(true);

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!isMounted.current) return;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Listen for OS colour scheme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setOsScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  }, []);

  const isDark = useMemo(() => {
    if (preference === 'light') return false;
    if (preference === 'dark') return true;
    return osScheme !== 'light';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, osScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      glassMorphism: isDark ? darkGlassMorphism : lightGlassMorphism,
      gradients: isDark ? darkGradients : lightGradients,
      isDark,
      preference,
      setPreference,
    }),
    [isDark, preference, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export function useThemedStyles<T>(
  factory: (colors: Colors, glassMorphism: GlassMorphism, gradients: Gradients) => T
): T {
  const { colors, glassMorphism, gradients, isDark } = useTheme();
  return useMemo(
    () => factory(colors, glassMorphism, gradients),
    // isDark is the stable toggle — factory is expected to be stable (defined outside component or useCallback'd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark]
  );
}
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
npx jest __tests__/lib/theme-context.test.tsx --no-coverage
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/theme-context.tsx __tests__/lib/theme-context.test.tsx
git commit -m "feat: add ThemeProvider, useTheme, useThemedStyles"
```

---

## Task 3: Update `app/_layout.tsx`

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update `app/_layout.tsx`**

Replace the file content with:

```tsx
import { useEffect, useRef } from 'react';
import { Stack, SplashScreen, usePathname, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import {
  useFonts,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { PostHogProvider } from 'posthog-react-native';
import { tokenCache } from '@/lib/clerk';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { posthog } from '@/lib/posthog';
import { analytics } from '@/lib/analytics';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_KEY) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');

let StripeProvider: React.FC<any> = ({ children }) => <>{children}</>;
try {
  const StripeModule = require('@stripe/stripe-react-native');
  if (StripeModule.StripeProvider) StripeProvider = StripeModule.StripeProvider;
} catch (e: any) {
  console.warn('Fallback: StripeProvider not found or failed to load. Are you in Expo Go?');
}

function AnalyticsIdentity() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && userId) {
      analytics.userIdentified(userId, {
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
      });
    }
  }, [isSignedIn, userId, user]);

  return null;
}

function ScreenTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return null;
}

function ThemedStack() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="onboarding/index"   options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-2"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-3"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-4"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-5"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-6"  options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding/step-7"  options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding/step-8"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-9"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-10" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-11" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding/step-12" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="sacred-day/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="pricing" options={{ headerShown: false }} />
        <Stack.Screen name="payment-success" options={{ headerShown: false }} />
        <Stack.Screen name="user-profile" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

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
    <ClerkProvider publishableKey={CLERK_KEY!} tokenCache={tokenCache}>
      <ThemeProvider>
        <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
            urlScheme="aksha"
          >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <PostHogProvider
                client={posthog}
                autocapture={{
                  captureScreens: false,
                  captureTouches: true,
                  propsToCapture: ['testID'],
                }}
              >
                <ToastProvider>
                  <AnalyticsIdentity />
                  <ScreenTracker />
                  <ThemedStack />
                </ToastProvider>
              </PostHogProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </StripeProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
```

- [ ] **Step 2: Start the dev server and verify no crash**

```bash
npx expo start --clear
```

Expected: App starts, dark theme active (no visible change yet).

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: wrap app in ThemeProvider, make StatusBar and Stack background reactive"
```

---

## Task 4: Migrate `components/ui/` shared components

**Files:**
- Modify: `components/ui/BottomSheet.tsx`
- Modify: `components/ui/SacredButton.tsx`
- Modify: `components/ui/GlowCard.tsx`
- Modify: `components/ui/GlassCard.tsx`
- Modify: `components/ui/TabBar.tsx`
- Modify: `components/ui/ToastProvider.tsx`
- Modify: `components/ui/PageHero.tsx`

- [ ] **Step 1: Migrate `components/ui/BottomSheet.tsx`**

Replace the file:

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  panEnabled?: boolean;
  showHandle?: boolean;
  safeAreaEdges?: Edge[];
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  zIndex = 50,
  panEnabled = true,
  showHandle = true,
  safeAreaEdges = ['bottom'],
  sheetStyle,
  contentStyle,
}: BottomSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useSharedValue(windowHeight);
  const measuredHeight = useSharedValue(windowHeight);
  const dragStartY = useSharedValue(0);
  const { isDark } = useTheme();

  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.32)',
      },
      sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      },
      sheetOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(19, 19, 19, 0.92)' : 'rgba(250, 247, 242, 0.96)',
      },
      content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
      },
      handle: {
        alignSelf: 'center',
        width: 48,
        height: 5,
        borderRadius: 9999,
        backgroundColor: `${colors.onSurfaceVariant}66`,
        marginBottom: 18,
      },
    })
  );

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = measuredHeight.value + 32;
      translateY.value = withSpring(0, { damping: 50, stiffness: 300 });
      return;
    }
    if (!isMounted) return;
    translateY.value = withTiming(measuredHeight.value + 32, { duration: 220 }, (finished) => {
      if (finished) runOnJS(setIsMounted)(false);
    });
  }, [isMounted, measuredHeight, translateY, visible]);

  const onSheetLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    measuredHeight.value = nextHeight;
    if (!visible) translateY.value = nextHeight + 32;
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(panEnabled)
        .onBegin(() => { dragStartY.value = translateY.value; })
        .onUpdate((event) => {
          translateY.value = Math.max(0, dragStartY.value + event.translationY);
        })
        .onEnd((event) => {
          const shouldClose =
            translateY.value > measuredHeight.value * 0.32 || event.velocityY > 950;
          if (shouldClose) {
            runOnJS(onClose)();
            return;
          }
          translateY.value = withSpring(0, { damping: 22, stiffness: 220 });
        }),
    [dragStartY, measuredHeight, onClose, panEnabled, translateY]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, measuredHeight.value + 32],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) return null;

  const sheet = (
    <Animated.View
      onLayout={onSheetLayout}
      style={[styles.sheet, { zIndex, maxHeight: windowHeight * 0.82 }, sheetAnimatedStyle, sheetStyle]}
    >
      <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.sheetOverlay} />
      <SafeAreaView style={[styles.content, contentStyle]} edges={safeAreaEdges}>
        {showHandle && <View style={styles.handle} />}
        {children}
      </SafeAreaView>
    </Animated.View>
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, { zIndex: zIndex - 1 }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      {panEnabled ? <GestureDetector gesture={panGesture}>{sheet}</GestureDetector> : sheet}
    </View>
  );
}
```

- [ ] **Step 2: Migrate `components/ui/SacredButton.tsx`**

Replace the file. `SacredButton` needs both styles and gradient colors from the theme — a single `useThemedStyles` call returning both works cleanly:

```tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticMedium } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useThemedStyles } from '@/lib/theme-context';

interface SacredButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function SacredButton({ label, onPress, style, icon, variant = 'primary' }: SacredButtonProps) {
  const theme = useThemedStyles((colors, _glass, gradients) => ({
    styles: StyleSheet.create({
      container: {
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      },
      pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
      gradient: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 9999,
        overflow: 'hidden',
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 8,
      },
      label: {
        fontFamily: fonts.label,
        fontSize: scaleFont(16),
        color: colors.onPrimary,
        letterSpacing: 0.5,
      },
    }),
    gradientColors: variant === 'primary'
      ? gradients.primaryToContainer
      : gradients.secondaryToContainer,
  }));

  const handlePress = () => { hapticMedium(); onPress(); };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [theme.styles.container, pressed && theme.styles.pressed, style]}
    >
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={theme.styles.gradient}
      >
        {icon}
        <Text style={theme.styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
```

- [ ] **Step 3: Migrate `components/ui/GlowCard.tsx`**

Replace the file:

```tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedStyles } from '@/lib/theme-context';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowCard({ children, style, glowColor, glowIntensity = 0.2 }: GlowCardProps) {
  const { resolvedGlowColor, styles } = useThemedStyles((colors) => {
    const glow = glowColor ?? colors.primaryFixedDim;
    const hexOpacity = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');
    return {
      resolvedGlowColor: glow,
      glowColorWithAlpha: `${glow}${hexOpacity}`,
      glowColorTransparent: `${glow}00`,
      styles: StyleSheet.create({
        container: { position: 'relative' as const },
        glowCanvas: { position: 'absolute' as const, top: -40, left: 0, right: 0, zIndex: 0, alignItems: 'center' as const },
        card: {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: 24,
          borderWidth: 1,
          overflow: 'hidden' as const,
          zIndex: 1,
          borderColor: `${glow}33`,
        },
      }),
    };
  });

  // Recompute gradient colors inline (they depend on glowColor prop which may change)
  const hexOpacity = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');
  const glowColorWithAlpha = `${resolvedGlowColor}${hexOpacity}`;
  const glowColorTransparent = `${resolvedGlowColor}00`;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[glowColorWithAlpha, glowColorTransparent]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.glowCanvas, { pointerEvents: 'none' }]}
      />
      <View style={[styles.card, { borderColor: `${resolvedGlowColor}33` }]}>
        {children}
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Migrate `components/ui/GlassCard.tsx`**

Replace the file (note: this component doesn't import from `@/lib/theme` but has hardcoded dark values):

```tsx
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  const { isDark } = useTheme();
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(72, 72, 72, 0.15)' : 'rgba(0, 0, 0, 0.08)',
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(37, 38, 38, 0.5)' : 'rgba(250, 247, 242, 0.6)',
      },
      content: { position: 'relative', zIndex: 1 },
    })
  );

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}
```

- [ ] **Step 5: Migrate `components/ui/TabBar.tsx`**

Replace the file:

```tsx
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { BookOpen, Clock, Home, MessageCircle, User } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useGuide } from '@/lib/guideStore';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

const TAB_ICONS = {
  index: Home,
  ask: MessageCircle,
  gurukul: BookOpen,
  muhurat: Clock,
  profile: User,
} as const;

type TabName = keyof typeof TAB_ICONS;

const STATIC_LABELS: Record<TabName, string> = {
  index: 'Home',
  ask: 'Ask',
  gurukul: 'Gurukul',
  muhurat: 'Muhurat',
  profile: 'You',
};

const BAR_PADDING = 4;
const BAR_HEIGHT = 74;
const SELECTOR_HORIZONTAL_INSET = 0;
const SELECTOR_VERTICAL_INSET = 5;
const SPRING = { damping: 22, stiffness: 240, mass: 0.85 };

// Static styles — no color tokens
const staticStyles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  row: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  tab: { flex: 1, minWidth: 0, zIndex: 1, alignItems: 'center', justifyContent: 'center' },
  tabPressed: { opacity: 0.84 },
  tabContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);
  const { guide } = useGuide();
  const { isDark } = useTheme();

  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        width: '95%',
        maxWidth: 620,
        minHeight: BAR_HEIGHT,
        borderRadius: 9999,
        overflow: 'hidden',
        padding: BAR_PADDING,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(18, 18, 22, 0.10)' : 'rgba(250, 247, 242, 0.10)',
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
      },
      containerTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
      },
      selector: {
        position: 'absolute',
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.04)',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      selectorTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      },
      tabLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        lineHeight: scaleFont(12),
        color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
        letterSpacing: 0.2,
        textAlign: 'center',
      },
      tabLabelActive: { color: colors.onSurface },
      iconInactive: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
      iconActive: colors.secondaryFixed,
    } as any)
  );

  const tabs = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeRouteKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(tabs.findIndex((route) => route.key === activeRouteKey), 0);
  const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / tabs.length : 0;
  const selectorWidth = slotWidth > 0 ? Math.max(0, slotWidth - 4) : 0;

  useEffect(() => {
    if (!slotWidth) return;
    selectorX.value = withSpring(activeIndex * slotWidth + SELECTOR_HORIZONTAL_INSET, SPRING);
  }, [activeIndex, selectorX, slotWidth]);

  const selectorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: selectorX.value }] }));
  const handleLayout = (event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width);
  const getLabel = (tabName: TabName): string =>
    tabName === 'ask' && guide ? `Ask ${guide}` : STATIC_LABELS[tabName];

  const inactiveIconColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)';

  return (
    <View pointerEvents="box-none" style={[staticStyles.wrapper, { bottom: 10 }]}>
      <View style={styles.container} onLayout={handleLayout}>
        <BlurView intensity={36} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.containerTint} />
        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selector,
              { width: selectorWidth, left: BAR_PADDING, right: BAR_PADDING, top: SELECTOR_VERTICAL_INSET, bottom: SELECTOR_VERTICAL_INSET },
              selectorStyle,
            ]}
          >
            <View style={styles.selectorTint} />
          </Animated.View>
        ) : null}
        <View style={staticStyles.row}>
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabName = route.name as TabName;
            const Icon = TAB_ICONS[tabName];
            const label = getLabel(tabName);
            const iconColor = isFocused ? (styles as any).iconActive : inactiveIconColor;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                key={route.key}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                onPress={() => {
                  hapticLight();
                  const event = navigation.emit({ canPreventDefault: true, target: route.key, type: 'tabPress' });
                  if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                }}
                style={({ pressed }) => [staticStyles.tab, pressed && staticStyles.tabPressed]}
              >
                <View style={staticStyles.tabContent}>
                  <Icon size={isFocused ? 21 : 20} color={iconColor} fill={iconColor} strokeWidth={isFocused ? 2.15 : 1.7} />
                  <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 6: Migrate `components/ui/PageHero.tsx`**

Replace the file:

```tsx
import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useThemedStyles } from '@/lib/theme-context';

interface PageHeroProps {
  meta?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  style?: ViewStyle;
  metaStyle?: TextStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  subtitleMaxWidth?: number;
}

export function PageHero({
  meta, title, subtitle, style, metaStyle, titleStyle, subtitleStyle, subtitleMaxWidth = 340,
}: PageHeroProps) {
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: { alignSelf: 'stretch', alignItems: 'center', paddingTop: 28, paddingBottom: 40 },
      meta: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        textTransform: 'uppercase',
        letterSpacing: 3,
        color: colors.secondaryFixed,
        marginBottom: 12,
        textAlign: 'center',
      },
      title: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(42),
        color: colors.onSurface,
        letterSpacing: -1,
        lineHeight: scaleFont(46),
        marginBottom: 8,
        textAlign: 'center',
      },
      subtitle: {
        fontFamily: fonts.body,
        fontSize: scaleFont(16),
        lineHeight: scaleFont(24),
        color: colors.onSurfaceVariant,
        textAlign: 'center',
      },
    })
  );

  return (
    <View style={[styles.container, style]}>
      {meta ? <Text style={[styles.meta, metaStyle]}>{meta}</Text> : null}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle, { maxWidth: subtitleMaxWidth }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
```

- [ ] **Step 7: Migrate `components/ui/ToastProvider.tsx`**

In `ToastProvider.tsx`, the `TOAST_ACCENTS` map is defined at module level using `colors`. Move it inside the component. Replace the file with the same content but make these specific changes:

1. Replace `import { colors, fonts } from '@/lib/theme';` with `import { fonts } from '@/lib/theme';`
2. Add `import { useTheme, useThemedStyles } from '@/lib/theme-context';`
3. Remove the module-level `TOAST_ACCENTS` constant
4. Inside `ToastProvider`, add:
   ```tsx
   const { colors } = useTheme();
   const TOAST_ACCENTS: Record<ToastType, string> = {
     success: colors.primaryFixed,
     error: colors.error,
     info: colors.secondaryFixed,
   };
   ```
5. Add `useThemedStyles` call inside `ToastProvider` for all styles that use color tokens (container background, text colors, icon colors). Read the full file to identify all color references, then wrap the `StyleSheet.create` call inside `useThemedStyles`.

Read the full file first: `cat components/ui/ToastProvider.tsx`, then apply the pattern above.

- [ ] **Step 8: Verify app renders correctly on both themes**

In the running dev server, open the app. Toggle the OS to light mode (Settings → Display) and confirm TabBar, BottomSheet, and SacredButton update their colours.

- [ ] **Step 9: Commit**

```bash
git add components/ui/
git commit -m "feat: migrate components/ui to useThemedStyles"
```

---

## Task 5: Migrate `features/profile/components/`

**Files:**
- Modify: `features/profile/components/ProfileSettingsSheet.tsx`
- Modify: `features/profile/components/ProfileHero.tsx`
- Modify: `features/profile/components/ProfileHeader.tsx`
- Modify: `features/profile/components/ProfileFields.tsx`
- Modify: `features/profile/components/ProfileDateTimeSheet.tsx`
- Modify: `features/profile/components/ProfileAuthSheet.tsx`

**Migration pattern for every file in this task:**

1. Replace `import { colors, fonts } from '@/lib/theme';` with `import { fonts } from '@/lib/theme';`
2. Add `import { useThemedStyles } from '@/lib/theme-context';`
3. Move the `StyleSheet.create({...})` call from module level into the component body, wrapped in `useThemedStyles`:
   ```ts
   const styles = useThemedStyles((colors) => StyleSheet.create({ ... }));
   ```
4. Any style properties that reference `colors.xxx` now work correctly because `colors` is the factory parameter.

- [ ] **Step 1: Migrate `ProfileSettingsSheet.tsx`**

Read the file, then apply the pattern. The component function is `ProfileSettingsSheet`. Insert `const styles = useThemedStyles((colors) => StyleSheet.create({ ... }));` as the first line inside the function body, with all existing style rules moved inside the factory. Remove the module-level `const styles = StyleSheet.create({...})`.

Also note that `borderColor: 'rgba(255,255,255,0.05)'` borders (hardcoded white) should become `isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'`. Add `const { isDark } = useTheme();` (import `useTheme` too) to handle these.

- [ ] **Step 2: Migrate `ProfileHero.tsx`**

Apply the same pattern. Read `features/profile/components/ProfileHero.tsx`, move `StyleSheet.create` into `useThemedStyles`.

- [ ] **Step 3: Migrate `ProfileHeader.tsx`**

Apply the same pattern to `features/profile/components/ProfileHeader.tsx`.

- [ ] **Step 4: Migrate `ProfileFields.tsx`**

Apply the same pattern to `features/profile/components/ProfileFields.tsx`.

- [ ] **Step 5: Migrate `ProfileDateTimeSheet.tsx`**

Apply the same pattern to `features/profile/components/ProfileDateTimeSheet.tsx`.

- [ ] **Step 6: Migrate `ProfileAuthSheet.tsx`**

Apply the same pattern to `features/profile/components/ProfileAuthSheet.tsx`.

- [ ] **Step 7: Commit**

```bash
git add features/profile/
git commit -m "feat: migrate features/profile to useThemedStyles"
```

---

## Task 6: Migrate `features/billing/`, `features/daily/`, `features/horoscope/`

**Files:**
- Modify: `features/billing/PaywallSheet.tsx`
- Modify: `features/billing/PlansScreen.tsx`
- Modify: `features/daily/DailyArthCard.tsx`
- Modify: `features/daily/SacredDayCard.tsx`
- Modify: `features/daily/LessonCard.tsx`
- Modify: `features/horoscope/DailyAlignmentCard.tsx`
- Modify: `features/horoscope/FocusAreaCard.tsx`
- Modify: `features/horoscope/FocusAreaChips.tsx`
- Modify: `features/horoscope/TimeOfDayCard.tsx`
- Modify: `features/horoscope/TimelineItem.tsx`
- Modify: `features/horoscope/VedicReasoningAccordion.tsx`

**Migration pattern** — same as Task 5 for every file:
1. Replace `import { colors[, fonts, gradients] } from '@/lib/theme';` — keep only `fonts` (or other non-color exports)
2. Add `import { useThemedStyles } from '@/lib/theme-context';`
3. Move `StyleSheet.create` into `useThemedStyles((colors[, glass, gradients]) => StyleSheet.create({...}))`
4. If `gradients` is used (e.g. in `LinearGradient`), pass it through the factory third parameter
5. Hardcoded white rgba borders → `isDark ? 'rgba(255,255,255,...)' : 'rgba(0,0,0,...)'`

- [ ] **Step 1: Migrate all billing files**

Read each file, apply the pattern, save.

`features/billing/PaywallSheet.tsx` — move `StyleSheet.create` into `useThemedStyles`.
`features/billing/PlansScreen.tsx` — move `StyleSheet.create` into `useThemedStyles`.

- [ ] **Step 2: Migrate all daily files**

Read each file, apply the pattern, save.

`features/daily/DailyArthCard.tsx`
`features/daily/SacredDayCard.tsx`
`features/daily/LessonCard.tsx`

- [ ] **Step 3: Migrate all horoscope files**

Read each file, apply the pattern, save.

`features/horoscope/DailyAlignmentCard.tsx` — example after migration:

```tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FocusAreaCard } from './FocusAreaCard';
import { fonts } from '@/lib/theme';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';
import { useThemedStyles } from '@/lib/theme-context';

interface Props {
  chart: BirthChart | null;
  focusAreas: DailyFocusArea[];
  isLoading: boolean;
  error: string | null;
}

export function DailyAlignmentCard({ chart, focusAreas, isLoading, error }: Props) {
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: { gap: 0 },
      lagnaLabel: {
        fontFamily: fonts.label,
        fontSize: 9,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: colors.secondaryFixed,
        marginBottom: 20,
      },
      center: { alignItems: 'center', gap: 12, paddingVertical: 24 },
      loadingText: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant },
      errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.error, textAlign: 'center' },
      emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22 },
    })
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={styles.lagnaLabel.color} />
        <Text style={styles.loadingText}>Reading the cosmos…</Text>
      </View>
    );
  }
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (focusAreas.length === 0) return <Text style={styles.emptyText}>Add your birth details in Profile to unlock your daily alignment.</Text>;

  return (
    <View style={styles.container}>
      {chart && <Text style={styles.lagnaLabel}>{chart.lagna} Rising · {chart.nakshatra} Moon · {chart.currentDasha}</Text>}
      {focusAreas.map((area, index) => (
        <FocusAreaCard key={area.area} focusArea={area} isLast={index === focusAreas.length - 1} />
      ))}
    </View>
  );
}
```

Apply the same pattern to `FocusAreaCard`, `FocusAreaChips`, `TimeOfDayCard`, `TimelineItem`, `VedicReasoningAccordion`.

- [ ] **Step 4: Commit**

```bash
git add features/billing/ features/daily/ features/horoscope/
git commit -m "feat: migrate billing, daily, horoscope features to useThemedStyles"
```

---

## Task 7: Migrate `features/gurukul/`, `features/muhurat/`, `features/ask/`, `features/chat/`, `features/auth/`, `features/onboarding/`

**Files:**
- Modify: `features/gurukul/LessonRow.tsx`
- Modify: `features/gurukul/FeaturedCard.tsx`
- Modify: `features/gurukul/CategoryCard.tsx`
- Modify: `features/muhurat/MuhuratCard.tsx`
- Modify: `features/muhurat/components/MuhuratDateSheet.tsx`
- Modify: `features/ask/GuideSelector.tsx`
- Modify: `features/ask/GuideLoader.tsx`
- Modify: `features/chat/ChatBubble.tsx`
- Modify: `features/chat/ChatInput.tsx`
- Modify: `features/auth/OAuthButton.tsx`
- Modify: `features/onboarding/ChoiceCard.tsx`

**Migration pattern** — same as Tasks 5–6 for every file.

- [ ] **Step 1: Migrate gurukul files**

`features/gurukul/LessonRow.tsx` — example after migration:

```tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useThemedStyles } from '@/lib/theme-context';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  category: string;
}

interface LessonRowProps {
  lesson: Lesson;
  onPress?: () => void;
}

export function LessonRow({ lesson, onPress }: LessonRowProps) {
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      pressable: { borderRadius: 16, overflow: 'hidden' },
      pressed: { opacity: 0.75 },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: `${colors.outlineVariant}33`,
      },
      thumbnail: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: colors.surfaceContainer,
      },
      text: { flex: 1 },
      title: { fontFamily: fonts.bodyMedium, fontSize: scaleFont(14), color: colors.onSurface, marginBottom: 4 },
      meta: { fontFamily: fonts.body, fontSize: scaleFont(12), color: colors.onSurfaceVariant },
      playIcon: { color: colors.primaryFixed },
    })
  );

  return (
    <Pressable
      onPress={() => { hapticLight(); onPress?.(); }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.thumbnail} />
        <View style={styles.text}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.meta}>{lesson.duration} · {lesson.category}</Text>
        </View>
        <Play size={18} color={styles.playIcon.color} />
      </View>
    </Pressable>
  );
}
```

Apply the pattern to `FeaturedCard.tsx` and `CategoryCard.tsx` (read each file first).

- [ ] **Step 2: Migrate muhurat files**

Read and apply the pattern to `features/muhurat/MuhuratCard.tsx` and `features/muhurat/components/MuhuratDateSheet.tsx`.

- [ ] **Step 3: Migrate ask files**

Read and apply the pattern to `features/ask/GuideSelector.tsx` and `features/ask/GuideLoader.tsx`.

- [ ] **Step 4: Migrate chat files**

`features/chat/ChatBubble.tsx` — example after migration:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import type { Message } from './useChatState';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

export function ChatBubble({ message, senderName = 'Aksha' }: ChatBubbleProps) {
  const { isDark } = useTheme();
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      row: { maxWidth: '85%', gap: 6 },
      rowAI: { alignSelf: 'flex-start', alignItems: 'flex-start' },
      rowUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
      senderRow: { paddingHorizontal: 6, marginBottom: 2 },
      senderLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.secondaryDim,
      },
      bubble: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 28 },
      bubbleAI: {
        backgroundColor: isDark ? 'rgba(242, 206, 173, 0.1)' : 'rgba(146, 114, 42, 0.08)',
        borderTopLeftRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(242, 206, 173, 0.05)' : 'rgba(146, 114, 42, 0.10)',
      },
      bubbleUser: {
        backgroundColor: isDark ? 'rgba(212, 190, 228, 0.08)' : 'rgba(124, 58, 237, 0.07)',
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(212, 190, 228, 0.05)' : 'rgba(124, 58, 237, 0.10)',
      },
      text: { fontFamily: fonts.body, fontSize: scaleFont(15), color: colors.onSurface, lineHeight: scaleFont(22) },
      timestamp: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.outline,
        paddingHorizontal: 10,
      },
    })
  );

  const isAI = message.role === 'ai';

  return (
    <Animated.View
      entering={isAI ? FadeIn.duration(700) : SlideInRight.duration(400)}
      style={[styles.row, isAI ? styles.rowAI : styles.rowUser]}
    >
      {isAI && <View style={styles.senderRow}><Text style={styles.senderLabel}>{senderName}</Text></View>}
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={styles.text}>{message.text}</Text>
      </View>
      {!isAI && (
        <Text style={styles.timestamp}>
          Sent · {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </Animated.View>
  );
}
```

Read and apply the pattern to `features/chat/ChatInput.tsx`.

- [ ] **Step 5: Migrate auth and onboarding feature files**

`features/auth/OAuthButton.tsx` — after migration:

```tsx
import React from 'react';
import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

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
  const { isDark } = useTheme();
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      button: {
        borderRadius: 16,
        backgroundColor: colors.surfaceContainerLow,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
      },
      pressed: { opacity: 0.7 },
      inner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
      symbolWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      },
      symbol: { fontFamily: fonts.headline, fontSize: 14, color: colors.onSurface },
      label: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.onSurface },
      placeholder: { width: 20 },
    })
  );

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
        {isLoading ? <ActivityIndicator size="small" color={styles.label.color} /> : <View style={styles.placeholder} />}
      </View>
    </Pressable>
  );
}
```

`features/onboarding/ChoiceCard.tsx` — after migration:

```tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { SlideInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

interface ChoiceCardProps {
  icon: string;
  title: string;
  subtitle: string;
  isSelected: boolean;
  onPress: () => void;
  enterDelay?: number;
  style?: ViewStyle;
}

export function ChoiceCard({ icon, title, subtitle, isSelected, onPress, enterDelay = 0, style }: ChoiceCardProps) {
  const scale = useSharedValue(1);
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      card: {
        backgroundColor: colors.surfaceContainer,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${colors.outlineVariant}33`,
        padding: 24,
        flex: 1,
      },
      cardSelected: {
        borderColor: `${colors.primary}66`,
        backgroundColor: `${colors.primary}12`,
      },
      icon: { fontSize: 28, marginBottom: 12 },
      title: { fontFamily: fonts.headline, fontSize: 18, color: colors.onSurface, marginBottom: 6 },
      subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },
    })
  );

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handlePress = () => {
    hapticLight();
    scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <Animated.View entering={SlideInRight.delay(enterDelay).springify()} style={style}>
      <Animated.View style={animStyle}>
        <Pressable onPress={handlePress} style={[styles.card, isSelected && styles.cardSelected]}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add features/gurukul/ features/muhurat/ features/ask/ features/chat/ features/auth/ features/onboarding/
git commit -m "feat: migrate remaining feature components to useThemedStyles"
```

---

## Task 8: Migrate `app/(tabs)/` screens and remaining `app/` screens

**Files:**
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/ask.tsx`
- Modify: `app/(tabs)/muhurat.tsx`
- Modify: `app/(tabs)/gurukul.tsx`
- Modify: `app/(tabs)/profile.tsx`
- Modify: `app/sacred-day/[id].tsx`
- Modify: `app/pricing.tsx`
- Modify: `app/payment-success.tsx`
- Modify: `app/user-profile.tsx`

**Migration pattern** — same as previous tasks.

- [ ] **Step 1: Migrate `app/(tabs)/ask.tsx`**

Read the file, then apply the pattern:
1. Replace `import { colors, fonts, layout } from '@/lib/theme';` with `import { fonts, layout } from '@/lib/theme';`
2. Add `import { useTheme, useThemedStyles } from '@/lib/theme-context';`
3. Move `StyleSheet.create` into `useThemedStyles` inside the screen component
4. For the `AskBackdrop` sub-component (which is defined in the same file), apply the same pattern — it also gets `useThemedStyles` inside its function body

- [ ] **Step 2: Migrate `app/(tabs)/index.tsx`**

Read the file and apply the pattern.

- [ ] **Step 3: Migrate `app/(tabs)/muhurat.tsx`**

Read the file and apply the pattern.

- [ ] **Step 4: Migrate `app/(tabs)/gurukul.tsx`**

Read the file and apply the pattern.

- [ ] **Step 5: Migrate `app/(tabs)/profile.tsx`**

Read the file and apply the pattern. Note: `colors` is used in `styles.container` (`backgroundColor: colors.surface`). After migration that moves into `useThemedStyles`.

- [ ] **Step 6: Migrate `app/sacred-day/[id].tsx`**

Read the file and apply the pattern.

- [ ] **Step 7: Migrate `app/pricing.tsx`, `app/payment-success.tsx`, `app/user-profile.tsx`**

These screens already use light backgrounds (currently hardcoded). Read each file and apply the pattern. Their light-background feel will now come from `colors.background` (which is cream in light mode).

- [ ] **Step 8: Commit**

```bash
git add app/
git commit -m "feat: migrate all app screens to useThemedStyles"
```

---

## Task 9: Migrate onboarding screens (`lib/onboardingStore.ts` + `app/onboarding/`)

**Files:**
- Modify: `lib/onboardingStore.ts`
- Modify: `app/onboarding/index.tsx`
- Modify: `app/onboarding/step-2.tsx` through `step-12.tsx` (11 files)

- [ ] **Step 1: Add `OB_DARK` and `OB_LIGHT` to `lib/onboardingStore.ts`**

In `lib/onboardingStore.ts`, rename `OB` to `OB_DARK` and add `OB_LIGHT`. Also keep a `OB` re-export for backward compatibility during migration:

```ts
export const OB_DARK = {
  bg:            '#07090C',
  saffron:       '#E07A5F',
  saffronDim:    'rgba(224,122,95,0.15)',
  saffronBorder: 'rgba(224,122,95,0.45)',
  gold:          '#D9A06F',
  goldDim:       'rgba(217,160,111,0.12)',
  goldBorder:    'rgba(217,160,111,0.4)',
  text:          '#F0EDE8',
  muted:         '#8E8880',
  card:          'rgba(255,255,255,0.04)',
  cardBorder:    'rgba(255,255,255,0.09)',
  divider:       'rgba(255,255,255,0.07)',
} as const;

export const OB_LIGHT = {
  bg:            '#faf7f2',
  saffron:       '#c0543a',
  saffronDim:    'rgba(192, 84, 58, 0.12)',
  saffronBorder: 'rgba(192, 84, 58, 0.35)',
  gold:          '#a06030',
  goldDim:       'rgba(160, 96, 48, 0.10)',
  goldBorder:    'rgba(160, 96, 48, 0.30)',
  text:          '#1a1410',
  muted:         '#6b5e4e',
  card:          'rgba(0, 0, 0, 0.04)',
  cardBorder:    'rgba(0, 0, 0, 0.08)',
  divider:       'rgba(0, 0, 0, 0.06)',
} as const;

// Legacy re-export — remove after all onboarding screens are migrated
export const OB = OB_DARK;

export type OBPalette = typeof OB_DARK;
```

- [ ] **Step 2: Run existing tests to make sure nothing broke**

```bash
npx jest --no-coverage
```

Expected: all tests pass (OB re-export keeps backward compatibility).

- [ ] **Step 3: Migrate `app/onboarding/index.tsx`**

In `index.tsx` (and each subsequent step), replace:
```ts
import { OB } from '@/lib/onboardingStore';
```
with:
```ts
import { OB_DARK, OB_LIGHT } from '@/lib/onboardingStore';
import { useTheme } from '@/lib/theme-context';
```

Inside the component, add:
```ts
const { isDark } = useTheme();
const OB = isDark ? OB_DARK : OB_LIGHT;
```

All existing `OB.xxx` references then work unchanged.

- [ ] **Step 4: Migrate all remaining onboarding steps**

Apply the same three-line change to each of `step-2.tsx` through `step-12.tsx`. Each file:
1. Update the import
2. Add `const { isDark } = useTheme();`
3. Add `const OB = isDark ? OB_DARK : OB_LIGHT;`

- [ ] **Step 5: Remove the legacy `OB` re-export from `lib/onboardingStore.ts`**

Once all onboarding screens are migrated, remove the `export const OB = OB_DARK;` line.

- [ ] **Step 6: Commit**

```bash
git add lib/onboardingStore.ts app/onboarding/
git commit -m "feat: add OB_LIGHT palette and migrate onboarding screens to theme-aware OB"
```

---

## Task 10: Add Appearance toggle to Settings

**Files:**
- Modify: `features/profile/components/ProfileSettingsSheet.tsx`
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Add the Appearance section to `ProfileSettingsSheet`**

Add two new props to the `ProfileSettingsSheetProps` interface:

```ts
themePreference: 'system' | 'light' | 'dark';
onSetThemePreference: (p: 'system' | 'light' | 'dark') => void;
```

Add the Appearance section above the "Content Language" section inside the `ScrollView`. Insert after the sign-out row (or sign-in button) and before `<View style={styles.section}>` for Content Language:

```tsx
<View style={styles.section}>
  <Text style={styles.label}>Appearance</Text>
  <View style={styles.appearanceRow}>
    {(['system', 'light', 'dark'] as const).map((option) => {
      const isActive = themePreference === option;
      const labels = { system: 'System', light: 'Light', dark: 'Dark' };
      return (
        <Pressable
          key={option}
          style={[styles.appearanceOption, isActive && styles.appearanceOptionActive]}
          onPress={() => onSetThemePreference(option)}
        >
          {isActive && <Check size={13} color={colors.primaryFixed} style={styles.appearanceCheck} />}
          <Text style={[styles.appearanceOptionText, isActive && styles.appearanceOptionTextActive]}>
            {labels[option]}
          </Text>
        </Pressable>
      );
    })}
  </View>
</View>
```

Add to `styles` (inside `useThemedStyles`):

```ts
appearanceRow: {
  flexDirection: 'row',
  gap: 8,
},
appearanceOption: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  paddingVertical: 12,
  borderRadius: 14,
  backgroundColor: colors.surfaceContainerLow,
  borderWidth: 1,
  borderColor: `${colors.outlineVariant}44`,
},
appearanceOptionActive: {
  backgroundColor: `${colors.primary}12`,
  borderColor: `${colors.primary}44`,
},
appearanceCheck: {},
appearanceOptionText: {
  fontFamily: fonts.bodyMedium,
  fontSize: 13,
  color: colors.onSurfaceVariant,
},
appearanceOptionTextActive: {
  color: colors.primaryFixed,
},
```

- [ ] **Step 2: Wire the new props in `app/(tabs)/profile.tsx`**

Import `useTheme` and `ThemePreference`:

```ts
import { useTheme } from '@/lib/theme-context';
import type { ThemePreference } from '@/lib/theme-context';
```

Inside `ProfileScreen`, destructure from `useTheme`:

```ts
const { preference: themePreference, setPreference: setThemePreference } = useTheme();
```

Pass to `ProfileSettingsSheet`:

```tsx
<ProfileSettingsSheet
  ...existing props...
  themePreference={themePreference}
  onSetThemePreference={setThemePreference}
/>
```

- [ ] **Step 3: Verify the toggle works end-to-end**

1. Open the app
2. Navigate to Profile → Settings (gear icon)
3. Tap "Light" — app switches to warm cream palette immediately
4. Tap "Dark" — app switches back
5. Tap "System" — app follows OS
6. Kill and relaunch app — preference is restored

- [ ] **Step 4: Commit**

```bash
git add features/profile/components/ProfileSettingsSheet.tsx app/(tabs)/profile.tsx
git commit -m "feat: add appearance toggle (System/Light/Dark) to Profile Settings"
```

---

## Task 11: Clean up legacy re-exports and update tests

**Files:**
- Modify: `lib/theme.ts` (remove legacy re-exports)
- Modify: `lib/onboardingStore.ts` (if not already done in Task 9)
- Modify: `__tests__/lib/theme.test.ts`

- [ ] **Step 1: Verify no remaining usages of legacy `colors` import**

```bash
grep -r "import { colors" app/ features/ components/ lib/ --include="*.ts" --include="*.tsx"
```

Expected: zero results. If any remain, migrate them before proceeding.

- [ ] **Step 2: Remove legacy re-exports from `lib/theme.ts`**

Remove these three lines:

```ts
// Remove:
export const colors = darkColors;
export const glassMorphism = darkGlassMorphism;
export const gradients = darkGradients;
```

- [ ] **Step 3: Run all tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 4: Final commit**

```bash
git add lib/theme.ts __tests__/
git commit -m "chore: remove legacy theme re-exports, all consumers migrated"
```

---

## Self-Review Notes

- `useThemedStyles` memoizes on `isDark` toggle — the `factory` function must be stable (not an inline arrow recreated each render that closes over changing values like `variant` in `SacredButton`). The `SacredButton` example above handles this correctly by including `variant` in the factory closure at the time of the memoized call; since `variant` is a prop, it changes rarely and the memoization cost is acceptable.
- `BlurView` tint (`'dark'` / `'light'`) must be toggled alongside color palette — done in BottomSheet, GlassCard, TabBar.
- The `glowColor` prop in `GlowCard` is passed in by callers; it's not theme-derived. The default fallback (`colors.primaryFixedDim`) is theme-derived correctly.
- All hardcoded `'rgba(255,255,255,...)'` borders in migrated files must be converted to theme-aware values using `isDark` — flagged in each relevant task.
