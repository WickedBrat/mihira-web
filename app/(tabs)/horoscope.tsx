import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { UserCircle } from 'lucide-react-native';
import { TimelineItem } from '@/features/horoscope/TimelineItem';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { colors, fonts } from '@/lib/theme';
import type { TimelineEntry } from '@/features/horoscope/types';

const TIMELINE: TimelineEntry[] = [
  {
    id: 'morning',
    label: 'Morning (Sunrise)',
    subtitle: 'Dharma & Intent',
    timeRange: '06:00 – 11:00',
    quote: '"Awaken with intention. Today\'s path is paved with clarity. Focus on the effort, not the fruit."',
    emoji: '🌅',
    gradientColors: [colors.primary, colors.primaryContainer],
  },
  {
    id: 'afternoon',
    label: 'Afternoon (Peak Sun)',
    subtitle: 'Karma & Action',
    timeRange: '12:00 – 16:00',
    quote: '"In the heat of your labor, remain cool within. Equanimity is the greatest strength of a focused mind."',
    emoji: '☀️',
    gradientColors: [colors.secondary, colors.secondaryContainer],
  },
  {
    id: 'evening',
    label: 'Evening (Twilight)',
    subtitle: 'Reflection & Release',
    timeRange: '17:00 – 20:00',
    quote: '"As the light fades, shed the day\'s burdens. Let go of what was, and prepare for what is to be."',
    emoji: '🌆',
    gradientColors: [colors.primaryContainer, colors.surfaceContainerHighest],
  },
  {
    id: 'night',
    label: 'Night (Starry)',
    subtitle: 'Yoga & Silence',
    timeRange: '21:00 – 05:00',
    quote: '"In the silence of the night, the soul speaks. Connect with the eternal spark that never sleeps."',
    emoji: '✨',
    gradientColors: [colors.surface, colors.primaryContainer],
  },
];

export default function HoroscopeScreen() {
  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(149, 0, 255, 0.08)" top={-60} left={200} size={300} />
      <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={500} left={-80} size={280} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerBrand}>Arth</Text>
            <View style={styles.headerRight}>
              <View style={styles.avatar}>
                <UserCircle size={20} color={colors.onSurface} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Peace Header */}
        <View style={styles.peaceBanner}>
          <Text style={styles.peaceMeta}>Celestial Alignment</Text>
          <Text style={styles.peaceTitle}>Your Cosmic Rhythm</Text>
          <Text style={styles.peaceSub}>
            Wisdom from the stars, grounded in eternal truths. Follow the sun's journey through your spirit today.
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {/* Vertical connector line */}
          <View style={styles.connectorLine} />
          {TIMELINE.map((entry, index) => (
            <TimelineItem key={entry.id} entry={entry} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerBrand: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHighest,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 160 },
  peaceBanner: { marginBottom: 40 },
  peaceMeta: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.primary,
    marginBottom: 10,
    opacity: 0.8,
  },
  peaceTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: 36,
    color: colors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 42,
    marginBottom: 12,
  },
  peaceSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  timeline: { gap: 24, position: 'relative' },
  connectorLine: {
    position: 'absolute',
    left: 23,
    top: 40,
    bottom: 40,
    width: 1,
    backgroundColor: `${colors.primary}66`,
  },
});
