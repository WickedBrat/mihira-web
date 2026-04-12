import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
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
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
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
        backgroundColor: c.surfaceContainerHighest,
      },
      thumbnail: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: c.surfaceContainerHigh,
        flexShrink: 0,
      },
      text: { flex: 1 },
      title: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(15),
        color: c.onSurface,
        marginBottom: 3,
      },
      meta: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
      },
      playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
        alignItems: 'center',
        justifyContent: 'center',
      },
    })
  );

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
