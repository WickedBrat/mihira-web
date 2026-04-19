import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import type { DailyFocusArea } from '@/lib/dailyAlignmentTypes';

const BASE = 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/daily-prediction';
const img = (filename: string) => ({ uri: `${BASE}/${filename}.jpg` });

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

  return (
    <View>
      <ImageBackground
        source={image}
        className="h-[140px] self-stretch overflow-hidden rounded-3xl"
        imageStyle={{ borderRadius: 24 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)']}
          style={styles.imageOverlay}
        >
          <View style={styles.imageTextBlock}>
            <Text className="text-right font-headline-extra text-2xl tracking-[-0.3px] text-white">{focusArea.area}</Text>
            <Text className="mt-0.5 text-right font-body text-sm text-white/55">{focusArea.timeRange}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View className="mt-2.5 gap-2.5 self-stretch rounded-[20px] border border-black/[0.06] bg-[rgba(232,225,212,0.6)] p-5 dark:border-white/[0.05] dark:bg-[rgba(37,38,38,0.6)]">
        <Text className="font-headline text-xl leading-[27px] tracking-[-0.3px] text-white">{focusArea.action}</Text>
        <Text className="font-body text-base leading-[23px] text-white/65">{focusArea.suggestion}</Text>
        <VedicReasoningAccordion reasoning={focusArea.reasoning} />
      </View>

      {!isLast && (
        <View className="h-9 items-center gap-1 py-1">
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/10" />
          <View className="h-[5px] w-[5px] rounded-full bg-black/15 dark:bg-white/20" />
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/10" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  imageTextBlock: {
    alignItems: 'flex-end',
  },
});
