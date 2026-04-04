import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { PageHero } from '@/components/ui/PageHero';
import { DailyArthCard } from '@/features/daily/DailyArthCard';
import { SacredDayCard } from '@/features/daily/SacredDayCard';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { getTodaySacredDays } from '@/lib/sacredDays';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

const QUOTE = '"You have a right to your actions, but never to their fruits."';
const SOURCE = 'The Bhagavad Gita';

export default function HomeScreen() {
  const { chart, summary, highlights, reasoning, isLoading, error } = useDailyAlignment();
  const todayEvents = getTodaySacredDays();

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
          <DailyArthCard />
        </GlowCard>

        {/* What's Special Today */}
        {todayEvents.length > 0 && (
          <View style={styles.sacredSection}>
            <View style={styles.sacredHeader}>
              <Text style={styles.sacredMeta}>✦  Special Today</Text>
            </View>

            <View style={styles.cardList}>
              {todayEvents.map((day) => (
                <SacredDayCard key={day.id} day={day} />
              ))}
            </View>
          </View>
        )}

        {/* Celestial Alignment */}
        <View style={styles.alignmentSection}>
          <View style={styles.alignmentHeader}>
            <Text style={styles.alignmentMeta}>Celestial Alignment</Text>
            <Text style={styles.alignmentTitle}>Cosmos Today</Text>
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
    paddingTop: 64,
    paddingBottom: 176,
    alignItems: 'center',
  },
  header: {
    paddingBottom: 40,
    paddingHorizontal: layout.screenPaddingX,
  },
  section: {
    alignSelf: 'stretch',
    maxWidth: 480,
    marginHorizontal: layout.screenPaddingX,
  },

  // Sacred section
  sacredSection: {
    marginTop: 52,
    alignSelf: 'stretch',
    gap: 20,
  },
  sacredHeader: {
    paddingHorizontal: layout.screenPaddingX,
    gap: 6,
  },
  sacredMeta: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
  },
  sacredTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(32),
    color: colors.onSurface,
    letterSpacing: -0.8,
    lineHeight: scaleFont(38),
  },
  sacredSub: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(21),
  },
  cardList: {
    paddingHorizontal: layout.screenPaddingX,
    gap: 10,
  },

  // Alignment
  alignmentSection: {
    marginTop: 64,
    alignSelf: 'stretch',
    maxWidth: 480,
    marginBottom: 40,
    paddingHorizontal: layout.screenPaddingX,
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
