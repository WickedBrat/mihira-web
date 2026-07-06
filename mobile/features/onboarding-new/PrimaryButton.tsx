import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { obnButtonShadow, obnPressedStyle } from './styles';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

/** The recurring gold rounded CTA button used on nearly every onboarding-new screen. */
export function PrimaryButton({ label, onPress, disabled = false, fullWidth = true }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      className={`items-center rounded-full bg-obn-gold px-8 py-[17px] ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-35' : ''}`}
      style={({ pressed }) => [obnButtonShadow, pressed && !disabled && obnPressedStyle]}
    >
      <Text className="font-manrope-bold text-base text-obn-ink">{label}</Text>
    </Pressable>
  );
}

export function SecondaryLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text className="text-center font-manrope text-[13px] leading-[20px] text-obn-muted underline">
        {label}
      </Text>
    </Pressable>
  );
}

export function ScreenLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-center font-manrope-bold text-[11px] uppercase tracking-[3px] text-obn-gold">
      {children}
    </Text>
  );
}

export function GoldDivider() {
  return <View className="h-px w-[30px] self-center bg-obn-gold" />;
}
