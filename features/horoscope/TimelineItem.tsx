import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { View as MotiView } from 'moti/build/components/view';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import type { TimelineEntry } from './types';

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ entry, index, isLast = false }: TimelineItemProps) {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'stretch',
        marginBottom: 0,
      },
      leftColumn: {
        alignItems: 'center',
        width: 48,
      },
      dot: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        zIndex: 2,
      },
      dotEmoji: {
        fontSize: 20,
      },
      line: {
        flex: 1,
        width: 2,
        backgroundColor: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        marginTop: 4,
        marginBottom: -4,
        zIndex: 1,
      },
      card: {
        flex: 1,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.6)' : 'rgba(232, 225, 212, 0.6)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
        marginBottom: 16,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
      },
      cardHeaderLeft: {
        flex: 1,
        paddingRight: 12,
      },
      cardTitle: {
        fontFamily: fonts.headline,
        fontSize: 16,
        color: c.onSurface,
        letterSpacing: -0.2,
      },
      cardSubtitle: {
        fontFamily: fonts.label,
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.primaryDim,
        marginTop: 3,
      },
      timeRange: {
        fontFamily: fonts.body,
        fontSize: 10,
        color: `${c.onSurface}4D`,
        textAlign: 'right',
      },
      quote: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: c.onSurfaceVariant,
        lineHeight: 20,
        fontStyle: 'italic',
      },
    })
  );

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 120, damping: 18 }}
      style={styles.container}
    >
      <View style={styles.leftColumn}>
        <LinearGradient
          colors={entry.gradientColors}
          style={styles.dot}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.dotEmoji}>{entry.emoji}</Text>
        </LinearGradient>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>{entry.label}</Text>
            <Text style={styles.cardSubtitle}>{entry.subtitle}</Text>
          </View>
          <Text style={styles.timeRange}>{entry.timeRange}</Text>
        </View>
        <Text style={styles.quote}>{entry.quote}</Text>
      </View>
    </MotiView>
  );
}
