import React from 'react';
import { View, Text } from 'react-native';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  sessionCount: string;
  progress: number;
  accentColor: string;
}

export function CategoryCard({ icon, title, sessionCount, progress, accentColor }: CategoryCardProps) {
  return (
    <View className="flex-1 justify-between gap-2 rounded-3xl border border-black/[0.05] bg-[rgba(232,225,212,0.6)] p-5 dark:border-white/[0.04] dark:bg-[rgba(37,38,38,0.6)]">
      <View className="mb-1 h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${accentColor}1A` }}>
        {icon}
      </View>
      <Text className="font-headline text-base text-on-surface">{title}</Text>
      <Text className="font-body text-xs text-on-surface-variant">{sessionCount}</Text>
      <View className="mt-2 h-[3px] overflow-hidden rounded-full bg-surface-container-highest">
        <View className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: accentColor }} />
      </View>
    </View>
  );
}
