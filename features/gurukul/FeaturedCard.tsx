import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface FeaturedCardProps {
  title: string;
  description: string;
  duration: string;
  onBegin: () => void;
}

export function FeaturedCard({ title, description, duration, onBegin }: FeaturedCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      container: {
        borderRadius: 28,
        overflow: 'hidden',
        height: 280,
        borderWidth: 1,
        borderColor: dark ? 'rgba(37, 38, 38, 0.6)' : 'rgba(0, 0, 0, 0.08)',
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
        padding: 32,
        gap: 10,
      },
      badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      },
      badgeText: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.primary,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(26),
        color: c.onSurface,
        letterSpacing: -0.4,
        lineHeight: scaleFont(32),
      },
      description: {
        fontFamily: fonts.body,
        fontSize: scaleFont(13),
        color: c.onSurfaceVariant,
        lineHeight: scaleFont(18),
      },
      duration: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.onSurfaceVariant,
        opacity: 0.6,
      },
      btn: { alignSelf: 'flex-start', marginTop: 10 },
    })
  );

  const bgGradientColors: [string, string] = [colors.surfaceContainerHigh, colors.surface];
  const fadeGradientColors: ['transparent', string] = ['transparent', colors.surface];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={bgGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={fadeGradientColors}
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
        <Text style={styles.duration}>{duration}</Text>
        <SacredButton label="Begin Session" onPress={onBegin} style={styles.btn} />
      </View>
    </View>
  );
}
