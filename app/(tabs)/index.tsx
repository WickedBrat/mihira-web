import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Bell, UserCircle } from 'lucide-react-native';
import { GlowCard } from '@/components/ui/GlowCard';
import { SacredButton } from '@/components/ui/SacredButton';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { DailyArthCard } from '@/features/daily/DailyArthCard';
import { LessonCard } from '@/features/daily/LessonCard';
import { colors, fonts } from '@/lib/theme';
import type { PastInsight } from '@/features/daily/types';

const QUOTE = '"You have a right to your actions, but never to their fruits."';
const SOURCE = 'The Bhagavad Gita';

const PAST_INSIGHTS: PastInsight[] = [
  { id: '1', title: 'The Power of Stillness', date: 'Yesterday', readTime: '4 min read', iconName: 'history_edu' },
  { id: '2', title: 'Detached Observation', date: 'Oct 24', readTime: '6 min read', iconName: 'self_improvement' },
];

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(212, 190, 228, 0.1)" top={-100} left={-60} size={380} />

      {/* Top Navigation */}
      <View style={styles.navWrap}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.nav}>
            <View style={styles.navLeft}>
              <Text style={styles.navBrand}>Aksha</Text>
            </View>
            <View style={styles.navRight}>
              <Bell size={20} color={colors.onSurfaceVariant} />
              <UserCircle size={24} color={colors.onSurfaceVariant} />
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
          <SacredButton label="✦  Reflect" onPress={() => {}} />
          <Text style={styles.ctaMeta}>4.2k others are reflecting today</Text>
        </View>

        {/* Past Insights */}
        <View style={styles.insightsSection}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsTitle}>Past Insights</Text>
            <Text style={styles.insightsViewAll}>View All</Text>
          </View>
          <View style={styles.insightsList}>
            {PAST_INSIGHTS.map((insight) => (
              <LessonCard key={insight.id} insight={insight} />
            ))}
          </View>
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
  navWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottomWidth: 0,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navLeft: {},
  navBrand: {
    fontFamily: fonts.headline,
    fontSize: 20,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 120,
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
    color: colors.onSurfaceVariant,
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
  insightsSection: {
    marginTop: 72,
    alignSelf: 'stretch',
    maxWidth: 480,
    marginBottom: 32,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontFamily: fonts.headline,
    fontSize: 20,
    color: colors.onSurface,
  },
  insightsViewAll: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.primary,
  },
  insightsList: {
    gap: 8,
  },
});
