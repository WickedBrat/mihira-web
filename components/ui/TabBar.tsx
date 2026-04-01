import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Home, MessageCircle, BookOpen, User, Clock } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';

const TAB_ICONS = {
  index: Home,
  'ask-krishna': MessageCircle,
  gurukul: BookOpen,
  muhurat: Clock,
  profile: User,
} as const;

const TAB_LABELS = {
  index: 'HOME',
  'ask-krishna': 'ASK',
  gurukul: 'GURUKUL',
  muhurat: 'MUHURAT',
  profile: 'PROFILE',
} as const;

type TabName = keyof typeof TAB_ICONS;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const tabs = state.routes.filter((r) => r.name in TAB_ICONS);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.overlay} />

        {tabs.map((route) => {
          const isFocused = state.routes[state.index].key === route.key;
          const tabName = route.name as TabName;
          const Icon = TAB_ICONS[tabName];
          const label = TAB_LABELS[tabName];

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                hapticLight();
                navigation.navigate(route.name);
              }}
              style={styles.tab}
            >
              <View style={styles.tabInner}>
                <Icon
                  size={20}
                  color={isFocused ? colors.primary : colors.outlineVariant}
                  strokeWidth={isFocused ? 2 : 1.5}
                />
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 32, 32, 0.7)',
  },
  tab: {
    flex: 1,
    minWidth: 0,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontFamily: fonts.label,
    fontSize: 7,
    letterSpacing: 0.8,
    color: colors.outlineVariant,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
