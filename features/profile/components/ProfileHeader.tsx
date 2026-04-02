import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BadgeCheck, Settings2 } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';
import { PageHero } from '@/components/ui/PageHero';
import { scaleFont } from '@/lib/typography';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
}

export function ProfileHeader({ onOpenSettings }: ProfileHeaderProps) {
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

const styles = StyleSheet.create({
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
    color: colors.onSurface,
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
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
});
