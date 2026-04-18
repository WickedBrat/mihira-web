import React, { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { DailyIcon } from '@/components/ui/DailyIcon';
import { GuidanceIcon } from '@/components/ui/GuidanceIcon';
import { MuhuratIcon } from '@/components/ui/MuhuratIcon';
import { GurukulIcon } from '@/components/ui/GurukulIcon';
import { ProfileIcon } from '@/components/ui/ProfileIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

type TabName = 'index' | 'ask' | 'gurukul' | 'muhurat' | 'profile';
type IconRenderer = (options: { color: string; isFocused: boolean }) => React.ReactNode;
type TabConfig = {
  iconOffsetY?: number;
  label: string;
  renderIcon: IconRenderer;
};

const BAR_PADDING = 4;
const SELECTOR_HORIZONTAL_INSET = 0;
const SELECTOR_VERTICAL_INSET = 5;
const ACCENT_ICON_COLOR = '#ff9500';
const TAB_HORIZONTAL_PADDING = 6;
const TAB_CONTENT_TOP_PADDING = 6;
const TAB_CONTENT_BOTTOM_PADDING = 8;
const ICON_RAIL_HEIGHT = 26;
const LABEL_RAIL_HEIGHT = 12;
const ICON_LABEL_GAP = 4;
const SPRING = {
  damping: 22,
  stiffness: 240,
  mass: 0.85,
};

const barShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
};

const selectorShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
};

const TAB_CONFIG: Record<TabName, TabConfig> = {
  index: {
    iconOffsetY: 0,
    label: 'Daily',
    renderIcon: ({ color }) => (
      <DailyIcon size={20} color={color} />
    ),
  },
  ask: {
    iconOffsetY: -0.5,
    label: 'Guidance',
    renderIcon: ({ color }) => (
      <GuidanceIcon size={26} color={color} />
    ),
  },
  gurukul: {
    iconOffsetY: 0,
    label: 'Gurukul',
    renderIcon: ({ color }) => (
      <GurukulIcon size={34} color={color} />
    ),
  },
  muhurat: {
    iconOffsetY: -0.5,
    label: 'Sacred Timing',
    renderIcon: ({ color }) => <MuhuratIcon size={32} color={color} />,
  },
  profile: {
    iconOffsetY: 0,
    label: 'You',
    renderIcon: ({ color }) => (
      <ProfileIcon size={20} color={color} />
    ),
  },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);
  const { colors, isDark } = useTheme();

  const tabs = state.routes.filter(
    (route): route is typeof route & { name: TabName } => route.name in TAB_CONFIG,
  );
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

  const inactiveIconColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)';

  return (
    <View pointerEvents="box-none" className="absolute left-0 right-0 z-[100] items-center" style={{ bottom: 10 }}>
      <View
        className="w-[95%] max-w-[620px] min-h-[76px] overflow-hidden rounded-full border border-black/[0.08] bg-[rgba(250,247,242,0.10)] p-1 dark:border-white/[0.08] dark:bg-[rgba(18,18,22,0.10)]"
        style={barShadow}
        onLayout={handleLayout}
      >
        <BlurView intensity={36} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
        <View className="absolute inset-0 bg-black/[0.015] dark:bg-white/[0.015]" />

        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            className="absolute overflow-hidden rounded-[30px] border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.035]"
            style={[
              selectorShadow,
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
            <View className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02]" />
          </Animated.View>
        ) : null}

        <View className="flex-1 flex-row px-1">
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabConfig = TAB_CONFIG[route.name];
            const iconColor = isFocused
              ? ACCENT_ICON_COLOR
              : isFocused
                ? colors.onSurface
                : inactiveIconColor;

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
                className="z-[1] min-w-0 flex-1 items-center justify-center"
                style={({ pressed }) => pressed && { opacity: 0.84 }}
              >
                <View
                  className="w-full flex-1 items-center justify-center"
                  style={{
                    paddingBottom: TAB_CONTENT_BOTTOM_PADDING,
                    paddingHorizontal: TAB_HORIZONTAL_PADDING,
                    paddingTop: TAB_CONTENT_TOP_PADDING,
                  }}
                >
                  <View
                    className="w-full items-center justify-center"
                    style={{ height: ICON_RAIL_HEIGHT }}
                  >
                    <View style={{ transform: [{ translateY: tabConfig.iconOffsetY ?? 0 }] }}>
                      {tabConfig.renderIcon({ color: iconColor, isFocused })}
                    </View>
                  </View>
                  <View
                    className="w-full items-center justify-center"
                    style={{ height: LABEL_RAIL_HEIGHT, marginTop: ICON_LABEL_GAP }}
                  >
                    <Text
                      className={`text-center font-label text-[10px] leading-3 tracking-[0.2px] ${
                        isFocused
                          ? 'text-on-surface'
                          : 'text-black/[0.35] dark:text-white/40'
                      }`}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {tabConfig.label}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
