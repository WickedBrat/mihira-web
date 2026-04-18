// features/ask/NaradIntro.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';

interface NaradIntroProps {
  onEnter: () => void;
}

const TRUST_ICON_COLOR = '#FF8C00';

function SacredTextsIcon({ color = TRUST_ICON_COLOR }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 -960 960 960" fill="none">
      <Path
        fill={color}
        d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"
      />
    </Svg>
  );
}

function ModernLifeIcon({ color = TRUST_ICON_COLOR }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 -960 960 960" fill="none">
      <Path
        fill={color}
        d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"
      />
    </Svg>
  );
}

function PracticalStepsIcon({ color = TRUST_ICON_COLOR }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 -960 960 960" fill="none">
      <Path
        fill={color}
        d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"
      />
    </Svg>
  );
}

const TRUST_PILLARS = [
  { label: 'Grounded in sacred texts', Icon: SacredTextsIcon },
  { label: 'Interpreted for modern life', Icon: ModernLifeIcon },
  { label: 'Practical steps for today', Icon: PracticalStepsIcon },
];

export function NaradIntro({ onEnter }: NaradIntroProps) {
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(32);

  useEffect(() => {
    contentOpacity.value = withDelay(220, withTiming(1, { duration: 800 }));
    contentY.value = withDelay(
      220,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  return (
    <View className="flex-1">
      <View pointerEvents="none" className="absolute inset-0">
        <AmbientBlob color="rgba(212, 175, 55, 0.10)" top={-80} left={-60} size={360} />
        <AmbientBlob color="rgba(212, 190, 228, 0.08)" top={180} left={180} size={260} />
        <AmbientBlob color="rgba(255, 140, 0, 0.06)" top={470} left={40} size={260} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} className="flex-1 justify-center px-7">
        <Animated.View className="w-full" style={contentStyle}>
          <View className="self-center rounded-full border border-[rgba(212,175,55,0.22)] bg-[rgba(242,206,173,0.12)] px-4 py-2">
            <Text className="font-label text-[11px] uppercase tracking-[1.8px] text-[rgb(150,110,10)]">
              Scripture Grounded Guidance
            </Text>
          </View>

          <Text className="mt-6 text-center font-headline-extra text-[42px] leading-[48px] tracking-[-1px] text-on-surface">
            Bring a life question.
          </Text>
          <Text className="mt-3 text-center font-body text-base leading-7 text-on-surface-variant">
            Aksha responds with scripture-backed guidance, grounded interpretation, and one clear
            practice you can use today.
          </Text>

          <View className="mt-8 gap-3 text-center">
            {TRUST_PILLARS.map(({ label, Icon }) => (
              <View
                key={label}
                className="rounded-[22px] border w-[240px] mx-auto border-black/[0.06] bg-black/[0.03] px-5 py-4 dark:border-white/[0.06] dark:bg-white/[0.04]"
              >
                <View className="flex-row items-center justify-around gap-3">
                  <Icon color={TRUST_ICON_COLOR} />
                  <Text className="font-body-medium text-center text-on-surface">{label}</Text>
                </View>
              </View>
            ))}
          </View>

          <SacredButton label="Begin with a question" onPress={onEnter} className="mt-8" />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
