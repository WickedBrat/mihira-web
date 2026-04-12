import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  sessionCount: string;
  progress: number;
  accentColor: string;
}

export function CategoryCard({ icon, title, sessionCount, progress, accentColor }: CategoryCardProps) {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      card: {
        flex: 1,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.6)' : 'rgba(232, 225, 212, 0.6)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
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
        color: c.onSurface,
      },
      count: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: c.onSurfaceVariant,
      },
      progressTrack: {
        height: 3,
        backgroundColor: c.surfaceContainerHighest,
        borderRadius: 9999,
        overflow: 'hidden',
        marginTop: 8,
      },
      progressFill: {
        height: '100%',
        borderRadius: 9999,
      },
    })
  );

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
