import React from 'react';
import {
  View,
  Platform,
} from 'react-native';
import { ConstellationLoader } from '@/components/ui/ConstellationLoader';
import { Text } from '@/components/ui/Text';
import { View as MotiView } from 'moti/build/components/view';
import { Quote } from 'lucide-react-native';
import DailyArthBg from '../../assets/daily-arth-bg.svg';
import { useTheme } from '@/lib/theme-context';
import { useDailyArth } from './useDailyArth';

export function DailyArthCard() {
  const { arth, isLoading } = useDailyArth();

  const { colors } = useTheme();

  const displayQuote = arth?.quote ?? '';
  const displaySource = arth?.source ?? '';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96, translateY: 12 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 100 }}
      className="relative"
    >
      <View
        pointerEvents="none"
        className="absolute -top-7 left-[10%] right-[10%] h-[68px] rounded-full"
        style={{
          backgroundColor: `${colors.primary}0D`,
          shadowColor: colors.primary,
          shadowOpacity: 0.3,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: 0 },
        }}
      />

      <View
        className={`relative items-center overflow-hidden border border-black/[0.08] bg-[rgba(232,225,212,0.6)] p-[25px] dark:border-outline-variant/10 dark:bg-[rgba(37,38,38,0.6)] ${
          isLoading ? 'min-h-[220px] justify-center' : ''
        }`}
      >
        <View pointerEvents="none" className="absolute right-[-132px] top-1/2 h-[264px] w-[264px] -translate-y-[132px] opacity-20">
          {Platform.OS !== 'web' ? (
            <DailyArthBg width="100%" height="100%" />
          ) : null}
        </View>

        {isLoading ? (
          <ConstellationLoader size={140} />
        ) : (
          <View className="z-[1] w-full items-center">
            <Quote size={32} color={colors.primary} style={{ marginBottom: 28 }} />
            <Text
              className={`mb-7 text-center font-headline tracking-[-0.3px] text-on-surface ${
                displayQuote.length > 50 ? 'text-lg leading-[26px]' : 'text-2xl leading-8'
              }`}
            >
              {displayQuote}
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="h-px w-7 bg-black/[0.12] dark:bg-outline-variant/30" />
              <Text className="font-label text-[9px] uppercase italic tracking-[3px] text-on-surface-variant">
                The {displaySource}
              </Text>
              <View className="h-px w-7 bg-black/[0.12] dark:bg-outline-variant/30" />
            </View>
          </View>
        )}
      </View>
    </MotiView>
  );
}
