import React from 'react';
import {
  ImageBackground,
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/theme-context';

interface PremiumCardProps {
  isPlus: boolean;
  onPress: () => void;
}

export function PremiumCard({ isPlus, onPress }: PremiumCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable className="mb-1 overflow-hidden rounded-[22px] border border-secondary-fixed/20" onPress={onPress}>
      <LinearGradient
        colors={[`${colors.secondaryFixed}3A`, `${colors.secondaryFixed}14`]}
        className="overflow-hidden rounded-[22px]"
      >
        <ImageBackground
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/premium-card-bg.png')}
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.3 }}
          resizeMode="cover"
        >
        <View className="min-h-[88px] items-center justify-center rounded-[22px] bg-black/[0.16] px-8 py-9">
          <Text className="mb-[5px] text-center font-headline text-[32px] leading-[36px] tracking-[-0.2px] text-on-surface">
            {isPlus ? 'Mihira Plus Active' : 'Unlock Mihira Plus'}
          </Text>
          <Text className="pt-2 text-center font-body leading-[20px] text-on-surface-variant">
            {isPlus
              ? 'Your current plan is Plus. Review benefits or manage your subscription.'
              : 'Unlimited Guidance, unlimited Sacred Timing, and deeper support across the app'}
          </Text>
        </View>
        </ImageBackground>
      </LinearGradient>
    </Pressable>
  );
}
