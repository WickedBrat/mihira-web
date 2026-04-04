// features/daily/SacredDayCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { SacredDay } from '@/lib/sacredDays';

// Static require map — Metro resolves these at bundle time
const IMAGE_MAP = {
  'hanuman-jayanti': require('../../assets/sacred-days/hanuman-jayanti.png'),
  'ram-navami': require('../../assets/sacred-days/ram-navami.png'),
  'navratri': require('../../assets/sacred-days/navratri.png'),
} as const;

interface SacredDayCardProps {
  day: SacredDay;
}

export function SacredDayCard({ day }: SacredDayCardProps) {
  const handlePress = () => {
    hapticLight();
    router.push(`/sacred-day/${day.id}`);
  };

  const imageSource = IMAGE_MAP[day.imageKey];
  // Derive a dark tinted background from the accent color
  const bgColor = `${day.accentColor}22`;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, { backgroundColor: bgColor }, pressed && styles.cardPressed]}
    >
      {/* Right-side illustration — bleeds in from the right */}
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      {/* Gradient: solid dark left → transparent right, so image only shows on right */}
      <LinearGradient
        colors={[colors.surface, colors.surface, `${colors.surface}e0`, `${colors.surface}60`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content row */}
      <View style={styles.row}>
        {/* Star icon */}
        <Star size={16} color={day.accentColor} fill={day.accentColor} style={styles.star} />

        {/* Label + Title */}
        <View style={styles.textBlock}>
          <Text style={styles.label}>FESTIVAL</Text>
          <Text style={styles.title} numberOfLines={1}>{day.title}</Text>
        </View>

        {/* Chevron */}
        <View style={[styles.chevronWrap, { backgroundColor: `${day.accentColor}45` }]}>
          <ChevronRight size={16} color={colors.onSurfaceVariant} />
        </View>
      </View>

      {/* Accent border */}
      <View style={[styles.border]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 78,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    borderWidth: 0
  },
  cardPressed: {
    opacity: 0.82,
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    borderRadius: 16,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
    zIndex: 1,
    padding: 25,
  },
  star: {
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(17),
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
  },
});
