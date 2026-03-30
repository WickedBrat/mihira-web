import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, BookMarked, Brain } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';
import type { PastInsight } from './types';

interface LessonCardProps {
  insight: PastInsight;
  onPress?: () => void;
}

export function LessonCard({ insight, onPress }: LessonCardProps) {
  return (
    <Pressable
      onPress={() => { hapticLight(); onPress?.(); }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <View style={styles.iconBox}>
          {insight.iconName === 'history_edu'
            ? <BookMarked size={18} color={colors.secondary} />
            : <Brain size={18} color={colors.primary} />}
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text style={styles.meta}>{insight.date} · {insight.readTime}</Text>
        </View>
        <ChevronRight size={16} color={colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  pressed: {
    backgroundColor: colors.surfaceBright,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 2,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
});
