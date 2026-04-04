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
  ActivityIndicator,
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
import { useCalendarEventById } from '@/features/daily/useCalendarEvents';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_CLEAR_HEIGHT = SCREEN_HEIGHT * 0.48;

const ACCENT_COLOR = '#e8a020';

export default function SacredDayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : null;
  const { event: day, isLoading, error } = useCalendarEventById(numericId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.notFound}>
          <ActivityIndicator color={colors.onSurface} />
        </View>
      </SafeAreaView>
    );
  }

  if (!day || error) {
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

  const rituals = day.rituals ?? [];
  const tag = day.tag ?? 'Sacred Day';

  return (
    <View style={styles.root}>
      {/* Full-screen fixed background image */}
      {day.image_url ? (
        <Image
          source={{ uri: day.image_url }}
          style={styles.bgImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.bgImage, { backgroundColor: `${ACCENT_COLOR}22` }]} />
      )}

      {/* Subtle dark overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Back button */}
      <SafeAreaView edges={['top']} style={styles.backButtonLayer} pointerEvents="box-none">
        <Pressable
          style={styles.backPill}
          onPress={() => { hapticLight(); router.back(); }}
        >
          <ChevronLeft size={18} color="#fff" />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSpacer} />

        <BlurView intensity={55} tint="dark" style={styles.glassPanel}>
          <View style={[styles.glassTopBorder, { borderColor: `${ACCENT_COLOR}30` }]} />

          <View style={styles.content}>
            {/* Tag */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              style={[styles.tag, { backgroundColor: `${ACCENT_COLOR}22`, borderColor: `${ACCENT_COLOR}44` }]}
            >
              <Sparkles size={11} color={ACCENT_COLOR} />
              <Text style={[styles.tagText, { color: ACCENT_COLOR }]}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Text>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(160).duration(500)} style={styles.title}>
              {day.title}
            </Animated.Text>
            {day.short_description ? (
              <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.subtitle}>
                {day.short_description}
              </Animated.Text>
            ) : null}

            {/* Mantra block */}
            {day.mantra ? (
              <Animated.View
                entering={FadeInDown.delay(260).duration(500)}
                style={[styles.mantraCard, { borderColor: `${ACCENT_COLOR}30` }]}
              >
                <LinearGradient
                  colors={[`${ACCENT_COLOR}18`, `${ACCENT_COLOR}08`]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.mantraDevanagari}>{day.mantra}</Text>
              </Animated.View>
            ) : null}

            {/* Significance */}
            {day.significance ? (
              <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.section}>
                <Text style={styles.sectionLabel}>Significance</Text>
                <Text style={styles.body}>{day.significance}</Text>
              </Animated.View>
            ) : null}

            {/* Rituals */}
            {rituals.length > 0 ? (
              <Animated.View entering={FadeInDown.delay(380).duration(500)} style={styles.section}>
                <Text style={styles.sectionLabel}>How to Observe</Text>
                <View style={styles.stepList}>
                  {rituals.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={[styles.stepDot, { backgroundColor: ACCENT_COLOR }]} />
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            ) : null}

            {/* Tag chip */}
            <Animated.View entering={FadeInDown.delay(440).duration(500)} style={styles.tagRow}>
              <View style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },

  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

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

  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  imageSpacer: {
    height: IMAGE_CLEAR_HEIGHT,
  },

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

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontFamily: fonts.body, fontSize: scaleFont(16), color: colors.onSurfaceVariant },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 9999, backgroundColor: colors.surfaceContainerLow,
  },
  backBtnText: { fontFamily: fonts.label, fontSize: scaleFont(14), color: colors.onSurface },
});
