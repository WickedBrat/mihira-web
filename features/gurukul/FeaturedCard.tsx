import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { colors, fonts } from '@/lib/theme';

interface FeaturedCardProps {
  title: string;
  description: string;
  duration: string;
  onBegin: () => void;
}

export function FeaturedCard({ title, description, duration, onBegin }: FeaturedCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.surfaceContainerHigh, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', colors.surface]}
        style={styles.fadeOverlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Sparkles size={12} color={colors.primary} />
          <Text style={styles.badgeText}>Featured Wisdom</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <SacredButton label="Begin Session" onPress={onBegin} style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: 'hidden',
    height: 280,
    borderWidth: 1,
    borderColor: 'rgba(37, 38, 38, 0.6)',
    justifyContent: 'flex-end',
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  content: {
    padding: 24,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.primary,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 26,
    color: colors.onSurface,
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  btn: { alignSelf: 'flex-start', marginTop: 8 },
});
