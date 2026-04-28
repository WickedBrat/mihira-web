import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OAuthButton } from '@/features/auth/OAuthButton';
import { useTheme } from '@/lib/theme-context';

interface ProfileAuthSheetProps {
  visible: boolean;
  onClose: () => void;
  onSignInWithGoogle: () => void | Promise<void> | Promise<boolean>;
  onSignInWithApple: () => void | Promise<void> | Promise<boolean>;
  isLoading: boolean;
  loadingProvider: 'google' | 'apple' | null;
}

export function ProfileAuthSheet({
  visible,
  onClose,
  onSignInWithGoogle,
  onSignInWithApple,
  isLoading,
  loadingProvider,
}: ProfileAuthSheetProps) {
  const { colors } = useTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      sheetStyle={{ borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingBottom: 30 }}
    >
      <View className="mb-[22px] flex-row items-start justify-between gap-3">
        <View>
          <Text className="mb-1 font-headline text-2xl tracking-[-0.4px] text-on-surface">Sign in</Text>
          <Text className="max-w-[220px] font-body text-sm leading-[19px] text-on-surface-variant">
            Save your profile, sync your chart, and keep your guidance across devices.
          </Text>
        </View>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
          onPress={onClose}
        >
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <View className="gap-3">
        <OAuthButton
          provider="google"
          onPress={() => void onSignInWithGoogle()}
          isDisabled={isLoading}
          isLoading={loadingProvider === 'google'}
        />
        <OAuthButton
          provider="apple"
          onPress={() => void onSignInWithApple()}
          isDisabled={isLoading}
          isLoading={loadingProvider === 'apple'}
        />
      </View>
    </BottomSheet>
  );
}
