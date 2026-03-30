import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  sessionCount: string;
  progress: number;
  accentColor: string;
}

export function CategoryCard({ icon, title, sessionCount, progress, accentColor }: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${accentColor}1A` }]}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{sessionCount}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: 20,
    justifyContent: 'space-between',
    gap: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 16,
    color: colors.onSurface,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },
});
