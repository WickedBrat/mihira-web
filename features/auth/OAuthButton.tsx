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
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      button: {
        borderRadius: 16,
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
      },
      pressed: {
        opacity: 0.7,
      },
      inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 14,
      },
      symbolWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      },
      symbol: {
        fontFamily: fonts.headline,
        fontSize: 14,
        color: c.onSurface,
      },
      label: {
        flex: 1,
        fontFamily: fonts.bodyMedium,
        fontSize: 15,
        color: c.onSurface,
      },
      placeholder: {
        width: 20,
      },
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
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.onSurface} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </Pressable>
  );
}
