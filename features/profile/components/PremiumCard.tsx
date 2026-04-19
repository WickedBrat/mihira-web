import React from 'react';
import {
  ImageBackground,
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumCardProps {
  isPlus: boolean;
  onPress: () => void;
}

export function PremiumCard({ isPlus, onPress }: PremiumCardProps) {
  // if (isPlus) return null;

  return (
    <Pressable className="mb-1 overflow-hidden rounded-[22px]" onPress={onPress}>
      <LinearGradient
        colors={['#cd792cff', '#51301c']}
        className="overflow-hidden rounded-[22px]"
      >
        <ImageBackground
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/premium-card-bg.png')}
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.3 }}
          resizeMode="cover"
        >
        <View className="min-h-[88px] items-center justify-center rounded-[22px] bg-black/[0.18] px-10 py-12">
          <Text className="mb-[5px] font-headline text-4xl tracking-[-0.3px] text-white">Unlock Mihira Plus</Text>
          <Text className="pt-2 text-center font-body leading-[18px] text-white/80">
            Unlimited Guidance, unlimited Sacred Timing, and deeper support across the app
          </Text>
        </View>
        </ImageBackground>
      </LinearGradient>
    </Pressable>
  );
}
