import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';

export default function GurukulScreen() {
  const { colors, isDark } = useTheme();
  const imageWashColors: [string, string] = [
    isDark ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)',
    isDark ? 'rgba(18,18,22,0.18)' : 'rgba(250,247,242,0.12)',
  ];
  const bottomFadeColors: [string, string, string, string] = [
    'rgba(0,0,0,0)',
    isDark ? 'rgba(18,18,22,0.22)' : 'rgba(250,247,242,0.16)',
    isDark ? 'rgba(18,18,22,0.84)' : 'rgba(250,247,242,0.96)',
    colors.surface,
  ];

  return (
    <View className="flex-1 bg-surface">
      <PageAmbientBlobs />

      <View className="flex-1 overflow-hidden">
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/gurukul_coming_soon.jpg' }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={imageWashColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={bottomFadeColors}
          locations={[0, 0.45, 0.78, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0 left-0 right-0 h-[360px]"
        />
        <View className="absolute bottom-0 left-0 right-0 h-28 bg-surface" />

        <View
          className="flex-1 items-center justify-end gap-3 pb-36 pt-24"
          style={{ paddingHorizontal: layout.screenPaddingX }}
        >
          <Text className="mb-1 font-label text-[11px] uppercase tracking-[2px] text-secondary-fixed-dim">Gurukul</Text>
          <Text className="text-center font-headline-extra text-[40px] tracking-[-0.8px] text-on-surface">Coming Soon</Text>
          <Text className="mt-1 max-w-[280px] text-center font-label text-base leading-[22px] text-on-surface-variant">
            Your sacred digital library of wisdom, breathwork & philosophy is being prepared.
          </Text>
        </View>
      </View>
    </View>
  );
}
