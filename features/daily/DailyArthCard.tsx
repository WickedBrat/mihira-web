import React from 'react';
import {
  Pressable,
  View,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ConstellationLoader } from '@/components/ui/ConstellationLoader';
import { Text } from '@/components/ui/Text';
import { View as MotiView } from 'moti/build/components/view';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import DailyArthBg from '../../assets/daily-arth-bg.svg';
import { hapticLight } from '@/lib/haptics';
import { saveCachedDailyArthReflection } from '@/lib/dailyArthReflectionStorage';
import { useTheme } from '@/lib/theme-context';
import { useDailyArth } from './useDailyArth';

export function DailyArthCard() {
  const { arth, isLoading } = useDailyArth();

  const { colors, isDark } = useTheme();

  const displayQuote = arth?.quote ?? '';
  const displaySource = arth?.source ?? '';
  const sourceLabel = displaySource
    ? displaySource.toLowerCase().startsWith('the ')
      ? displaySource
      : `The ${displaySource}`
    : '';
  const quoteSizeClass = displayQuote.length > 135
    ? 'text-lg leading-[25px]'
    : displayQuote.length > 72
      ? 'text-[21px] leading-[30px]'
      : 'text-2xl leading-[32px]';

  const handleReflect = async () => {
    hapticLight();
    if (arth?.dailyReflection && arth.id > 0) {
      await saveCachedDailyArthReflection(arth.id, arth.dailyReflection);
    }

    router.push({
      pathname: '/daily-arth/reflect',
      params: {
        quoteId: arth?.id ? String(arth.id) : '0',
        quote: displayQuote,
        source: displaySource,
      },
    });
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96, translateY: 12 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 100 }}
      className="relative"
    >
      <View
        pointerEvents="none"
        className="absolute -top-8 left-[12%] right-[12%] h-[72px] rounded-full"
        style={{
          backgroundColor: `${colors.primary}12`,
          shadowColor: colors.primary,
          shadowOpacity: isDark ? 0.34 : 0.18,
          shadowRadius: 42,
          shadowOffset: { width: 0, height: 0 },
        }}
      />

      <View
        className={`relative items-center overflow-hidden px-6 pb-6 pt-7 ${
          isLoading ? 'min-h-[220px] justify-center' : ''
        }`}
      >
        <LinearGradient
          pointerEvents="none"
          colors={
            isDark
              ? ['rgba(255,255,255,0.065)', 'rgba(37,38,38,0.82)', 'rgba(12,12,12,0.46)']
              : ['rgba(255,255,255,0.72)', 'rgba(232,225,212,0.74)', 'rgba(250,247,242,0.58)']
          }
          locations={[0, 0.54, 1]}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          className="absolute inset-0"
        />
        <View
          pointerEvents="none"
          className="absolute -top-16 left-8 h-32 w-32 rounded-full"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.38)' }}
        />
        <View
          pointerEvents="none"
          className="absolute bottom-[-64px] left-[18%] right-[18%] h-[112px] rounded-full"
          style={{ backgroundColor: `${colors.primary}14` }}
        />

        <View pointerEvents="none" className="absolute right-[-94px] top-[-18px] h-[268px] w-[268px] opacity-[0.16]">
          {Platform.OS !== 'web' ? (
            <DailyArthBg width="100%" height="100%" />
          ) : null}
        </View>

        {isLoading ? (
          <ConstellationLoader size={140} />
        ) : (
          <View className="z-[1] w-full items-center">
            <View
              className="mb-5 h-[3px] w-12 rounded-full"
              style={{ backgroundColor: `${colors.secondaryFixed}80` }}
            />
            <Text
              className={`mb-6 max-w-[340px] text-center font-body-medium text-on-surface ${quoteSizeClass}`}
            >
              {displayQuote}
            </Text>
            <View className="w-full flex-row items-center gap-3 px-1">
              <View className="h-px flex-1 bg-black/[0.10] dark:bg-outline-variant/30" />
              <Text
                numberOfLines={2}
                className="max-w-[250px] text-center font-label text-[9px] uppercase tracking-[3px] text-on-surface-variant"
              >
                {sourceLabel}
              </Text>
              <View className="h-px flex-1 bg-black/[0.10] dark:bg-outline-variant/30" />
            </View>

            <Pressable
              onPress={handleReflect}
              accessibilityRole="button"
              accessibilityLabel="Reflect on today's quote"
              className="mt-8 overflow-hidden rounded-full border"
              style={({ pressed }) => [
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.72)',
                  borderColor: isDark ? `${colors.primary}4A` : `${colors.primary}30`,
                  shadowColor: colors.primary,
                  shadowOpacity: isDark ? 0.28 : 0.14,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 8 },
                },
                pressed && { opacity: 0.78, transform: [{ scale: 0.98 }] },
              ]}
            >
              <BlurView intensity={34} tint={isDark ? 'dark' : 'light'} className="overflow-hidden rounded-full">
                <LinearGradient
                  colors={
                    isDark
                      ? ['rgba(255,255,255,0.13)', `${colors.primary}20`, 'rgba(0,0,0,0.08)']
                      : ['rgba(255,255,255,0.86)', `${colors.primary}12`, 'rgba(255,255,255,0.54)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0"
                />
                <View
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: `${colors.primary}40` }}
                />
                <View className="min-w-[156px] flex-row items-center justify-center gap-2.5 px-5 py-3">
                  <Sparkles size={16} color={colors.primary} strokeWidth={2.2} />
                  <Text className="font-label text-[15px] text-primary">Reflect</Text>
                  <ArrowRight size={16} color={colors.primary} strokeWidth={2.2} />
                </View>
              </BlurView>
            </Pressable>
          </View>
        )}
      </View>
    </MotiView>
  );
}
