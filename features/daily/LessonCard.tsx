import React from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { ChevronRight, BookMarked, Brain } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';
import type { PastInsight } from './types';

interface LessonCardProps {
  insight: PastInsight;
  onPress?: () => void;
}

export function LessonCard({ insight, onPress }: LessonCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => { hapticLight(); onPress?.(); }}
      className="rounded-2xl bg-surface-container-low"
      style={({ pressed }) => pressed && { backgroundColor: colors.surfaceBright }}
    >
      <View className="flex-row items-center gap-4 p-[18px]">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface-container-highest">
          {insight.iconName === 'history_edu'
            ? <BookMarked size={18} color={colors.secondary} />
            : <Brain size={18} color={colors.primary} />}
        </View>
        <View className="flex-1">
          <Text className="mb-0.5 font-body-medium text-base text-on-surface">{insight.title}</Text>
          <Text className="font-body text-xs text-on-surface-variant">{insight.date} · {insight.readTime}</Text>
        </View>
        <ChevronRight size={16} color={colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );
}
