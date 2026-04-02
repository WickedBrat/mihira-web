import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

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
  return (
    <Pressable
      onPress={() => { hapticLight(); onPress?.(); }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.thumbnail} />
        <View style={styles.text}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.meta}>{lesson.duration} · {lesson.category}</Text>
        </View>
        <View style={styles.playBtn}>
          <Play size={14} color={colors.onSurfaceVariant} fill={colors.onSurfaceVariant} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  pressed: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
    flexShrink: 0,
  },
  text: { flex: 1 },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(15),
    color: colors.onSurface,
    marginBottom: 3,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
