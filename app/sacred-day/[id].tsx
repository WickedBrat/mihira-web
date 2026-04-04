// app/sacred-day/[id].tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { getSacredDayById } from '@/lib/sacredDays';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_CLEAR_HEIGHT = SCREEN_HEIGHT * 0.48;

const IMAGE_MAP = {
  'hanuman-jayanti': require('../../assets/sacred-days/hanuman-jayanti.png'),
  'ram-navami': require('../../assets/sacred-days/ram-navami.png'),
  'navratri': require('../../assets/sacred-days/navratri.png'),
} as const;

export default function SacredDayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const day = getSacredDayById(id);

  if (!day) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Sacred day not found.</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={20} color={colors.onSurface} />
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {/* Full-screen fixed background image */}
      <Image
        source={IMAGE_MAP[day.imageKey]}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Subtle dark overlay so image doesn't overpower on the clear half */}
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Back button — floats over image, always visible */}
      <SafeAreaView edges={['top']} style={styles.backButtonLayer} pointerEvents="box-none">
        <Pressable
          style={styles.backPill}
          onPress={() => { hapticLight(); router.back(); }}
        >
          <ChevronLeft size={18} color="#fff" />
        </Pressable>
      </SafeAreaView>

      {/* ScrollView: transparent spacer then glass content panel */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transparent spacer — the image shows clearly through this */}
        <View style={styles.imageSpacer} />

        {/* Glass panel — content lives here, image stays fixed behind it */}
        <BlurView intensity={55} tint="dark" style={styles.glassPanel}>
          {/* Top edge shimmer */}
          <View style={[styles.glassTopBorder, { borderColor: `${day.accentColor}30` }]} />

          <View style={styles.content}>
            {/* Accent tag */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              style={[styles.tag, { backgroundColor: `${day.accentColor}22`, borderColor: `${day.accentColor}44` }]}
            >
              <Sparkles size={11} color={day.accentColor} />
              <Text style={[styles.tagText, { color: day.accentColor }]}>
                Sacred Day
              </Text>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(160).duration(500)} style={styles.title}>
              {day.title}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.subtitle}>
              {day.subtitle}
            </Animated.Text>

            {/* Mantra block */}
            {day.mantra && (
              <Animated.View
                entering={FadeInDown.delay(260).duration(500)}
                style={[styles.mantraCard, { borderColor: `${day.accentColor}30` }]}
              >
                <LinearGradient
                  colors={[`${day.accentColor}18`, `${day.accentColor}08`]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.mantraDevanagari}>{day.mantra}</Text>
                {day.mantraTranslation && (
                  <Text style={styles.mantraTranslation}>{day.mantraTranslation}</Text>
                )}
              </Animated.View>
            )}

            {/* Significance */}
            <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.section}>
              <Text style={styles.sectionLabel}>Significance</Text>
              <Text style={styles.body}>{day.significance}</Text>
            </Animated.View>

            {/* How to observe */}
            <Animated.View entering={FadeInDown.delay(380).duration(500)} style={styles.section}>
              <Text style={styles.sectionLabel}>How to Observe</Text>
              <View style={styles.stepList}>
                {day.howToObserve.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: day.accentColor }]} />
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Tags */}
            <Animated.View entering={FadeInDown.delay(440).duration(500)} style={styles.tagRow}>
              {day.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },

  // Fixed full-screen image
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  // Back button layer
  backButtonLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 8,
    zIndex: 10,
  },
  backPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(14,14,14,0.50)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ScrollView
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Transparent area — image shows clearly here
  imageSpacer: {
    height: IMAGE_CLEAR_HEIGHT,
  },

  // Glass content panel
  glassPanel: {
    minHeight: SCREEN_HEIGHT * 0.6,
    paddingBottom: 120,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  glassTopBorder: {
    height: 1,
    marginHorizontal: 32,
    marginTop: 10,
    borderTopWidth: 1,
    marginBottom: 6,
  },

  // Content
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 20,
    gap: 0,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    marginBottom: 14,
  },
  tagText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(34),
    color: '#fff',
    letterSpacing: -0.8,
    lineHeight: scaleFont(40),
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: scaleFont(16),
    color: 'rgba(255,255,255,0.65)',
    lineHeight: scaleFont(24),
    marginBottom: 28,
  },

  // Mantra card
  mantraCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    overflow: 'hidden',
    marginBottom: 32,
    alignItems: 'center',
  },
  mantraDevanagari: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(22),
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  mantraTranslation: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: scaleFont(20),
    fontStyle: 'italic',
  },

  // Sections
  section: {
    marginBottom: 28,
    gap: 12,
  },
  sectionLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(11),
    color: colors.secondaryFixed,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    color: 'rgba(255,255,255,0.62)',
    lineHeight: scaleFont(24),
  },

  // Steps
  stepList: { gap: 12 },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: 'rgba(255,255,255,0.62)',
    lineHeight: scaleFont(22),
  },

  // Tag chips
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tagChipText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(11),
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
  },

  // Error
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontFamily: fonts.body, fontSize: scaleFont(16), color: colors.onSurfaceVariant },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 9999, backgroundColor: colors.surfaceContainerLow,
  },
  backBtnText: { fontFamily: fonts.label, fontSize: scaleFont(14), color: colors.onSurface },
});
