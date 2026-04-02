import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlowCard } from '@/components/ui/GlowCard';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { PageHero } from '@/components/ui/PageHero';
import { DailyArthCard } from '@/features/daily/DailyArthCard';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

const QUOTE = '"You have a right to your actions, but never to their fruits."';
const SOURCE = 'The Bhagavad Gita';

export default function HomeScreen() {
  const { chart, summary, highlights, reasoning, isLoading, error } = useDailyAlignment();

  return (
    <View style={styles.root}>
      <PageAmbientBlobs />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageHero
          meta="Mindful Morning"
          title="Daily Aksha"
          subtitle="Finding stillness in the noise."
          style={styles.header}
        />

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
    paddingTop: 84,
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 176,
    alignItems: 'center',
  },
  header: {
    paddingBottom: 40,
  },
  section: {
    alignSelf: 'stretch',
    maxWidth: 480,
  },
  ctaSection: {
    marginTop: 56,
    alignItems: 'center',
    gap: 16,
  },
  ctaMeta: {
    fontFamily: fonts.label,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
  alignmentSection: {
    marginTop: 84,
    alignSelf: 'stretch',
    maxWidth: 480,
    marginBottom: 40,
  },
  alignmentHeader: {
    marginBottom: 16,
    gap: 8,
  },
  alignmentMeta: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
  },
  alignmentTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(32),
    color: colors.onSurface,
    letterSpacing: -0.8,
    lineHeight: scaleFont(38),
  },
  alignmentSub: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(22),
  },
});
