import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Settings2 } from 'lucide-react-native';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
}

export function ProfileHeader({ onOpenSettings }: ProfileHeaderProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
      },
      title: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(22),
        color: c.onSurface,
        letterSpacing: -0.4,
      },
      settingsButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
      },
    })
  );

  return (
    <View style={styles.row}>
      <Text style={styles.title}>Profile</Text>
      <Pressable style={styles.settingsButton} onPress={onOpenSettings}>
        <Settings2 size={17} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}
