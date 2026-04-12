import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OAuthButton } from '@/features/auth/OAuthButton';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

interface ProfileAuthSheetProps {
  visible: boolean;
  onClose: () => void;
  onSignInWithGoogle: () => void | Promise<void>;
  onSignInWithApple: () => void | Promise<void>;
  isLoading: boolean;
}

export function ProfileAuthSheet({
  visible,
  onClose,
  onSignInWithGoogle,
  onSignInWithApple,
  isLoading,
}: ProfileAuthSheetProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      sheet: {
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 22,
        gap: 12,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: 24,
        color: c.onSurface,
        letterSpacing: -0.4,
        marginBottom: 4,
      },
      subtitle: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: c.onSurfaceVariant,
        lineHeight: 19,
        maxWidth: 220,
      },
      closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
      },
      oauthList: { gap: 12 },
    })
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to save your spiritual profile.</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <View style={styles.oauthList}>
        <OAuthButton provider="google" onPress={onSignInWithGoogle} isLoading={isLoading} />
        <OAuthButton provider="apple" onPress={onSignInWithApple} isLoading={isLoading} />
      </View>
    </BottomSheet>
  );
}
