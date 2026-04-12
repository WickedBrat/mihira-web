import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, BookMarked, Brain } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { PastInsight } from './types';

interface LessonCardProps {
  insight: PastInsight;
  onPress?: () => void;
}

export function LessonCard({ insight, onPress }: LessonCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      pressable: {
        borderRadius: 16,
        backgroundColor: c.surfaceContainerLow,
      },
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 18,
      },
      pressed: {
        backgroundColor: c.surfaceBright,
      },
      iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: c.surfaceContainerHighest,
        alignItems: 'center',
        justifyContent: 'center',
      },
      textBlock: {
        flex: 1,
      },
      title: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(15),
        color: c.onSurface,
        marginBottom: 2,
      },
      meta: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
      },
    })
  );

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
