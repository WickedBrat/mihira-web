import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticMedium } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useThemedStyles } from '@/lib/theme-context';

interface SacredButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function SacredButton({ label, onPress, style, icon, variant = 'primary' }: SacredButtonProps) {
  const theme = useThemedStyles((_colors, _glass, gradients) => ({
    styles: StyleSheet.create({
      container: {
        shadowColor: _colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      },
      pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
      gradient: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 9999,
        overflow: 'hidden',
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 8,
      },
      label: {
        fontFamily: fonts.label,
        fontSize: scaleFont(16),
        color: _colors.onPrimary,
        letterSpacing: 0.5,
      },
    }),
    gradientColors: variant === 'primary'
      ? gradients.primaryToContainer
      : gradients.secondaryToContainer,
  }));

  const handlePress = () => { hapticMedium(); onPress(); };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [theme.styles.container, pressed && theme.styles.pressed, style]}
    >
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={theme.styles.gradient}
      >
        {icon}
        <Text style={theme.styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
