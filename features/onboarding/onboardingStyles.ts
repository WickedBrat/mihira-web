import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { OB } from '@/lib/onboardingStore';

export const absoluteFillStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const onboardingButtonShadow: ViewStyle = {
  shadowColor: OB.saffron,
  shadowOpacity: 0.45,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 4 },
  elevation: 8,
};

export const pressedButtonStyle: ViewStyle = {
  opacity: 0.82,
  transform: [{ scale: 0.98 }],
};

export const pressedLogoButtonStyle: ViewStyle = {
  opacity: 0.82,
  transform: [{ scale: 0.97 }],
};

export const pressedSendButtonStyle: ViewStyle = {
  opacity: 0.75,
  transform: [{ scale: 0.94 }],
};

export const personaImageShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.45,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
} as ImageStyle;

export const goldGlowShadow: ViewStyle = {
  shadowColor: OB.gold,
  shadowOpacity: 0.6,
  shadowRadius: 80,
  shadowOffset: { width: 0, height: 0 },
};

export const dialGlowShadow: ViewStyle = {
  shadowColor: OB.gold,
  shadowOpacity: 0.4,
  shadowRadius: 60,
  shadowOffset: { width: 0, height: 0 },
};

export const hazeScaleStyle: ViewStyle = {
  transform: [{ scaleX: 1.5 }],
};

export const italicTextStyle: TextStyle = {
  fontStyle: 'italic',
};
