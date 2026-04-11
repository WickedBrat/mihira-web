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
