import React from 'react';
import {
  Pressable,
  ViewStyle,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, {
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';

interface ChoiceCardProps {
  icon: string;
  title: string;
  subtitle: string;
  isSelected: boolean;
  onPress: () => void;
  enterDelay?: number;
  style?: ViewStyle;
}

export function ChoiceCard({
  icon,
  title,
  subtitle,
  isSelected,
  onPress,
  enterDelay = 0,
  style,
}: ChoiceCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    hapticLight();
    scale.value = withSpring(0.96, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Animated.View
      entering={SlideInRight.delay(enterDelay).springify()}
      style={style}
    >
      <Animated.View style={animStyle}>
        <Pressable
          onPress={handlePress}
          className={`flex-1 rounded-xl border p-6 ${
            isSelected
              ? 'border-primary/40 bg-primary/10'
              : 'border-black/[0.08] bg-[rgba(232,225,212,0.6)] dark:border-outline-variant/[0.15] dark:bg-surface-container-highest/60'
          }`}
        >
          <Text className="mb-3 text-[28px]">{icon}</Text>
          <Text className="mb-1.5 font-headline text-lg text-on-surface">{title}</Text>
          <Text className="font-body text-xs leading-[18px] text-on-surface-variant">{subtitle}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
