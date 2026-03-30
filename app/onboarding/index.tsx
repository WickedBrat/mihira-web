import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChoiceCard } from '@/features/onboarding/ChoiceCard';
import { SacredButton } from '@/components/ui/SacredButton';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { colors, fonts } from '@/lib/theme';

const CHOICES = [
  {
    id: 'decisions',
    icon: '⚖️',
    title: 'Decisions',
    subtitle: 'Finding clarity amidst complex choices.',
  },
  {
    id: 'relationships',
    icon: '❤️',
    title: 'Relationships',
    subtitle: 'Nurturing connections with yourself and others.',
  },
  {
    id: 'anxiety',
    icon: '🌬️',
    title: 'Anxiety',
    subtitle: 'Finding your center in the storm of noise.',
  },
  {
    id: 'purpose',
    icon: '🧘',
    title: 'Purpose',
    subtitle: 'Aligning your daily actions with deeper intent.',
  },
] as const;

type ChoiceId = (typeof CHOICES)[number]['id'];

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<ChoiceId | null>(null);
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safe}>
      <AmbientBlob
        color="rgba(212, 190, 228, 0.08)"
        top={-80}
        left={-80}
        size={350}
      />
      <AmbientBlob
        color="rgba(184, 152, 122, 0.05)"
        top={400}
        left={200}
        size={300}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.logo}>Aksha</Text>
        </Animated.View>

        {/* Heading */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.headerSection}
        >
          <Text style={styles.meta}>Onboarding</Text>
          <Text style={styles.headline}>What's weighing on your mind?</Text>
          <Text style={styles.subheadline}>
            Choose a focus area for today. Your path to clarity is a quiet,
            intentional journey.
          </Text>
        </Animated.View>

        {/* Choice grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <ChoiceCard
              {...CHOICES[0]}
              isSelected={selected === CHOICES[0].id}
              onPress={() => setSelected(CHOICES[0].id)}
              enterDelay={150}
              style={styles.halfCard}
            />
            <ChoiceCard
              {...CHOICES[1]}
              isSelected={selected === CHOICES[1].id}
              onPress={() => setSelected(CHOICES[1].id)}
              enterDelay={200}
              style={styles.halfCard}
            />
          </View>
          <View style={styles.row}>
            <ChoiceCard
              {...CHOICES[2]}
              isSelected={selected === CHOICES[2].id}
              onPress={() => setSelected(CHOICES[2].id)}
              enterDelay={250}
              style={styles.halfCard}
            />
            <ChoiceCard
              {...CHOICES[3]}
              isSelected={selected === CHOICES[3].id}
              onPress={() => setSelected(CHOICES[3].id)}
              enterDelay={300}
              style={styles.halfCard}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(600)}
        style={styles.footer}
      >
        <View style={styles.footerDivider} />
        <SacredButton
          label="Let's Start →"
          onPress={() => { if (selected) router.replace('/(tabs)'); }}
          style={{ opacity: selected ? 1 : 0.4 }}
        />
      </Animated.View>

      {/* Decorative monolith shape */}
      <View
        style={[
          styles.monolith,
          {
            width: width * 0.4,
            transform: [{ skewX: '-12deg' }, { translateX: width * 0.2 }],
            pointerEvents: 'none',
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(25, 26, 26, 0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    padding: 24,
    paddingBottom: 120,
  },
  logo: {
    fontFamily: fonts.headline,
    fontSize: 18,
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: 48,
  },
  headerSection: {
    marginBottom: 32,
  },
  meta: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondary,
    marginBottom: 12,
  },
  headline: {
    fontFamily: fonts.headlineExtra,
    fontSize: 36,
    color: colors.onSurface,
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subheadline: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(14, 14, 14, 0.95)',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  footerDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(72, 72, 72, 0.1)',
    alignSelf: 'center',
  },
  monolith: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.2,
  },
});
