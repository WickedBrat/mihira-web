import React from 'react';
import {
  Pressable,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function GurukulScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(Math.max(height * 0.32, 260), 340);
  const sheetOverlap = 30;

  const panelColor = isDark ? '#15110d' : colors.surface;
  const badgeColor = isDark ? '#e8b25b' : '#a56a18';
  const bodyColor = isDark ? 'rgba(255,244,226,0.76)' : colors.onSurfaceVariant;

  return (
    <View className="flex-1 bg-surface">
      <View className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: heroHeight }}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/mihira/gurukul_coming_soon.webp' }}
          className="absolute"
          resizeMode="cover"
          style={{
            top: -36,
            backgroundColor: 'black',
            height: heroHeight + 56,
            width: '100%',
            transform: [{ scale: 1.02 }],
          }}
        />
        <View
          className="absolute left-6 right-6 top-0 rounded-b-[36px]"
          style={{
            height: heroHeight - 18,
            backgroundColor: 'rgba(255,255,255,0.03)',
          }}
        />
      </View>

      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1" style={{ paddingTop: heroHeight - sheetOverlap }}>
          <View
            className="flex-1 rounded-t-[34px]"
            style={{
              backgroundColor: panelColor,
              paddingHorizontal: layout.screenPaddingX,
              paddingTop: 24,
              paddingBottom: Math.max(insets.bottom + 110, 132),
            }}
          >
            <View className="items-center">
              <Text
                className="mb-2 font-label text-[11px] uppercase tracking-[2px]"
                style={{ color: badgeColor }}
              >
                Gurukul
              </Text>
              <Text
                className="text-center font-headline-extra text-[40px] tracking-[-0.8px]"
                style={{ color: colors.onSurface }}
              >
                Coming Soon
              </Text>
              <Text
                className="mt-3 max-w-[292px] text-center font-body text-base leading-[24px]"
                style={{ color: bodyColor }}
              >
                A guided library of wisdom, breathwork, and philosophy is on the way.
              </Text>
              <Pressable
                accessibilityRole="button"
                className="mt-7 rounded-full border px-5 py-3 active:opacity-80"
                style={{ borderColor: `${colors.secondaryFixed}55`, backgroundColor: `${colors.secondaryFixed}12` }}
                onPress={() => router.push('/ask')}
              >
                <Text className="font-label text-sm text-secondary-fixed">Explore Guidance</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
