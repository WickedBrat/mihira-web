import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

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
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      card: {
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.6)' : 'rgba(232, 225, 212, 0.6)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: dark ? 'rgba(72, 72, 72, 0.15)' : 'rgba(0, 0, 0, 0.08)',
        padding: 24,
        flex: 1,
      },
      cardSelected: {
        borderColor: `${c.primary}66`,
        backgroundColor: `${c.primary}12`,
      },
      icon: {
        fontSize: 28,
        marginBottom: 12,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: 18,
        color: c.onSurface,
        marginBottom: 6,
      },
      subtitle: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: c.onSurfaceVariant,
        lineHeight: 18,
      },
    })
  );

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
          style={[styles.card, isSelected && styles.cardSelected]}
        >
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
