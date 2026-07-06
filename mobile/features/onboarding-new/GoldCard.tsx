import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface GoldCardProps {
  label?: string;
  children: React.ReactNode;
}

/** The recurring gold-bordered gradient-tinted card (Sacred Timing teaser, notification preview, etc.) */
export function GoldCard({ label, children }: GoldCardProps) {
  return (
    <View className="w-full gap-2 rounded-[20px] border border-obn-gold-border-soft bg-obn-gold-dim p-5">
      {label ? (
        <Text className="font-manrope-bold text-[10px] uppercase tracking-[2.5px] text-obn-gold">{label}</Text>
      ) : null}
      {children}
    </View>
  );
}

/** Neutral (non-gold) card used for benefit lists, recap cards, etc. */
export function NeutralCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="w-full gap-1 rounded-[20px] border border-obn-card-border bg-obn-card p-5">
      {children}
    </View>
  );
}
