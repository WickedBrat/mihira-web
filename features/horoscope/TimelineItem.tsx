import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@/lib/theme';
import type { TimelineEntry } from './types';

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 120, damping: 18 }}
      style={styles.container}
    >
      {/* Dot */}
      <LinearGradient
        colors={entry.gradientColors}
        style={styles.dot}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.dotEmoji}>{entry.emoji}</Text>
      </LinearGradient>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
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
    alignItems: 'flex-start',
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dotEmoji: {
    fontSize: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  },
  quote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
