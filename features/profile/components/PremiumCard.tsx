import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumCardProps {
  isPro: boolean;
  onPress: () => void;
}

export function PremiumCard({ isPro, onPress }: PremiumCardProps) {
  if (isPro) return null;

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
        <View className="min-h-[88px] items-center justify-center rounded-[22px] bg-black/[0.18] px-[30px] py-[30px]">
          <Text className="mb-[5px] font-headline text-2xl tracking-[-0.3px] text-white">Get Premium</Text>
          <Text className="max-w-[220px] text-center font-body text-xs leading-[18px] text-white/80">
            Unlimited Ask Aksha, No Ads &amp; Exclusive Spiritual Insights
          </Text>
        </View>
        </ImageBackground>
      </LinearGradient>
    </Pressable>
  );
}
