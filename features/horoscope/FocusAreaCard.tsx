import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { fonts } from '@/lib/theme';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';

const IMAGES: Record<string, ReturnType<typeof require>> = {
  // Work / Career
  Work:               require('@/assets/focus/work.png'),
  Decisions:          require('@/assets/focus/decision.png'),
  // Relationships
  Partnership:        require('@/assets/focus/partnership.png'),
  'Social bonds':     require('@/assets/focus/partnership.png'),
  Romance:            require('@/assets/focus/partnership.png'),
  // Family / Home
  Home:               require('@/assets/focus/home.png'),
  'Domestic matters': require('@/assets/focus/home.png'),
  Lineage:            require('@/assets/focus/home.png'),
  // Self-care / Wellness
  Rest:               require('@/assets/focus/selfcare.png'),
  Health:             require('@/assets/focus/selfcare.png'),
  Body:               require('@/assets/focus/selfcare.png'),
  Routines:           require('@/assets/focus/selfcare.png'),
  Exercise:           require('@/assets/focus/selfcare.png'),
  Healing:            require('@/assets/focus/selfcare.png'),
  'Physical vitality':require('@/assets/focus/selfcare.png'),
};

const FALLBACK = require('@/assets/time-of-the-day/night.png');


interface Props {
  focusArea: DailyFocusArea;
  isLast?: boolean;
}

export function FocusAreaCard({ focusArea, isLast = false }: Props) {
  const image = IMAGES[focusArea.area] ?? FALLBACK;

  return (
    <View>
      <ImageBackground
        source={image}
        style={styles.imageBg}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)']}
          style={styles.imageGradient}
        >
          <View>
            <Text style={styles.areaLabel}>{focusArea.area}</Text>
            <Text style={styles.timeRange}>{focusArea.timeRange}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.body}>
        <Text style={styles.action}>{focusArea.action}</Text>
        <Text style={styles.suggestion}>{focusArea.suggestion}</Text>
        <VedicReasoningAccordion reasoning={focusArea.reasoning} />
      </View>

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

const styles = StyleSheet.create({
  imageBg: {
    alignSelf: 'stretch',
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 24,
  },
  imageGradient: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  emoji: {
    fontSize: 32,
  },
  areaLabel: {
    fontFamily: fonts.headlineExtra,
    fontSize: 24,
    color: '#fff',
    letterSpacing: -0.3,
    textAlign: 'right',
  },
  timeRange: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'right',
    marginTop: 2,
  },
  body: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(37,38,38,0.6)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  action: {
    fontFamily: fonts.headline,
    fontSize: 19,
    color: '#fff',
    letterSpacing: -0.3,
    lineHeight: 27,
  },
  suggestion: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 23,
  },

  // Connector
  connector: {
    alignItems: 'center',
    height: 36,
    gap: 4,
    paddingVertical: 4,
  },
  connectorLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  connectorDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
