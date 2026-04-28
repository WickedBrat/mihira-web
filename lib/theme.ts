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

const DARK_SURFACE = '#0e0e0e';
const DARK_CARD = '#191a1a';
const DARK_TEXT = '#fff7ed';
const DARK_MUTED_TEXT = '#d8ccbc';
const SAFFRON = '#ffae42';

const LIGHT_SURFACE = '#faf7f2';
const LIGHT_CARD = '#ede7db';
const LIGHT_TEXT = '#1a1410';
const LIGHT_MUTED_TEXT = '#6b5e4e';
const LIGHT_SAFFRON = '#9a6500';

export const darkColors = {
  surface: DARK_SURFACE,
  surfaceDim: DARK_SURFACE,
  surfaceContainerLowest: '#000000',
  surfaceContainerLow: DARK_CARD,
  surfaceContainer: DARK_CARD,
  surfaceContainerHigh: DARK_CARD,
  surfaceContainerHighest: DARK_CARD,
  surfaceBright: DARK_CARD,
  surfaceBrightGlass: 'rgba(25, 26, 26, 0.72)',
  surfaceVariant: DARK_CARD,

  primary: SAFFRON,
  primaryDim: SAFFRON,
  primaryFixed: SAFFRON,
  primaryFixedDim: SAFFRON,
  primaryContainer: SAFFRON,
  onPrimary: '#1a1410',
  onPrimaryFixed: SAFFRON,

  secondary: SAFFRON,
  secondaryDim: SAFFRON,
  secondaryFixed: SAFFRON,
  secondaryFixedDim: SAFFRON,
  secondaryContainer: SAFFRON,
  onSecondary: '#2f1c07',
  onSecondaryContainer: SAFFRON,

  onSurface: DARK_TEXT,
  onSurfaceVariant: DARK_MUTED_TEXT,
  onBackground: DARK_TEXT,
  background: DARK_SURFACE,

  outline: '#767575',
  outlineVariant: '#484848',

  error: '#ee7d77',
  errorContainer: '#7f2927',
} as const satisfies ColorPalette;

export type Colors = ColorPalette;

export const lightColors = {
  surface: LIGHT_SURFACE,
  surfaceDim: LIGHT_SURFACE,
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: LIGHT_CARD,
  surfaceContainer: LIGHT_CARD,
  surfaceContainerHigh: LIGHT_CARD,
  surfaceContainerHighest: LIGHT_CARD,
  surfaceBright: LIGHT_SURFACE,
  surfaceBrightGlass: 'rgba(250, 247, 242, 0.8)',
  surfaceVariant: LIGHT_CARD,

  primary: LIGHT_SAFFRON,
  primaryDim: LIGHT_SAFFRON,
  primaryFixed: LIGHT_SAFFRON,
  primaryFixedDim: LIGHT_SAFFRON,
  primaryContainer: LIGHT_SAFFRON,
  onPrimary: '#ffffff',
  onPrimaryFixed: LIGHT_SAFFRON,

  secondary: LIGHT_SAFFRON,
  secondaryDim: LIGHT_SAFFRON,
  secondaryFixed: LIGHT_SAFFRON,
  secondaryFixedDim: LIGHT_SAFFRON,
  secondaryContainer: LIGHT_SAFFRON,
  onSecondary: '#5c3f00',
  onSecondaryContainer: LIGHT_SAFFRON,

  onSurface: LIGHT_TEXT,
  onSurfaceVariant: LIGHT_MUTED_TEXT,
  onBackground: LIGHT_TEXT,
  background: LIGHT_SURFACE,

  outline: '#a89880',
  outlineVariant: '#d4c8b8',

  error: '#c0392b',
  errorContainer: '#fde8e6',
} as const satisfies ColorPalette;

export const fonts = {
  headlineExtra: 'CormorantGaramond_700Bold',
  headline: 'CormorantGaramond_600SemiBold',
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
    'rgba(255, 174, 66, 0.12)',
    'transparent',
    'rgba(255, 174, 66, 0.08)',
    'transparent',
  ] as const,
} as const satisfies GradientsType;

export const lightGradients = {
  primaryToContainer: [lightColors.primary, lightColors.primaryContainer] as const,
  secondaryToContainer: [lightColors.secondary, lightColors.secondaryContainer] as const,
  peaceBg: [
    'rgba(154, 101, 0, 0.10)',
    'transparent',
    'rgba(154, 101, 0, 0.08)',
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
