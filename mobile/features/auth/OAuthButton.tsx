import React from 'react';
import {
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/lib/theme-context';
import AppleLogoIcon from './AppleLogo';
import GoogleLogoSolidIcon from './GoogleLogo';

interface OAuthButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const PROVIDER_LABEL: Record<OAuthButtonProps['provider'], string> = {
  google: 'Continue with Google',
  apple: 'Continue with Apple',
};

const PROVIDER_SYMBOL: Record<OAuthButtonProps['provider'], any> = {
  google: <GoogleLogoSolidIcon size={20} color="#fff" />,
  apple: <AppleLogoIcon size={24} color="#fff" />,
};

export function OAuthButton({ provider, onPress, isDisabled, isLoading }: OAuthButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      className={`rounded-2xl border border-black/[0.07] bg-surface-container-low dark:border-white/[0.07] ${
        isDisabled ? 'opacity-60' : ''
      }`}
      style={({ pressed }) => pressed && { opacity: 0.7 }}
      onPress={onPress}
      disabled={isDisabled ?? isLoading}
    >
      <View className="flex-row items-center gap-3.5 px-4 py-4">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
          {PROVIDER_SYMBOL[provider]}
        </View>
        <Text className="flex-1 font-body-medium text-base text-on-surface">{PROVIDER_LABEL[provider]}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.onSurface} />
        ) : (
          <View className="w-5" />
        )}
      </View>
    </Pressable>
  );
}
