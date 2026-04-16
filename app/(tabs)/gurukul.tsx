import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';

export default function GurukulScreen() {
  const { colors } = useTheme();
  return (
    <View className="flex-1 bg-surface">
      <PageAmbientBlobs />

      <View className="absolute left-0 right-0 top-0 z-0 h-[480px]">
        <Image
          source={{uri: "https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/gurukul_coming_soon.jpg"}}
          className="h-full w-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', colors.surface]}
          className="absolute bottom-0 left-0 right-0 h-[300px]"
        />
      </View>

      <View className="z-[1] flex-1 items-center justify-center gap-3 pt-[200px]" style={{ paddingHorizontal: layout.screenPaddingX }}>
        <Text className="mb-1 font-label text-[11px] uppercase tracking-[2px] text-secondary-fixed-dim">Gurukul</Text>
        <Text className="text-center font-headline-extra text-[40px] tracking-[-0.8px] text-on-surface">Coming Soon</Text>
        <Text className="mt-1 max-w-[280px] text-center font-label text-base leading-[22px] text-on-surface-variant">
          Your sacred digital library of wisdom, breathwork & philosophy is being prepared.
        </Text>
      </View>
    </View>
  );
}
