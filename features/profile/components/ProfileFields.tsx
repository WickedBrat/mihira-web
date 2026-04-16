import React from 'react';
import { Text, View } from 'react-native';
import type { ProfileData } from '@/features/profile/useProfile';
import { PROFILE_FIELDS } from '@/features/profile/constants';
import { useTheme } from '@/lib/theme-context';

interface ProfileFieldsProps {
  profile: Pick<ProfileData, 'name' | 'birth_dt' | 'birth_place'>;
}

export function ProfileFields({ profile }: ProfileFieldsProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-2.5">
      <Text className="mb-0.5 px-1 font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">
        Your Details
      </Text>
      {PROFILE_FIELDS.map(({ id, label, placeholder, icon: Icon }) => {
        const value = profile[id];
        return (
          <View
            key={id}
            className="flex-row items-center gap-3.5 rounded-[20px] border border-black/[0.06] bg-[rgba(232,225,212,0.62)] p-3.5 dark:border-white/[0.05] dark:bg-[rgba(37,38,38,0.62)]"
          >
            <View
              className="h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${colors.primary}18` }}
            >
              <Icon size={17} color={colors.primaryFixed} />
            </View>
            <View className="flex-1 gap-[3px]">
              <Text className="font-label text-[9px] uppercase tracking-[1.8px] text-on-surface-variant">{label}</Text>
              {value ? (
                <Text className="font-body-medium text-sm tracking-[-0.1px] text-on-surface">{value}</Text>
              ) : (
                <Text className="font-body text-sm italic text-outline">{placeholder}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
