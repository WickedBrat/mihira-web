import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { colors, fonts } from '@/lib/theme';
import type { BirthChart } from '@/lib/vedic/types';
import type { DailyAlignmentHighlight } from '@/lib/dailyAlignmentStorage';

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
          <View key={`${highlight.timeRange}-${highlight.activity}-${index}`} style={styles.highlightCard}>
            <Text style={styles.highlightTime}>{highlight.timeRange}</Text>
            <Text style={styles.highlightActivity}>{highlight.activity}</Text>
            <Text style={styles.highlightNote}>{highlight.note}</Text>
          </View>
        ))}
      </View>

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(181,100,252,0.12)',
    overflow: 'hidden',
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
    marginTop: 18,
    gap: 12,
  },
  highlightCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  highlightTime: {
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
    marginBottom: 8,
  },
  highlightActivity: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 22,
    marginBottom: 6,
  },
  highlightNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
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
