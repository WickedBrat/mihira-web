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

  it('throws when used outside ThemeProvider', () => {
    // Suppress expected error output
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used inside ThemeProvider'
    );
    spy.mockRestore();
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
