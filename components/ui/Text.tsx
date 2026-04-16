import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native';
import { cssInterop } from 'nativewind';

export interface TextProps extends RNTextProps {
  className?: string;
}

const BaseText = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ style, ...props }, ref) => (
    <RNText
      ref={ref}
      {...props}
      style={[styles.base, style]}
    />
  )
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
