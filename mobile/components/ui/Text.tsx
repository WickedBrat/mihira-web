import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { darkColors } from '@/lib/theme';
import { useOptionalTheme } from '@/lib/theme-context';

export interface TextProps extends RNTextProps {
  className?: string;
}

const BaseText = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ style, ...props }, ref) => {
    const theme = useOptionalTheme();

    return (
      <RNText
        ref={ref}
        {...props}
        style={[styles.base, { color: theme?.colors.onSurface ?? darkColors.onSurface }, style]}
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
