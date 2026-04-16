import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticMedium } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

interface SacredButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function SacredButton({ label, onPress, style, icon, variant = 'primary' }: SacredButtonProps) {
  const { colors, gradients } = useTheme();
  const gradientColors = variant === 'primary'
    ? gradients.primaryToContainer
    : gradients.secondaryToContainer;

  const handlePress = () => { hapticMedium(); onPress(); };

  return (
    <Pressable
      onPress={handlePress}
      className="shadow-lg"
      style={({ pressed }) => [
        {
          shadowColor: colors.primary,
          shadowOpacity: 0.2,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
          elevation: 4,
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4"
      >
        {icon}
        <Text className="font-label text-base tracking-[0.5px] text-on-primary">{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
