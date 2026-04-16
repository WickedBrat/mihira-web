import React from 'react';
import {
  Image,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { UserRound, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/lib/theme-context';
import ProfileBg from '@/assets/profile_bg.svg';

interface ProfileHeroProps {
  displayName: string;
  initials: string;
  avatarUrl?: string | null;
  isSignedIn: boolean;
  zodiacSign?: { sign: string; icon: LucideIcon } | null;
}

export function ProfileHero({
  displayName,
  initials,
  avatarUrl,
  isSignedIn,
  zodiacSign,
}: ProfileHeroProps) {
  const hasAvatar = Boolean(avatarUrl);
  const { colors } = useTheme();

  return (
    <View className="items-center pb-5 pt-3">
      <View className="relative mb-4 items-center justify-center">
        <View className="absolute left-[-22px] top-[-20px] h-40 w-40 items-center justify-center opacity-50">
          <ProfileBg width={270} height={270} fill="#4b3d32" />
        </View>
        
        <View className="h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full border border-black/[0.06] bg-[rgba(250,247,242,0.94)] dark:border-white/[0.06] dark:bg-[rgba(19,19,19,0.94)]">
          {isSignedIn && hasAvatar ? (
            <Image source={{ uri: avatarUrl ?? undefined }} className="h-full w-full" />
          ) : isSignedIn ? (
            <Text className="font-headline text-[30px] tracking-[-0.5px] text-on-surface">{initials}</Text>
          ) : (
            <UserRound size={36} color={colors.onSurface} strokeWidth={1.7} />
          )}
        </View>
      </View>

      <Text className="mb-1.5 font-headline text-[30px] tracking-[-0.4px] text-on-surface">{displayName}</Text>

      {zodiacSign && (
        <View className="flex-row items-center gap-[5px]">
          <zodiacSign.icon size={16} color={colors.onSurfaceVariant} strokeWidth={2} />
          <Text className="font-body text-base text-on-surface-variant">{zodiacSign.sign}</Text>
        </View>
      )}
    </View>
  );
}
