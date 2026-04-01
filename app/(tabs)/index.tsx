import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlowCard } from '@/components/ui/GlowCard';
import { SacredButton } from '@/components/ui/SacredButton';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { DailyArthCard } from '@/features/daily/DailyArthCard';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { colors, fonts } from '@/lib/theme';

const QUOTE = '"You have a right to your actions, but never to their fruits."';
const SOURCE = 'The Bhagavad Gita';

export default function HomeScreen() {
  const { chart, summary, highlights, reasoning, isLoading, error } = useDailyAlignment();

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(212, 190, 228, 0.1)" top={-100} left={-60} size={380} />
      <AmbientBlob color="rgba(149, 0, 255, 0.08)" top={480} left={220} size={280} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Peace Header */}
        <View style={styles.header}>
          <Text style={styles.headerMeta}>Mindful Morning</Text>
          <Text style={styles.headerTitle}>Daily Aksha</Text>
          <Text style={styles.headerSub}>Finding stillness in the noise.</Text>
        </View>

        {/* Glow Hero Quote Card */}
        <GlowCard style={styles.section}>
          <DailyArthCard quote={QUOTE} source={SOURCE} />
        </GlowCard>

        {/* Reflect CTA */}
        <View style={styles.ctaSection}>
          <SacredButton label="✦  Reflect" onPress={() => { }} />
          <Text style={styles.ctaMeta}>4.2k others are reflecting today</Text>
        </View>

        <View style={styles.alignmentSection}>
          <View style={styles.alignmentHeader}>
            <Text style={styles.alignmentMeta}>Celestial Alignment</Text>
            <Text style={styles.alignmentTitle}>Cosmos Today</Text>
            <Text style={styles.alignmentSub}>
              Ground truth from the stars, folded into your daily home ritual.
            </Text>
          </View>

          <DailyAlignmentCard
            summary={summary}
            highlights={highlights}
            reasoning={reasoning}
            chart={chart}
            isLoading={isLoading}
            error={error}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 160,
    alignItems: 'center',
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerMeta: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: 42,
    color: colors.onSurface,
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 8,
  },
  headerSub: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  section: {
    alignSelf: 'stretch',
    maxWidth: 480,
  },
  ctaSection: {
    marginTop: 48,
    alignItems: 'center',
    gap: 16,
  },
  ctaMeta: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
  alignmentSection: {
    marginTop: 72,
    alignSelf: 'stretch',
    maxWidth: 480,
    marginBottom: 32,
  },
  alignmentHeader: {
    marginBottom: 16,
    gap: 8,
  },
  alignmentMeta: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
  },
  alignmentTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: 32,
    color: colors.onSurface,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  alignmentSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
});
