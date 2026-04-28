import React from 'react';
import {
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/lib/theme-context';

interface Props {
  areas: string[];
}

export function FocusAreaChips({ areas }: Props) {
  const { colors } = useTheme();

  if (!areas.length) return null;

  return (
    <View className="mb-7 gap-3">
      <Text className="font-label text-xs uppercase tracking-[3px] text-on-surface-variant">Today's Focus</Text>
      <View className="flex-row flex-wrap gap-2.5">
        {areas.map((area) => {
          return (
            <View
              key={area}
              className="flex-row items-center gap-1.5 rounded-full border px-3.5 py-[9px]"
              style={{ backgroundColor: `${colors.secondaryFixed}14`, borderColor: `${colors.secondaryFixed}33` }}
            >
              <Text className="font-label text-sm tracking-[0.2px] text-secondary-fixed">{area}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
