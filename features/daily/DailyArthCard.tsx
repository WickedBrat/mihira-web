import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Quote } from 'lucide-react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';
import { colors, fonts } from '@/lib/theme';

interface DailyArthCardProps {
  quote: string;
  source: string;
}

export function DailyArthCard({ quote, source }: DailyArthCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96, translateY: 12 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 100 }}
      style={styles.container}
    >
      {/* Ambient glow behind card */}
      <View style={[styles.glowBehind, { pointerEvents: 'none' }]} />

      <View style={styles.card}>
        {/* Subtle dot-grid texture */}
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <Pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <Circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.06)" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dots)" />
        </Svg>

        <Quote size={32} color={colors.primary} style={styles.quoteIcon} />
        <Text style={styles.quote}>{quote}</Text>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.source}>{source}</Text>
          <View style={styles.dividerLine} />
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowBehind: {
    position: 'absolute',
    top: -24,
    left: '10%',
    right: '10%',
    height: 60,
    backgroundColor: `${colors.primary}0D`,
    borderRadius: 9999,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 32,
    overflow: 'hidden',
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.15)',
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 24,
  },
  quote: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colors.onSurface,
    lineHeight: 32,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    width: 28,
    height: 1,
    backgroundColor: 'rgba(72, 72, 72, 0.3)',
  },
  source: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});
