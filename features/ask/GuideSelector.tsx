// features/ask/GuideSelector.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { hapticLight, hapticMedium } from '@/lib/haptics';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { GUIDES, type GuidePersona } from './guidePersonas';

interface GuideSelectorProps {
  onCommit: (guideName: string) => void;
}

function GuideCard({
  guide,
  isSelected,
  onPress,
  enterDelay,
}: {
  guide: GuidePersona;
  isSelected: boolean;
  onPress: () => void;
  enterDelay: number;
}) {
  const glowOpacity = useSharedValue(0);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    hapticLight();
    onPress();
  };

  React.useEffect(() => {
    glowOpacity.value = withTiming(isSelected ? 1 : 0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSelected]);

  return (
    <Animated.View entering={FadeInDown.delay(enterDelay).duration(600)}>
      <Pressable onPress={handlePress} style={styles.guideCard}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.guideCardGlow, glowStyle]} />
        <Text style={styles.guideEmoji}>{guide.emoji}</Text>
        <View style={styles.guideTextBlock}>
          <Text style={styles.guideName}>{guide.name}</Text>
          <Text style={styles.guideEssence}>{guide.essence}</Text>
        </View>
        {isSelected && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.selectedDot} />
        )}
      </Pressable>
    </Animated.View>
  );
}

export function GuideSelector({ onCommit }: GuideSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedGuide = selected ? GUIDES.find(g => g.name === selected) : null;

  const handleCommit = () => {
    if (!selected) return;
    hapticMedium();
    onCommit(selected);
  };

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(181, 100, 252, 0.10)" top={-80} left={-60} size={340} />
        <AmbientBlob color="rgba(184, 152, 122, 0.07)" top={400} left={20} size={300} />
      </View>

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <Animated.View entering={FadeInDown.duration(700)} style={styles.header}>
          <Text style={styles.meta}>Sacred Guidance</Text>
          <Text style={styles.title}>Who calls{'\n'}to your soul?</Text>
          <Text style={styles.subtitle}>
            This is a lifelong commitment.{'\n'}Choose with intention.
          </Text>
        </Animated.View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GUIDES.map((guide, i) => (
          <GuideCard
            key={guide.name}
            guide={guide}
            isSelected={selected === guide.name}
            onPress={() => setSelected(guide.name)}
            enterDelay={200 + i * 60}
          />
        ))}
        <View style={styles.scrollPad} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Animated.View entering={FadeIn.delay(900).duration(600)}>
          <Pressable
            onPress={handleCommit}
            disabled={!selected}
            style={({ pressed }) => [
              styles.commitBtn,
              !selected && styles.commitBtnDisabled,
              pressed && selected && styles.commitBtnPressed,
            ]}
          >
            <LinearGradient
              colors={selected ? ['rgba(181,100,252,0.9)', 'rgba(181,100,252,0.6)'] : ['rgba(60,60,60,0.5)', 'rgba(60,60,60,0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.commitBtnGradient}
            >
              <Text style={[styles.commitBtnText, !selected && styles.commitBtnTextDisabled]}>
                {selectedGuide ? selectedGuide.commitmentVerb : 'Choose your guide'}
              </Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.permanentNote}>You cannot change this later</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  safeTop: {
    paddingHorizontal: layout.screenPaddingX,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  meta: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.secondaryFixed,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.headlineExtra,
    fontSize: scaleFont(40),
    color: colors.onSurface,
    letterSpacing: -1,
    lineHeight: scaleFont(46),
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    gap: 10,
  },
  scrollPad: { height: 16 },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(37, 38, 38, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  guideCardGlow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
    backgroundColor: `${colors.primary}0e`,
  },
  guideEmoji: {
    fontSize: 28,
  },
  guideTextBlock: {
    flex: 1,
    gap: 2,
  },
  guideName: {
    fontFamily: fonts.label,
    fontSize: scaleFont(16),
    color: colors.onSurface,
  },
  guideEssence: {
    fontFamily: fonts.body,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 16,
    gap: 10,
  },
  commitBtn: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  commitBtnDisabled: {
    opacity: 0.5,
  },
  commitBtnPressed: {
    opacity: 0.85,
  },
  commitBtnGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitBtnText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(15),
    color: colors.onSurface,
    letterSpacing: 0.4,
  },
  commitBtnTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  permanentNote: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: colors.outline,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
});
