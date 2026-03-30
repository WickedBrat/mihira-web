export const colors = {
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

  primary: '#d4bee4',
  primaryDim: '#c6b1d6',
  primaryFixed: '#f0dbff',
  primaryFixedDim: '#e3ccf3',
  primaryContainer: '#51405f',
  onPrimary: '#4a3a58',
  onPrimaryFixed: '#493957',

  secondary: '#b8987a',
  secondaryDim: '#b8987a',
  secondaryFixed: '#ffdcbe',
  secondaryFixedDim: '#f2cead',
  secondaryContainer: '#4e371f',
  onSecondary: '#2f1c07',
  onSecondaryContainer: '#dcb99a',

  onSurface: '#e7e5e5',
  onSurfaceVariant: '#acabaa',
  onBackground: '#e7e5e5',
  background: '#0e0e0e',

  outline: '#767575',
  outlineVariant: '#484848',

  error: '#ee7d77',
  errorContainer: '#7f2927',
} as const;

export const fonts = {
  headlineExtra: 'Lexend_800ExtraBold',
  headline: 'Lexend_700Bold',
  label: 'Lexend_600SemiBold',
  bodyMedium: 'Lexend_500Medium',
  body: 'Lexend_400Regular',
  labelLight: 'Lexend_300Light',
} as const;

export const glassMorphism = {
  background: 'rgba(43, 44, 44, 0.6)',
  backgroundLight: 'rgba(43, 44, 44, 0.4)',
  backgroundInput: 'rgba(37, 38, 38, 0.7)',
} as const;

export const gradients = {
  primaryToContainer: [colors.primary, colors.primaryContainer] as const,
  secondaryToContainer: [colors.secondary, colors.secondaryContainer] as const,
  peaceBg: [
    'rgba(149, 0, 255, 0.15)',
    'transparent',
    'rgba(184, 152, 122, 0.1)',
    'transparent',
  ] as const,
} as const;

export type ColorKey = keyof typeof colors;
