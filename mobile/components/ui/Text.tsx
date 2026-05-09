import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { darkColors, type Colors } from '@/lib/theme';
import { useOptionalTheme } from '@/lib/theme-context';

export interface TextProps extends RNTextProps {
  className?: string;
}

const BaseText = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ className, style, ...props }, ref) => {
    const theme = useOptionalTheme();
    const resolvedTextColor = resolveTextColor(className, theme?.colors);

    return (
      <RNText
        ref={ref}
        {...props}
        style={[
          styles.base,
          { color: theme?.colors.onSurface ?? darkColors.onSurface },
          style,
          resolvedTextColor ? { color: resolvedTextColor } : null,
        ]}
      />
    );
  }
);

BaseText.displayName = 'Text';

export const Text = cssInterop(BaseText, {
  className: 'style',
});

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.2,
  },
});

function resolveTextColor(className: string | undefined, colors: Colors | undefined) {
  if (!className) return null;

  const palette = colors ?? darkColors;
  const tokens = className.split(/\s+/);
  let resolved: string | null = null;

  for (const token of tokens) {
    const color = resolveTextColorToken(token, palette);
    if (color) resolved = color;
  }

  return resolved;
}

function resolveTextColorToken(token: string, colors: Colors) {
  if (!token.startsWith('text-')) return null;
  if (token.startsWith('text-[')) return null;
  if (/^text-(?:xs|sm|base|lg|xl|\d)/.test(token)) return null;

  const [name, opacity] = token.slice('text-'.length).split('/');
  const color = semanticTextColors(colors)[name];
  if (!color) return null;

  return opacity ? withOpacity(color, Number(opacity) / 100) : color;
}

function semanticTextColors(colors: Colors): Record<string, string> {
  return {
    background: colors.background,
    error: colors.error,
    'error-container': colors.errorContainer,
    'on-background': colors.onBackground,
    'on-primary': colors.onPrimary,
    'on-primary-fixed': colors.onPrimaryFixed,
    'on-secondary': colors.onSecondary,
    'on-secondary-container': colors.onSecondaryContainer,
    'on-surface': colors.onSurface,
    'on-surface-variant': colors.onSurfaceVariant,
    'outline': colors.outline,
    'outline-variant': colors.outlineVariant,
    primary: colors.primary,
    'primary-container': colors.primaryContainer,
    'primary-dim': colors.primaryDim,
    'primary-fixed': colors.primaryFixed,
    'primary-fixed-dim': colors.primaryFixedDim,
    secondary: colors.secondary,
    'secondary-container': colors.secondaryContainer,
    'secondary-dim': colors.secondaryDim,
    'secondary-fixed': colors.secondaryFixed,
    'secondary-fixed-dim': colors.secondaryFixedDim,
    surface: colors.surface,
    'surface-bright': colors.surfaceBright,
    'surface-container': colors.surfaceContainer,
    'surface-container-high': colors.surfaceContainerHigh,
    'surface-container-highest': colors.surfaceContainerHighest,
    'surface-container-low': colors.surfaceContainerLow,
    'surface-container-lowest': colors.surfaceContainerLowest,
    'surface-dim': colors.surfaceDim,
    'surface-variant': colors.surfaceVariant,
    white: '#ffffff',
    black: '#000000',
    'ob-bg': '#07090C',
    'ob-gold': '#D9A06F',
    'ob-muted': '#8E8880',
    'ob-saffron': '#E07A5F',
    'ob-text': '#F0EDE8',
  };
}

function withOpacity(color: string, opacity: number) {
  if (!Number.isFinite(opacity)) return color;
  if (!color.startsWith('#')) return color;

  const hex = color.slice(1);
  const normalized = hex.length === 3
    ? hex.split('').map((char) => `${char}${char}`).join('')
    : hex.slice(0, 6);

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, opacity))})`;
}
