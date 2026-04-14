import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ProfileData } from '@/features/profile/useProfile';
import { PROFILE_FIELDS } from '@/features/profile/constants';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface ProfileFieldsProps {
  profile: Pick<ProfileData, 'name' | 'birth_dt' | 'birth_place'>;
}

export function ProfileFields({ profile }: ProfileFieldsProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      container: { gap: 10 },
      sectionLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        textTransform: 'uppercase',
        letterSpacing: 1.8,
        color: c.onSurfaceVariant,
        paddingHorizontal: 4,
        marginBottom: 2,
      },
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        borderRadius: 20,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.62)' : 'rgba(232, 225, 212, 0.62)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
      },
      iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${c.primary}18`,
        flexShrink: 0,
      },
      textBlock: { flex: 1, gap: 3 },
      label: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1.8,
        color: c.onSurfaceVariant,
      },
      value: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(14),
        color: c.onSurface,
        letterSpacing: -0.1,
      },
      empty: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.outline,
        fontStyle: 'italic',
      },
    })
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Your Details</Text>
      {PROFILE_FIELDS.map(({ id, label, placeholder, icon: Icon }) => {
        const value = profile[id];
        return (
          <View key={id} style={styles.card}>
            <View style={styles.iconWrap}>
              <Icon size={17} color={colors.primaryFixed} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.label}>{label}</Text>
              {value ? (
                <Text style={styles.value}>{value}</Text>
              ) : (
                <Text style={styles.empty}>{placeholder}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
