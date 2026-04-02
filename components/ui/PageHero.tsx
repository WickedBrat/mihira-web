import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

interface PageHeroProps {
  meta?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  style?: ViewStyle;
  metaStyle?: TextStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  subtitleMaxWidth?: number;
}

export function PageHero({
  meta,
  title,
  subtitle,
  style,
  metaStyle,
  titleStyle,
  subtitleStyle,
  subtitleMaxWidth = 340,
}: PageHeroProps) {
  return (
    <View style={[styles.container, style]}>
      {meta ? <Text style={[styles.meta, metaStyle]}>{meta}</Text> : null}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle, { maxWidth: subtitleMaxWidth }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
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
    fontSize: scaleFont(42),
    color: colors.onSurface,
    letterSpacing: -1,
    lineHeight: scaleFont(46),
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
