import type { ViewStyle } from 'react-native';

export const OBN_GOLD = '#E8A33D';

export const obnButtonShadow: ViewStyle = {
  shadowColor: OBN_GOLD,
  shadowOpacity: 0.35,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
};

export const obnPressedStyle: ViewStyle = {
  opacity: 0.85,
  transform: [{ scale: 0.98 }],
};

export const obnGlowShadow: ViewStyle = {
  shadowColor: OBN_GOLD,
  shadowOpacity: 0.5,
  shadowRadius: 60,
  shadowOffset: { width: 0, height: 0 },
};
