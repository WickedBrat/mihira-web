import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Play } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  category: string;
}

interface LessonRowProps {
  lesson: Lesson;
  onPress?: () => void;
}

export function LessonRow({ lesson, onPress }: LessonRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => { hapticLight(); onPress?.(); }}
      className="rounded-2xl"
      style={({ pressed }) => pressed && { backgroundColor: colors.surfaceContainerHighest }}
    >
      <View className="flex-row items-center gap-4 p-4">
        <View className="h-[52px] w-[52px] shrink-0 rounded-xl bg-surface-container-high" />
        <View className="flex-1">
          <Text className="mb-[3px] font-body-medium text-base text-on-surface">{lesson.title}</Text>
          <Text className="font-body text-xs text-on-surface-variant">{lesson.duration} · {lesson.category}</Text>
        </View>
        <View className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20">
          <Play size={14} color={colors.onSurfaceVariant} fill={colors.onSurfaceVariant} />
        </View>
      </View>
    </Pressable>
  );
}
