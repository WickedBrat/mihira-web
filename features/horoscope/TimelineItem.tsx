import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { View as MotiView } from 'moti/build/components/view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@/lib/theme';
import type { TimelineEntry } from './types';

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ entry, index, isLast = false }: TimelineItemProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 120, damping: 18 }}
      style={styles.container}
    >
      {/* Timeline Left: Dot and Line */}
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

      {/* Card */}
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

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
    marginBottom: -4, // overlap with the next item
    zIndex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.primaryDim,
    marginTop: 3,
  },
  timeRange: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: `${colors.onSurface}4D`,
    textAlign: 'right',
  },
  quote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
