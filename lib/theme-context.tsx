import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Appearance } from 'react-native';
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [osScheme, setOsScheme] = useState(Appearance.getColorScheme());
  const isMounted = useRef(true);
  const userSetRef = useRef(false);

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!isMounted.current) return;
      // Don't override if the user explicitly set a preference after mount
      if (userSetRef.current) return;
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
    userSetRef.current = true;
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  }, []);

  const isDark = useMemo(() => {
    if (preference === 'light') return false;
    if (preference === 'dark') return true;
    // osScheme can be null on platforms that don't report a preference.
    // Defaulting null → dark matches Aksha's dark-first design.
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
  factory: (colors: Colors, glassMorphism: GlassMorphism, gradients: Gradients, isDark: boolean) => T
): T {
  const { colors, glassMorphism, gradients, isDark } = useTheme();
  return useMemo(
    () => factory(colors, glassMorphism, gradients, isDark),
    // Factory is expected to be stable (module-level const or useCallback).
    // isDark is the theme toggle — styles recompute only on theme change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark]
  );
}
