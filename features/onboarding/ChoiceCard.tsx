import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';

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
      style={animStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.card, isSelected && styles.cardSelected, style]}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.15)',
    padding: 24,
    flex: 1,
  },
  cardSelected: {
    borderColor: `${colors.primary}66`,
    backgroundColor: `${colors.primary}12`,
  },
  icon: {
    fontSize: 28,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});
