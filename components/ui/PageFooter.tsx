import React from 'react';
import { View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/lib/theme-context';

export function PageFooter() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-center gap-1.5 py-2">
      <Text className="text-center font-label text-[11px] uppercase tracking-[1.8px] text-on-surface-variant">
        Made with
      </Text>
      <Heart size={12} color={colors.onSurfaceVariant} fill={colors.onSurfaceVariant} />
      <Text className="text-center font-label text-[11px] uppercase tracking-[1.8px] text-on-surface-variant">
        in India
      </Text>
    </View>
  );
}
