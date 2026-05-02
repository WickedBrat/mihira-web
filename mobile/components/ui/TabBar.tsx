import React, { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppBlurView } from '@/components/ui/AppBlurView';
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
const SELECTOR_VERTICAL_INSET = 7;
const TAB_HORIZONTAL_PADDING = 4;
const TAB_CONTENT_TOP_PADDING = 5;
const TAB_CONTENT_BOTTOM_PADDING = 6;
const ICON_RAIL_HEIGHT = 24;
const LABEL_RAIL_HEIGHT = 13;
const ICON_LABEL_GAP = 3;
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
    slotWidth > 0 ? Math.max(0, slotWidth - 12) : 0;

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

  const inactiveIconColor = isDark ? 'rgba(255,247,237,0.62)' : 'rgba(26,20,16,0.58)';

  return (
    <View pointerEvents="box-none" className="absolute left-0 right-0 z-[100] items-center" style={{ bottom: 10 }}>
      <View
        className="w-[94%] max-w-[600px] min-h-[72px] overflow-hidden rounded-full border border-black/[0.10] bg-[rgba(250,247,242,0.14)] p-1 dark:border-white/[0.10] dark:bg-[rgba(18,18,22,0.16)]"
        style={barShadow}
        onLayout={handleLayout}
      >
        <AppBlurView intensity={58} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
        <View className="absolute inset-0 bg-black/[0.015] dark:bg-white/[0.015]" />

        {selectorWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            className="absolute overflow-hidden rounded-[26px] border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.035]"
            style={[
              selectorShadow,
              {
                width: selectorWidth,
                left: BAR_PADDING + 6,
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
              ? colors.secondaryFixed
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
                className="z-[1] min-h-[58px] min-w-0 flex-1 items-center justify-center"
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
                      className={`text-center font-label text-[10px] leading-[12px] tracking-[0.1px] ${
                        isFocused
                          ? 'text-secondary-fixed'
                          : 'text-white/30 dark:text-white/62'
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
