import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

const AREA_META: Record<string, { emoji: string; color: string; bg: string }> = {
  Career:        { emoji: '💼', color: '#f0c060', bg: 'rgba(240,192,96,0.15)' },
  Creativity:    { emoji: '🎨', color: '#c084fc', bg: 'rgba(192,132,252,0.15)' },
  Relationships: { emoji: '🤝', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  Family:        { emoji: '🏡', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  Social:        { emoji: '✨', color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  'Self-Care':   { emoji: '🌸', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
  Spirituality:  { emoji: '🕉️', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  Finances:      { emoji: '🪙', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  Learning:      { emoji: '📖', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  Travel:        { emoji: '🧭', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  Communication: { emoji: '💬', color: '#fdba74', bg: 'rgba(253,186,116,0.15)' },
  Wellness:      { emoji: '🌿', color: '#86efac', bg: 'rgba(134,239,172,0.15)' },
};

const FALLBACK = { emoji: '⭐', color: '#fff', bg: 'rgba(255,255,255,0.1)' };

interface Props {
  areas: string[];
}

export function FocusAreaChips({ areas }: Props) {
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      container: {
        gap: 12,
        marginBottom: 28,
      },
      label: {
        fontFamily: fonts.label,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 3,
        color: c.onSurfaceVariant,
      },
      chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
      },
      chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 100,
        borderWidth: 1,
      },
      chipEmoji: {
        fontSize: 15,
      },
      chipText: {
        fontFamily: fonts.label,
        fontSize: 13,
        letterSpacing: 0.2,
      },
    })
  );

  if (!areas.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Today's Focus</Text>
      <View style={styles.chips}>
        {areas.map((area) => {
          const meta = AREA_META[area] ?? FALLBACK;
          return (
            <View key={area} style={[styles.chip, { backgroundColor: meta.bg, borderColor: `${meta.color}33` }]}>
              <Text style={styles.chipEmoji}>{meta.emoji}</Text>
              <Text style={[styles.chipText, { color: meta.color }]}>{area}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
