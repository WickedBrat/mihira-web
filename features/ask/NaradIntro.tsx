// features/ask/NaradIntro.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';

// Replace with a Narad-specific image when available
const NARAD_IMAGE_URL =
  'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/sacred%20days/krishna.webp';

interface NaradIntroProps {
  onEnter: () => void;
}

export function NaradIntro({ onEnter }: NaradIntroProps) {
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(32);

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    contentY.value = withDelay(
      600,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const imageStyle = useAnimatedStyle(() => ({ opacity: imageOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      safe: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
      },
      imageWrapper: {
        width: 160,
        height: 160,
        borderRadius: 80,
        overflow: 'hidden',
        marginBottom: 36,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
      },
      image: { width: '100%', height: '100%' },
      name: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(40),
        color: c.onSurface,
        letterSpacing: -1,
        textAlign: 'center',
        marginBottom: 6,
      },
      essence: {
        fontFamily: fonts.label,
        fontSize: scaleFont(12),
        color: 'rgba(212, 175, 55, 0.85)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 28,
      },
      body: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: scaleFont(24),
        marginBottom: 48,
      },
    }),
  );

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(212, 175, 55, 0.10)" top={-80} left={-60} size={360} />
        <AmbientBlob color="rgba(255, 140, 0, 0.06)" top={400} left={60} size={280} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <Animated.View style={[styles.imageWrapper, imageStyle]}>
          <Image source={{ uri: NARAD_IMAGE_URL }} style={styles.image} resizeMode="cover" />
        </Animated.View>

        <Animated.View style={[{ alignItems: 'center', width: '100%' }, contentStyle]}>
          <Text style={styles.name}>Narad</Text>
          <Text style={styles.essence}>Celestial Companion</Text>
          <Text style={styles.body}>
            Share what is on your mind. Narad will seek the wisest counsel and return with their
            words — a shloka, a truth, a direction.
          </Text>
          <SacredButton label="Seek Counsel" onPress={onEnter} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
