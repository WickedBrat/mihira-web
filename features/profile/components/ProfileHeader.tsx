import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BadgeCheck, Settings2 } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
}

export function ProfileHeader({ onOpenSettings }: ProfileHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>You</Text>
      <View style={styles.headerActions}>
        <View style={styles.planBadge}>
          <BadgeCheck size={13} color={colors.secondaryFixed} />
          <Text style={styles.planBadgeText}>Aksha FREE</Text>
        </View>
        <Pressable style={styles.settingsButton} onPress={onOpenSettings}>
          <Settings2 size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontFamily: fonts.headlineExtra,
    fontSize: 34,
    color: colors.onSurface,
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: `${colors.secondary}22`,
    borderWidth: 1,
    borderColor: `${colors.secondary}26`,
  },
  planBadgeText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.secondaryFixed,
    letterSpacing: 1.2,
  },
  settingsButton: {
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
