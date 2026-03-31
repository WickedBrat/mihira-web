import React from 'react';
import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts } from '@/lib/theme';

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

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  symbol: {
    fontFamily: fonts.headline,
    fontSize: 14,
    color: colors.onSurface,
  },
  label: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  placeholder: {
    width: 20,
  },
});
