import React from 'react';
import {
  View,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GurukulScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(Math.max(height * 0.42, 320), 430);
  const sheetOverlap = 42;

  const imageWashColors: [string, string, string] = [
    'rgba(16,11,6,0.14)',
    'rgba(69,48,18,0.05)',
    'rgba(250,247,242,0)',
  ];
  const imageDepthColors: [string, string, string, string] = [
    'rgba(0,0,0,0)',
    'rgba(17,12,7,0.08)',
    isDark ? 'rgba(18,14,10,0.56)' : 'rgba(250,247,242,0.22)',
    isDark ? 'rgba(18,18,22,0.92)' : 'rgba(250,247,242,0.95)',
  ];
  const panelColor = isDark ? '#15110d' : colors.surface;
  const badgeColor = isDark ? '#e8b25b' : '#a56a18';
  const bodyColor = isDark ? 'rgba(255,244,226,0.76)' : colors.onSurfaceVariant;

  return (
    <View className="flex-1 bg-surface">
      <View className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: heroHeight }}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/gurukul_coming_soon.jpg' }}
          className="absolute inset-x-0"
          resizeMode="cover"
          style={{
            top: -16,
            height: heroHeight + 56,
            width: '100%',
            transform: [{ scale: 1.02 }],
          }}
        />
        <LinearGradient
          colors={imageWashColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={imageDepthColors}
          locations={[0, 0.35, 0.76, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0 left-0 right-0 h-[220px]"
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
              paddingTop: 28,
              paddingBottom: Math.max(insets.bottom + 110, 132),
            }}
          >
            <LinearGradient
              colors={[
                isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.86)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute inset-x-0 top-0 h-8"
            />
            <View className="items-center">
              <Text
                className="mb-2 font-label text-[11px] uppercase tracking-[2.6px]"
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
                className="mt-3 max-w-[292px] text-center font-label text-base leading-[24px]"
                style={{ color: bodyColor }}
              >
                A guided library of wisdom, breathwork, and philosophy is on the way.
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
