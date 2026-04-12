import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Settings2 } from 'lucide-react-native';
import { fonts } from '@/lib/theme';
import { PageHero } from '@/components/ui/PageHero';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
}

export function ProfileHeader({ onOpenSettings }: ProfileHeaderProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      headerRow: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingBottom: 8,
      },
      banner: {
        paddingBottom: 0,
        alignItems: 'center',
      },
      sub: { lineHeight: scaleFont(22) },
      title: {
        fontFamily: fonts.headlineExtra,
        fontSize: 34,
        color: c.onSurface,
        letterSpacing: -0.8,
        textAlign: 'center',
      },
      settingsButton: {
        position: 'absolute',
        right: 0,
        top: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
      },
    })
  );

  return (
    <View style={styles.headerRow}>
      <PageHero
        meta="Profile"
        title="You"
        subtitle=""
        style={styles.banner}
        titleStyle={styles.title}
        subtitleStyle={styles.sub}
        subtitleMaxWidth={360}
      />
      <Pressable style={styles.settingsButton} onPress={onOpenSettings}>
        <Settings2 size={18} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}
