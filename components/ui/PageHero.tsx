import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';

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
  meta, title, subtitle, style, metaStyle, titleStyle, subtitleStyle, subtitleMaxWidth = 340,
}: PageHeroProps) {
  return (
    <View className="self-stretch items-center pt-7 pb-10" style={style}>
      {meta ? (
        <Text
          className="font-label text-xs uppercase tracking-[3px] text-secondary-fixed mb-3 text-center"
          style={metaStyle}
        >
          {meta}
        </Text>
      ) : null}
      <Text
        className="font-headline-extra text-[42px] text-on-surface tracking-[-1px] leading-[46px] mb-2 text-center"
        style={titleStyle}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="font-body text-base leading-6 text-on-surface-variant text-center"
          style={[subtitleStyle, { maxWidth: subtitleMaxWidth }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
