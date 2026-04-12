import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import type { TimelineEntry } from './types';

const BG_IMAGES: Record<string, ReturnType<typeof require>> = {
  morning: require('@/assets/time-of-the-day/morning.png'),
  afternoon: require('@/assets/time-of-the-day/afternoon.png'),
  evening: require('@/assets/time-of-the-day/night.png'),
  night: require('@/assets/time-of-the-day/night.png'),
};

interface Props {
  entry: TimelineEntry;
  isLast?: boolean;
}

export function TimeOfDayCard({ entry, isLast = false }: Props) {
  const { isDark } = useTheme();
  const styles = useThemedStyles((_c, _glass, _gradients, dark) =>
    StyleSheet.create({
      wrapper: {
        alignItems: 'center',
      },
      timeLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      container: {
        alignSelf: 'stretch',
        borderRadius: 24,
        overflow: 'hidden',
        minHeight: 190,
      },
      image: {
        borderRadius: 24,
      },
      gradient: {
        flex: 1,
        minHeight: 190,
        justifyContent: 'flex-end',
        padding: 20,
        gap: 6,
      },
      timeLabel: {
        fontFamily: fonts.label,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 3,
        color: 'rgba(255,255,255,0.65)',
      },
      activity: {
        fontFamily: fonts.headline,
        fontSize: 22,
        color: '#ffffff',
        letterSpacing: -0.4,
        lineHeight: 28,
      },
      timeRange: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
      },
      quote: {
        fontFamily: fonts.body,
        fontSize: 14,
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 22,
        fontStyle: 'italic',
        marginTop: 4,
      },
      connector: {
        alignItems: 'center',
        height: 32,
        gap: 4,
        paddingVertical: 4,
      },
      connectorLine: {
        flex: 1,
        width: 1.5,
        backgroundColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
      },
      connectorDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
      },
    })
  );

  const image = BG_IMAGES[entry.id] ?? BG_IMAGES.morning;

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={image ?? ''}
        style={styles.container}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <BlurView intensity={8} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
          <View style={styles.timeLabelContainer}>
            <Text style={styles.timeLabel}>{entry.subtitle}</Text>
            <View style={styles.connectorDot} />
            {entry.timeRange ? <Text style={styles.timeLabel}>{entry.timeRange}</Text> : null}
          </View>
          <Text style={styles.activity}>{entry.label}</Text>
          <Text style={styles.quote}>{entry.quote}</Text>
        </LinearGradient>
      </ImageBackground>

      {!isLast && (
        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <View style={styles.connectorDot} />
          <View style={styles.connectorLine} />
        </View>
      )}
    </View>
  );
}
