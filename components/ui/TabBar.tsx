import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  BookOpen,
  Clock,
  Home,
  MessageCircle,
  User,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticLight } from '@/lib/haptics';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

const TAB_ICONS = {
  index: Home,
  'ask-krishna': MessageCircle,
  gurukul: BookOpen,
  muhurat: Clock,
  profile: User,
} as const;

const TAB_LABELS = {
  index: 'Home',
  'ask-krishna': 'Ask',
  gurukul: 'Gurukul',
  muhurat: 'Muhurat',
  profile: 'You',
} as const;

type TabName = keyof typeof TAB_ICONS;

const BAR_PADDING = 4;
const BAR_HEIGHT = 74;
const SELECTOR_HORIZONTAL_INSET = 8;
const SELECTOR_VERTICAL_INSET = 8;
const SPRING = {
  damping: 22,
  stiffness: 240,
  mass: 0.85,
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);

  const tabs = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeRouteKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    tabs.findIndex((route) => route.key === activeRouteKey),
    0
  );
  const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / tabs.length : 0;
  const selectorWidth =
    slotWidth > 0 ? Math.max(0, slotWidth - SELECTOR_HORIZONTAL_INSET * 2) : 0;

  useEffect(() => {
    if (!slotWidth) return;
    selectorX.value = withSpring(activeIndex * slotWidth + SELECTOR_HORIZONTAL_INSET, SPRING);
  }, [activeIndex, selectorX, slotWidth]);

  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectorX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: 20 }]}>
      <View style={styles.container} onLayout={handleLayout}>
        <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.containerTint} />

        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selector,
              {
                width: selectorWidth,
                left: BAR_PADDING,
                top: SELECTOR_VERTICAL_INSET,
                bottom: SELECTOR_VERTICAL_INSET,
              },
              selectorStyle,
            ]}
          >
            <View style={styles.selectorTint} />
          </Animated.View>
        ) : null}

        <View style={styles.row}>
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabName = route.name as TabName;
            const Icon = TAB_ICONS[tabName];
            const label = TAB_LABELS[tabName];

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                key={route.key}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                onPress={() => {
                  hapticLight();
                  const event = navigation.emit({
                    canPreventDefault: true,
                    target: route.key,
                    type: 'tabPress',
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
              >
                <View style={styles.tabContent}>
                  <Icon
                    size={isFocused ? 21 : 20}
                    color={isFocused ? colors.secondaryFixed : 'rgba(255,255,255,0.40)'}
                    fill={isFocused ? colors.secondaryFixed : 'rgba(255,255,255,0.40)'}
                    strokeWidth={isFocused ? 2.15 : 1.7}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    width: '95%',
    maxWidth: 620,
    minHeight: BAR_HEIGHT,
    borderRadius: 9999,
    overflow: 'hidden',
    padding: BAR_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(18, 18, 22, 0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  containerTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  selector: {
    position: 'absolute',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  selectorTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    width: '100%',
  },
  tab: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressed: {
    opacity: 0.84,
  },
  tabContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    lineHeight: scaleFont(12),
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.onSurface,
  },
});
