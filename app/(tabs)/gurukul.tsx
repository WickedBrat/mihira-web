import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Wind, Infinity as InfinityIcon, Bell } from 'lucide-react-native';
import { FeaturedCard } from '@/features/gurukul/FeaturedCard';
import { CategoryCard } from '@/features/gurukul/CategoryCard';
import { LessonRow } from '@/features/gurukul/LessonRow';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { colors, fonts } from '@/lib/theme';
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
      <AmbientBlob color="rgba(212, 190, 228, 0.06)" top={-60} left={-40} size={350} />
      <AmbientBlob color="rgba(184, 152, 122, 0.05)" top={300} left={200} size={300} />

      {/* Fixed Header */}
      <View style={styles.headerWrap}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar} />
              <Text style={styles.headerBrand}>Aksha</Text>
            </View>
            <Bell size={20} color={colors.onSurfaceVariant} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Gurukul</Text>
          </View>
          <Text style={styles.heroTitle}>
            Your Sacred{'\n'}
            <Text style={styles.heroTitleAccent}>Digital Library</Text>
          </Text>
          <Text style={styles.heroSub}>
            Explore bite-sized wisdom designed to settle the mind and nourish the soul.
          </Text>
        </View>

        {/* Featured Card */}
        <FeaturedCard
          title="The Art of Detachment"
          description="A guide to releasing expectations and finding peace in the present moment. A 12-minute deep dive into ancient philosophies."
          duration="12 min"
          onBegin={() => {}}
        />

        {/* Category Cards */}
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

        {/* Recent Insights */}
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

        {/* Quote */}
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerBrand: {
    fontFamily: fonts.headline,
    fontSize: 18,
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: 24,
    paddingBottom: 160,
    gap: 20,
  },
  hero: { gap: 12, marginBottom: 8 },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: `${colors.secondary}1A`,
    borderWidth: 1,
    borderColor: `${colors.secondary}1A`,
  },
  heroBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.secondary,
  },
  heroTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: 40,
    color: colors.onSurface,
    letterSpacing: -0.8,
    lineHeight: 46,
  },
  heroTitleAccent: {
    color: colors.primaryFixedDim,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    maxWidth: 320,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
    height: 160,
  },
  recentSection: { gap: 4 },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTitle: {
    fontFamily: fonts.headline,
    fontSize: 20,
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  recentViewAll: {
    fontFamily: fonts.label,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
  },
  lessonList: { gap: 2 },
  quoteSection: {
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}1A`,
    alignItems: 'center',
    gap: 16,
  },
  quoteText: {
    fontFamily: fonts.label,
    fontSize: 20,
    fontStyle: 'italic',
    color: `${colors.onSurface}CC`,
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 320,
  },
  quoteCite: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.onSurfaceVariant,
  },
});
