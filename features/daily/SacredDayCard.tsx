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
import type { CalendarEvent } from '@/features/daily/useCalendarEvents';

const ACCENT_COLOR = '#e8a020';

interface SacredDayCardProps {
  event: CalendarEvent;
}

export function SacredDayCard({ event }: SacredDayCardProps) {
  const handlePress = () => {
    hapticLight();
    router.push(`/sacred-day/${event.id}`);
  };

  const bgColor = `${ACCENT_COLOR}22`;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, { backgroundColor: bgColor }, pressed && styles.cardPressed]}
    >
      {/* Right-side illustration — bleeds in from the right */}
      {event.image_url ? (
        <Image source={{ uri: event.image_url }} style={styles.image} resizeMode="cover" />
      ) : null}

      {/* Gradient: solid dark left → transparent right */}
      <LinearGradient
        colors={[colors.surface, colors.surface, `${colors.surface}e0`, `${colors.surface}60`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content row */}
      <View style={styles.row}>
        <Star size={16} color={ACCENT_COLOR} fill={ACCENT_COLOR} style={styles.star} />

        <View style={styles.textBlock}>
          <Text style={styles.label}>
            {event.tag ? event.tag.toUpperCase() : 'FESTIVAL'}
          </Text>
          <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        </View>

        <View style={[styles.chevronWrap, { backgroundColor: `${ACCENT_COLOR}45` }]}>
          <ChevronRight size={16} color={colors.onSurfaceVariant} />
        </View>
      </View>

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
