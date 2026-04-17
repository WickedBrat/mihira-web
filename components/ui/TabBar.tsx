import React, { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  Home,
  MessageCircle,
  User,
} from 'lucide-react-native';
import { MuhuratIcon } from '@/components/ui/MuhuratIcon';
import { GurukulIcon } from '@/components/ui/GurukulIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

const TAB_ICONS = {
  index: Home,
  ask: MessageCircle,
  gurukul: GurukulIcon,
  muhurat: MuhuratIcon,
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

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const selectorX = useSharedValue(0);
  const { colors, isDark } = useTheme();

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

  const inactiveIconColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)';

  return (
    <View pointerEvents="box-none" className="absolute left-0 right-0 z-[100] items-center" style={{ bottom: 10 }}>
      <View
        className="w-[95%] max-w-[620px] min-h-[74px] overflow-hidden rounded-full border border-black/[0.08] bg-[rgba(250,247,242,0.10)] p-1 dark:border-white/[0.08] dark:bg-[rgba(18,18,22,0.10)]"
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

        <View className="flex-1 flex-row justify-around">
          {tabs.map((route) => {
            const isFocused = route.key === activeRouteKey;
            const tabName = route.name as TabName;
            const Icon = TAB_ICONS[tabName];
            const label = STATIC_LABELS[tabName];
            const iconColor = (tabName === 'gurukul' || tabName === 'muhurat') && isFocused
              ? '#ff9500'
              : isFocused ? colors.onSurface : inactiveIconColor;

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
                <View className="w-full flex-1 items-center justify-center gap-0.5 px-1 py-1">
                  {tabName === 'muhurat' ? (
                    <MuhuratIcon
                      size={isFocused ? 34 : 34}
                      color={iconColor as string}
                    />
                  ) : tabName === 'gurukul' ? (
                    <GurukulIcon
                      size={isFocused ? 38 : 36}
                      color={iconColor as string}
                    />
                  ) : (
                    <Icon
                      size={isFocused ? 21 : 20}
                      color={iconColor}
                      fill={iconColor}
                      strokeWidth={isFocused ? 2.15 : 1.7}
                    />
                  )}
                  <Text
                    className={`text-center font-label text-[10px] leading-3 tracking-[0.2px] ${
                      isFocused
                        ? 'text-on-surface'
                        : 'text-black/[0.35] dark:text-white/40'
                    }`}
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
