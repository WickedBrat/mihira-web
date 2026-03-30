import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticMedium } from '@/lib/haptics';
import { colors, fonts, gradients } from '@/lib/theme';

interface SacredButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function SacredButton({
  label,
  onPress,
  style,
  icon,
  variant = 'primary',
}: SacredButtonProps) {
  const handlePress = () => {
    hapticMedium();
    onPress();
  };

  const gradientColors =
    variant === 'primary'
      ? gradients.primaryToContainer
      : gradients.secondaryToContainer;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  gradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.onPrimary,
    letterSpacing: 0.5,
  },
});
