import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Wind, Infinity as InfinityIcon } from 'lucide-react-native';
import { FeaturedCard } from '@/features/gurukul/FeaturedCard';
import { CategoryCard } from '@/features/gurukul/CategoryCard';
import { LessonRow } from '@/features/gurukul/LessonRow';
import { GurukulYogiBackdrop } from '@/components/ui/GurukulYogiBackdrop';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { PageHero } from '@/components/ui/PageHero';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Lesson } from '@/features/gurukul/LessonRow';

const LESSONS: Lesson[] = [
  { id: '1', title: 'Mindful Relationships', duration: '6 mins', category: 'Emotional Intelligence' },
  { id: '2', title: 'The Silent Observer', duration: '4 mins', category: 'Meditation Basics' },
  { id: '3', title: 'Karma & Right Action', duration: '8 mins', category: 'Philosophy' },
  { id: '4', title: 'Breath as Gateway', duration: '5 mins', category: 'Breathwork' },
];

export default function GurukulScreen() {
  return (
    <View style={styles.root}>
      <PageAmbientBlobs />
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonLabel}>Gurukul</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonSubtitle}>
          Your sacred digital library of wisdom, breathwork & philosophy is being prepared.
        </Text>
      </View>
    </View>
  );
}

/*
function GurukulScreenFull() {
  return (
    <View style={styles.root}>
      <PageAmbientBlobs />
      {/* <GurukulYogiBackdrop /> * /}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageHero
          meta="Gurukul"
          title={(
            <>
              Your Sacred{'\n'}
              <Text style={styles.heroTitleAccent}>Digital Library</Text>
            </>
          )}
          subtitle="Explore bite-sized wisdom designed to settle the mind and nourish the soul."
          style={styles.hero}
          titleStyle={styles.heroTitle}
          subtitleMaxWidth={340}
        />

        <FeaturedCard
          title="The Art of Detachment"
          description="A guide to releasing expectations and finding peace in the present moment. A 12-minute deep dive into ancient philosophies."
          duration="12 min"
          onBegin={() => { }}
        />

        <View style={styles.categoryRow}>
          <CategoryCard
            icon={<Wind size={22} color={colors.primary} />}
            title="Breathwork"
            sessionCount="4 Active Sessions"
            progress={0.66}
            accentColor={colors.primary}
          />
          <CategoryCard
            icon={<InfinityIcon size={22} color={colors.secondary} />}
            title="Philosophy"
            sessionCount="12 Masterclasses"
            progress={0.33}
            accentColor={colors.secondary}
          />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Insights</Text>
            <Text style={styles.recentViewAll}>View All</Text>
          </View>
          <View style={styles.lessonList}>
            {LESSONS.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </View>
        </View>

        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            "The quieter you become, the more you are able to hear."
          </Text>
          <Text style={styles.quoteCite}>Rumi</Text>
        </View>
      </ScrollView>
    </View>
  );
}
*/

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingX,
    gap: 12,
  },
  comingSoonLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(11),
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.secondaryFixedDim,
    marginBottom: 4,
  },
  comingSoonTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(40),
    color: colors.onSurface,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontFamily: fonts.label,
    fontSize: scaleFont(15),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: scaleFont(22),
    maxWidth: 280,
    marginTop: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 84,
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 176,
    gap: 24,
  },
  hero: { paddingBottom: 24 },
  heroTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(40),
    color: colors.onSurface,
    letterSpacing: -0.8,
    lineHeight: scaleFont(46),
  },
  heroTitleAccent: {
    color: colors.secondaryFixedDim,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 14,
    height: 168,
  },
  recentSection: { gap: 6 },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(20),
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  recentViewAll: {
    fontFamily: fonts.label,
    fontSize: scaleFont(11),
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
  },
  lessonList: { gap: 2 },
  quoteSection: {
    paddingVertical: 48,
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}1A`,
    alignItems: 'center',
    gap: 20,
  },
  quoteText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(20),
    fontStyle: 'italic',
    color: `${colors.onSurface}CC`,
    textAlign: 'center',
    lineHeight: scaleFont(30),
    maxWidth: 320,
  },
  quoteCite: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.onSurfaceVariant,
  },
});
