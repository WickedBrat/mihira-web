// Type definition for color palettes - ensures lightColors and darkColors have the same shape
type ColorPalette = {
  surface: string;
  surfaceDim: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceBrightGlass: string;
  surfaceVariant: string;
  primary: string;
  primaryDim: string;
  primaryFixed: string;
  primaryFixedDim: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryFixed: string;
  secondary: string;
  secondaryDim: string;
  secondaryFixed: string;
  secondaryFixedDim: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;
  background: string;
  outline: string;
  outlineVariant: string;
  error: string;
  errorContainer: string;
};

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
  primaryFixedDim: '#b44aff',
  primaryContainer: '#b564fc',
  onPrimary: '#ffffff',
  onPrimaryFixed: '#b564fc',

  secondary: '#ff9500',
  secondaryDim: '#ff9500',
  secondaryFixed: '#ff9500',
  secondaryFixedDim: '#ff9239',
  secondaryContainer: '#4e371f',
  onSecondary: '#2f1c07',
  onSecondaryContainer: '#dcb99a',

  onSurface: '#fff',
  onSurfaceVariant: '#aee3ffff',
  onBackground: '#fff',
  background: '#0e0e0e',

  outline: '#767575',
  outlineVariant: '#484848',

  error: '#ee7d77',
  errorContainer: '#7f2927',
} as const satisfies ColorPalette;

export type Colors = ColorPalette;

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
} as const satisfies ColorPalette;

export const fonts = {
  headlineExtra: 'GoogleSans_700Bold',
  headline: 'GoogleSans_700Bold',
  label: 'GoogleSans_600SemiBold',
  bodyMedium: 'GoogleSans_500Medium',
  body: 'GoogleSans_400Regular',
  labelLight: 'GoogleSans_400Regular',
} as const;

type GlassMorphismType = {
  background: string;
  backgroundLight: string;
  backgroundInput: string;
};

export const darkGlassMorphism = {
  background: 'rgba(43, 44, 44, 0.6)',
  backgroundLight: 'rgba(43, 44, 44, 0.4)',
  backgroundInput: 'rgba(37, 38, 38, 0.7)',
} as const satisfies GlassMorphismType;

export const lightGlassMorphism = {
  background: 'rgba(250, 247, 242, 0.8)',
  backgroundLight: 'rgba(250, 247, 242, 0.6)',
  backgroundInput: 'rgba(242, 237, 228, 0.9)',
} as const satisfies GlassMorphismType;

export type GlassMorphism = GlassMorphismType;


type GradientsType = {
  primaryToContainer: readonly [string, string];
  secondaryToContainer: readonly [string, string];
  peaceBg: readonly [string, string, string, string];
};

export const darkGradients = {
  primaryToContainer: [darkColors.primary, darkColors.primaryContainer] as const,
  secondaryToContainer: [darkColors.secondary, darkColors.secondaryContainer] as const,
  peaceBg: [
    'rgba(149, 0, 255, 0.15)',
    'transparent',
    'rgba(184, 152, 122, 0.1)',
    'transparent',
  ] as const,
} as const satisfies GradientsType;

export const lightGradients = {
  primaryToContainer: [lightColors.primary, lightColors.primaryContainer] as const,
  secondaryToContainer: [lightColors.secondary, lightColors.secondaryContainer] as const,
  peaceBg: [
    'rgba(124, 58, 237, 0.10)',
    'transparent',
    'rgba(146, 114, 42, 0.08)',
    'transparent',
  ] as const,
} as const satisfies GradientsType;

export type Gradients = GradientsType;


export const layout = {
  screenPaddingX: 24,
} as const;

export type ColorKey = keyof Colors;

const tailwindColorKeys = [
  'surface',
  'surfaceDim',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'surfaceBright',
  'surfaceVariant',
  'primary',
  'primaryDim',
  'primaryFixed',
  'primaryFixedDim',
  'primaryContainer',
  'onPrimary',
  'onPrimaryFixed',
  'secondary',
  'secondaryDim',
  'secondaryFixed',
  'secondaryFixedDim',
  'secondaryContainer',
  'onSecondary',
  'onSecondaryContainer',
  'onSurface',
  'onSurfaceVariant',
  'onBackground',
  'background',
  'outline',
  'outlineVariant',
  'error',
  'errorContainer',
] as const satisfies readonly (keyof Colors)[];

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function hexToRgbChannels(hex: string) {
  const normalized = hex.replace('#', '');
  const expanded = normalized.length === 3 || normalized.length === 4
    ? normalized
        .split('')
        .map((char) => `${char}${char}`)
        .join('')
    : normalized;
  const rgbOnly = expanded.length === 8 ? expanded.slice(0, 6) : expanded;

  if (rgbOnly.length !== 6 || /[^0-9a-f]/i.test(rgbOnly)) {
    throw new Error(`Expected a 3-, 4-, 6-, or 8-digit hex color, received "${hex}"`);
  }

  const red = Number.parseInt(rgbOnly.slice(0, 2), 16);
  const green = Number.parseInt(rgbOnly.slice(2, 4), 16);
  const blue = Number.parseInt(rgbOnly.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

export function getThemeColorVariables(colors: Colors) {
  return Object.fromEntries(
    tailwindColorKeys.map((key) => [`--color-${toKebabCase(key)}`, hexToRgbChannels(colors[key])])
  ) as Record<`--color-${string}`, string>;
}
