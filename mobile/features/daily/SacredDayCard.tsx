// features/daily/SacredDayCard.tsx
import React from 'react';
import {
  View,
  Image,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { AppBlurView } from '@/components/ui/AppBlurView';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';
import type { CalendarEvent } from '@/features/daily/useCalendarEvents';
import { getCalendarImageUri } from './calendarImageUrl';

const ACCENT_COLOR = '#e8a020';

interface SacredDayCardProps {
  event: CalendarEvent;
}

export function SacredDayCard({ event }: SacredDayCardProps) {
  const { colors, isDark } = useTheme();
  const imageUri = getCalendarImageUri(event.image_url);
  const bgColor = `${ACCENT_COLOR}22`;
  const contentBackdropColor = isDark ? 'rgba(14, 14, 14, 0.58)' : 'rgba(250, 247, 242, 0.78)';
  const contentBackdropBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(26, 20, 16, 0.10)';
  const gradientColors: [string, string, string, string, string] = [
    colors.surface,
    colors.surface,
    `${colors.surface}e0`,
    `${colors.surface}60`,
    'transparent',
  ];

  const handlePress = () => {
    hapticLight();
    router.push(`/sacred-day/${event.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="h-[78px] justify-start overflow-hidden rounded-2xl"
      style={({ pressed }) => [{ backgroundColor: bgColor }, pressed && { opacity: 0.82 }]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} className="absolute inset-0 h-full w-full rounded-2xl" resizeMode="cover" />
      ) : null}

      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
      />

      <AppBlurView
        intensity={0}
        tint={isDark ? 'dark' : 'light'}
        className="z-[1]  flex-1 overflow-hidden rounded-xl border"
        style={{ backgroundColor: contentBackdropColor, borderColor: contentBackdropBorder }}
      >
        <View className="flex-1 flex-row items-center gap-3.5 px-4 py-3">
          <Star size={16} color={ACCENT_COLOR} fill={ACCENT_COLOR} style={{ flexShrink: 0 }} />

          <View className="flex-1 gap-0.5">
            <Text className="font-label text-[9px] tracking-[2px] text-on-surface-variant opacity-70">
              {event.tag ? event.tag.toUpperCase() : 'FESTIVAL'}
            </Text>
            <Text className="font-headline text-[24px] tracking-[-0.2px] text-on-surface" numberOfLines={1}>{event.title}</Text>
          </View>

          <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${ACCENT_COLOR}45` }}>
            <ChevronRight size={16} color={colors.onSurfaceVariant} />
          </View>
        </View>
      </AppBlurView>

      <View className="absolute inset-0 rounded-2xl border" />
    </Pressable>
  );
}
