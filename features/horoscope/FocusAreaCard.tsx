import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import type { DailyFocusArea } from '@/lib/dailyAlignmentStorage';

const BASE = 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/daily-prediction';
const img = (filename: string) => ({ uri: `${BASE}/${filename}.webp` });

const IMAGES: Record<string, { uri: string }> = {
  // Ambition / Career
  Ambition:               img('ambition'),
  Work:                   img('ambition'),
  Career:                 img('ambition'),
  'Public presence':      img('public-presence'),
  'Public Presence':      img('public-presence'),
  Networking:             img('networking'),
  Community:              img('community'),

  // Mind / Knowledge
  Knowledge:              img('knowledge'),
  Learning:               img('knowledge'),
  Reading:                img('reading'),
  Writing:                img('writing'),
  Speaking:               img('speaking'),
  'Problem solving':      img('problem-solving'),
  'Problem Solving':      img('problem-solving'),
  Focus:                  img('focus'),

  // Decisions / Finance
  Decisions:              img('decision'),
  Decision:               img('decision'),
  'Material decisions':   img('material-decision'),
  'Material Decisions':   img('material-decision'),
  Financial:              img('financial'),
  Money:                  img('money'),
  Negotiations:           img('negotiations'),
  Correspondence:         img('correspondence'),

  // Relationships
  Romance:                img('romance'),
  Partnership:            img('romance'),
  'Social bonds':         img('social-bonds'),
  'Social Bonds':         img('social-bonds'),

  // Family / Home
  Home:                   img('domestic'),
  'Domestic matters':     img('domestic'),
  'Domestic Matters':     img('domestic'),
  Domestic:               img('domestic'),
  Lineage:                img('lineage'),

  // Self-care / Wellness
  Rest:                   img('rest'),
  Health:                 img('health'),
  Body:                   img('body'),
  Routines:               img('routine'),
  Routine:                img('routine'),
  Exercise:               img('exercise'),
  Healing:                img('healing'),
  'Physical vitality':    img('physical-vitality'),
  'Physical Vitality':    img('physical-vitality'),
  Movement:               img('movement'),
  Meditation:             img('meditation'),

  // Creativity / Spirit
  Art:                    img('art'),
  Making:                 img('making'),
  Ritual:                 img('ritual'),
};

const FALLBACK = img('focus');

interface Props {
  focusArea: DailyFocusArea;
  isLast?: boolean;
}

export function FocusAreaCard({ focusArea, isLast = false }: Props) {
  const image = IMAGES[focusArea.area] ?? FALLBACK;
  const styles = useThemedStyles((_c, _glass, _gradients, dark) =>
    StyleSheet.create({
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
        backgroundColor: dark ? 'rgba(37,38,38,0.6)' : 'rgba(232,225,212,0.6)',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
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
      connector: {
        alignItems: 'center',
        height: 36,
        gap: 4,
        paddingVertical: 4,
      },
      connectorLine: {
        flex: 1,
        width: 1.5,
        backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      },
      connectorDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
      },
    })
  );

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
