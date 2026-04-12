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
import { fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { useGuide } from '@/lib/guideStore';
import { useTheme, useThemedStyles } from '@/lib/theme-context';

const TAB_ICONS = {
  index: Home,
  ask: MessageCircle,
  gurukul: BookOpen,
  muhurat: Clock,
  profile: User,
} as const;

type TabName = keyof typeof TAB_ICONS;

const STATIC_LABELS: Record<TabName, string> = {
  index: 'Home',
  ask: 'Ask',
  gurukul: 'Gurukul',
  muhurat: 'Muhurat',
  profile: 'You',
};

const BAR_PADDING = 4;
const BAR_HEIGHT = 74;
const SELECTOR_HORIZONTAL_INSET = 0;
const SELECTOR_VERTICAL_INSET = 5;
const SPRING = {
  damping: 22,
  stiffness: 240,
  mass: 0.85,
};

const staticStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);
  const { guide } = useGuide();
  const { isDark } = useTheme();

  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        width: '95%',
        maxWidth: 620,
        minHeight: BAR_HEIGHT,
        borderRadius: 9999,
        overflow: 'hidden',
        padding: BAR_PADDING,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(18, 18, 22, 0.10)' : 'rgba(250, 247, 242, 0.10)',
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
      },
      containerTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
      },
      selector: {
        position: 'absolute',
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.04)',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      selectorTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      },
      tabLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        lineHeight: scaleFont(12),
        color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
        letterSpacing: 0.2,
        textAlign: 'center',
      },
      tabLabelActive: {
        color: colors.onSurface,
      },
    })
  );

  const tabs = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeRouteKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    tabs.findIndex((route) => route.key === activeRouteKey),
    0
  );
  const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / tabs.length : 0;
  const selectorWidth =
    slotWidth > 0 ? Math.max(0, slotWidth - 4) : 0;

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

  const getLabel = (tabName: TabName): string => {
    if (tabName === 'ask' && guide) return `Ask ${guide}`;
    return STATIC_LABELS[tabName];
  };

  const inactiveIconColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)';

  return (
    <View pointerEvents="box-none" style={[staticStyles.wrapper, { bottom: 10 }]}>
      <View style={styles.container} onLayout={handleLayout}>
        <BlurView intensity={36} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.containerTint} />

        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selector,
              {
                width: selectorWidth,
                left: BAR_PADDING,
                right: BAR_PADDING,
                top: SELECTOR_VERTICAL_INSET,
                bottom: SELECTOR_VERTICAL_INSET,
              },
              selectorStyle,
            ]}
          >
            <View style={styles.selectorTint} />
          </Animated.View>
        ) : null}

        <View style={staticStyles.row}>
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabName = route.name as TabName;
            const Icon = TAB_ICONS[tabName];
            const label = getLabel(tabName);
            const iconColor = isFocused ? styles.tabLabelActive.color : inactiveIconColor;

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
                style={({ pressed }) => [staticStyles.tab, pressed && staticStyles.tabPressed]}
              >
                <View style={staticStyles.tabContent}>
                  <Icon
                    size={isFocused ? 21 : 20}
                    color={iconColor}
                    fill={iconColor}
                    strokeWidth={isFocused ? 2.15 : 1.7}
                  />
                  <Text
                    style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
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
