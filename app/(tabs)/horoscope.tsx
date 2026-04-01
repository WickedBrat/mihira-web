// app/(tabs)/horoscope.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { colors, fonts } from '@/lib/theme';

export default function HoroscopeScreen() {
  const { chart, guidance, reasoning, isLoading, error } = useDailyAlignment();

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(149, 0, 255, 0.08)" top={-60} left={200} size={300} />
      <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={500} left={-80} size={280} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.meta}>Celestial Alignment</Text>
          <Text style={styles.title}>Your Daily Alignment</Text>
          <Text style={styles.sub}>
            Ground truth from the stars. AI-guided dharma for today.
          </Text>
        </View>

        <DailyAlignmentCard
          guidance={guidance}
          reasoning={reasoning}
          chart={chart}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingTop: 150, paddingHorizontal: 24, paddingBottom: 160 },
  banner: { marginBottom: 24 },
  meta: {
    fontFamily: fonts.label, fontSize: 10, textTransform: 'uppercase',
    letterSpacing: 3, color: colors.secondaryFixed, marginBottom: 10,
  },
  title: {
    fontFamily: fonts.headlineExtra, fontSize: 36, color: colors.onSurface,
    letterSpacing: -0.5, lineHeight: 42, marginBottom: 12,
  },
  sub: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 22,
  },
});
