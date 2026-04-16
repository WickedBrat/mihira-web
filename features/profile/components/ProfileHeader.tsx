import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Settings2 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme-context';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
}

export function ProfileHeader({ onOpenSettings }: ProfileHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between pb-2">
      <Text className="font-headline-extra text-2xl tracking-[-0.4px] text-on-surface">Profile</Text>
      <Pressable
        className="h-[38px] w-[38px] items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
        onPress={onOpenSettings}
      >
        <Settings2 size={17} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}
