import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { TimelineItem } from './TimelineItem';
import { colors, fonts } from '@/lib/theme';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyAlignmentHighlight } from '@/lib/dailyAlignmentStorage';
import type { TimelineEntry, TimeOfDay } from './types';

interface Props {
  summary: string | null;
  highlights: DailyAlignmentHighlight[];
  reasoning: string | null;
  chart: BirthChart | null;
  isLoading: boolean;
  error: string | null;
}

function WordReveal({ text }: { text: string }) {
  const words = text.split(' ');
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= words.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <Text style={styles.guidanceText}>
      {words.slice(0, visible).join(' ')}
    </Text>
  );
}

export function DailyAlignmentCard({
  summary,
  highlights,
  reasoning,
  chart,
  isLoading,
  error,
}: Props) {
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(0.7, { duration: 3000 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Reading the cosmos…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!summary || highlights.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>
          Add your birth details in Profile to unlock cosmic guidance.
        </Text>
      </View>
    );
  }

  function mapHighlightToTimelineEntry(highlight: DailyAlignmentHighlight, index: number, total: number): TimelineEntry {
    const lower = highlight.timeRange.toLowerCase();
    
    let id: TimeOfDay = 'morning';
    let emoji = '🌅';
    let gradientColors: readonly [string, string] = ['#FFD180', '#FF9E80'];
    let subtitle = 'Morning';
    if (lower.includes('afternoon') || lower.includes('noon')) {
      id = 'afternoon';
      emoji = '☀️';
      gradientColors = ['#FFB74D', '#F57C00'];
      subtitle = 'Afternoon';
    } else if (lower.includes('evening')) {
      id = 'evening';
      emoji = '🌇';
      gradientColors = ['#FF8A65', '#D84315'];
      subtitle = 'Evening';
    } else if (lower.includes('night')) {
      id = 'night';
      emoji = '🌌';
      gradientColors = ['#5E35B1', '#283593'];
      subtitle = 'Night';
    } else if (lower.includes('pm')) {
      if (index >= total - 1) {
        id = 'night';
        emoji = '🌌';
        gradientColors = ['#5E35B1', '#283593'];
        subtitle = 'Night';
      } else {
        id = 'afternoon';
        emoji = '☀️';
        gradientColors = ['#FFB74D', '#F57C00'];
        subtitle = 'Afternoon';
      }
    }
    return {
      id,
      label: highlight.activity,
      subtitle,
      timeRange: highlight.timeRange,
      quote: highlight.note,
      emoji,
      gradientColors,
    };
  }


  return (
    <View style={styles.card}>
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <LinearGradient
          colors={['rgba(181, 100, 252, 0.08)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {chart && (
        <Text style={styles.lagnaLabel}>
          {chart.lagna} Rising · {chart.nakshatra} Moon · {chart.currentDasha}
        </Text>
      )}

      <WordReveal text={summary} />

      <View style={styles.highlightList}>
        {highlights.map((highlight, index) => (
          <TimelineItem
            entry={mapHighlightToTimelineEntry(highlight, index, highlights.length)}
            key={`${highlight.timeRange}-${highlight.activity}-${index}`}
            index={index}
            isLast={index === highlights.length - 1}
          />
        ))}
      </View>

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: colors.surfaceContainerLow,
    // borderRadius: 20,
    // padding: 20,
    // borderWidth: 1,
    // borderColor: 'rgba(181,100,252,0.12)',
    // overflow: 'hidden',
  },
  lagnaLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
    marginBottom: 12,
  },
  guidanceText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
    lineHeight: 26,
  },
  highlightList: {
    marginTop: 24,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
