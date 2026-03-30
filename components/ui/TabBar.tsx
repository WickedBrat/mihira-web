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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Home, Telescope, BookOpen, User } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts, gradients } from '@/lib/theme';

const TAB_ICONS = {
  index: Home,
  horoscope: Telescope,
  gurukul: BookOpen,
  profile: User,
} as const;

const TAB_LABELS = {
  index: 'HOME',
  horoscope: 'COSMOS',
  gurukul: 'GURUKUL',
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

        {tabs.map((route, index) => {
          const isFocused = state.index === index;
          const tabName = route.name as TabName;
          const Icon = TAB_ICONS[tabName];
          const label = TAB_LABELS[tabName];

          const showFab = tabName === 'gurukul';

          return (
            <React.Fragment key={route.key}>
              {showFab && (
                <Pressable
                  key="ask-krishna-fab"
                  onPress={() => {
                    hapticLight();
                    router.push('/ask-krishna');
                  }}
                  style={styles.fabWrapper}
                >
                  <LinearGradient
                    colors={gradients.primaryToContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fab}
                  >
                    <Text style={styles.fabIcon}>✿</Text>
                  </LinearGradient>
                </Pressable>
              )}
              <Pressable
                onPress={() => {
                  hapticLight();
                  navigation.navigate(route.name);
                }}
                style={styles.tab}
              >
                <Icon
                  size={20}
                  color={isFocused ? colors.primary : colors.outlineVariant}
                  strokeWidth={isFocused ? 2 : 1.5}
                />
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            </React.Fragment>
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
  fabWrapper: {
    marginTop: -14,
    borderRadius: 9999,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 20,
    color: colors.onPrimary,
  },
});
