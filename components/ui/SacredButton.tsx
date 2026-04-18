import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticMedium } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

interface SacredButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

export function SacredButton({
  label,
  onPress,
  style,
  icon,
  variant = 'primary',
  fullWidth = false,
  className,
}: SacredButtonProps) {
  const { colors, gradients } = useTheme();
  const gradientColors = variant === 'primary'
    ? gradients.primaryToContainer
    : gradients.secondaryToContainer;
  const shadowColor = variant === 'primary' ? colors.primary : colors.secondaryFixed;
  const labelColor = variant === 'primary' ? colors.onPrimary : colors.onSecondaryContainer;

  const handlePress = () => { hapticMedium(); onPress(); };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      className={className}
      style={({ pressed }) => [
        {
          shadowColor,
          shadowOpacity: 0.2,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
          elevation: 4,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.content, fullWidth && styles.fullWidth]}
      >
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.label, { color: labelColor } as TextStyle]}>{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: 56,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  fullWidth: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
  },
  label: {
    fontFamily: 'GoogleSans_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
