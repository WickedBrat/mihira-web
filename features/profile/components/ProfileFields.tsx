import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ProfileData } from '@/features/profile/useProfile';
import { PROFILE_FIELDS, type ProfileFieldId } from '@/features/profile/constants';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

interface ProfileFieldsProps {
  profile: Pick<ProfileData, 'name' | 'birth_dt' | 'birth_place'>;
  onChangeField: (field: Exclude<ProfileFieldId, 'birth_dt'>, value: string) => void;
  onPressBirthDate: () => void;
}

export function ProfileFields({
  profile,
  onChangeField,
  onPressBirthDate,
}: ProfileFieldsProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      sectionList: { gap: 14 },
      infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 18,
        borderRadius: 24,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.62)' : 'rgba(232, 225, 212, 0.62)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
      },
      infoIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${c.primary}18`,
      },
      infoText: { flex: 1, gap: 4 },
      infoLabel: {
        fontFamily: fonts.label,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.8,
        color: c.onSurfaceVariant,
      },
      infoInput: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: c.onSurface,
        letterSpacing: -0.2,
        backgroundColor: dark ? 'rgba(14, 14, 14, 0.45)' : 'rgba(250, 247, 242, 0.7)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}40`,
        paddingHorizontal: 14,
        paddingVertical: 12,
      },
      infoInputText: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: c.onSurface,
        letterSpacing: -0.2,
      },
      infoInputPlaceholder: { color: c.outline },
    })
  );

  return (
    <View style={styles.sectionList}>
      {PROFILE_FIELDS.map(({ id, label, placeholder, icon: Icon, autoCapitalize }) => (
        <View key={id} style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Icon size={18} color={colors.primaryFixed} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{label}</Text>
            {id === 'birth_dt' ? (
              <Pressable style={styles.infoInput} onPress={onPressBirthDate}>
                <Text
                  style={[styles.infoInputText, !profile[id] && styles.infoInputPlaceholder]}
                >
                  {profile[id] || placeholder}
                </Text>
              </Pressable>
            ) : (
              <TextInput
                value={profile[id]}
                onChangeText={(text) => onChangeField(id, text)}
                placeholder={placeholder}
                placeholderTextColor={colors.outline}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                selectionColor={colors.primary}
                style={styles.infoInput}
              />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
