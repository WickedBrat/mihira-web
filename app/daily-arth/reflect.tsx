import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Feather, Flame, Sparkles } from 'lucide-react-native';
import { ConstellationLoader } from '@/components/ui/ConstellationLoader';
import { Text } from '@/components/ui/Text';
import { getDailyArthReflection } from '@/lib/dailyArthReflectionClient';
import { saveCachedDailyArthReflection } from '@/lib/dailyArthReflectionStorage';
import { hapticLight } from '@/lib/haptics';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import type { DailyArthReflection } from '@/features/daily/reflectionTypes';
import { isDailyArthReflection } from '@/features/daily/reflectionTypes';

const fallbackQuote = '"You have a right to your actions, but never to their fruits."';
const fallbackSource = 'Bhagavad Gita';

function getParamValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function cleanQuote(value: string) {
  return value.trim().replace(/^["']|["']$/g, '');
}

function parseInitialReflection(value: string | string[] | undefined): DailyArthReflection | null {
  const raw = getParamValue(value, '');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isDailyArthReflection(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function ReflectionSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View
      className="gap-4 rounded-[24px] border p-5"
      style={{
        backgroundColor: `${colors.surfaceContainerHigh}AA`,
        borderColor: `${colors.outlineVariant}55`,
      }}
    >
      <View className="flex-row items-center gap-2.5">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.secondaryFixed}20` }}
        >
          {icon}
        </View>
        <Text className="font-label text-xs uppercase tracking-[2px] text-secondary-fixed">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function DailyArthReflectScreen() {
  const params = useLocalSearchParams<{ quoteId?: string; quote?: string; source?: string; reflection?: string }>();
  const { colors } = useTheme();
  const quoteId = Number(getParamValue(params.quoteId, '0'));
  const quote = cleanQuote(getParamValue(params.quote, fallbackQuote));
  const source = getParamValue(params.source, fallbackSource);
  const initialReflection = useMemo(() => parseInitialReflection(params.reflection), [params.reflection]);
  const [reflection, setReflection] = useState<DailyArthReflection | null>(initialReflection);
  const [isLoading, setIsLoading] = useState(!initialReflection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadReflection() {
      if (initialReflection) {
        setReflection(initialReflection);
        setIsLoading(false);
        if (quoteId > 0) {
          await saveCachedDailyArthReflection(quoteId, initialReflection);
        }
        return;
      }

      if (!quoteId || quoteId <= 0) {
        setError('Reflection is unavailable for this quote.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextReflection = await getDailyArthReflection({ quoteId, quote, source });
        if (!isCancelled) setReflection(nextReflection);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Reflection unavailable');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void loadReflection();

    return () => {
      isCancelled = true;
    };
  }, [initialReflection, quote, quoteId, source]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <LinearGradient
        colors={[`${colors.primary}18`, 'transparent', `${colors.secondaryFixed}12`]}
        locations={[0, 0.48, 1]}
        className="absolute inset-0"
      />

      <View className="flex-row items-center justify-between pb-3 pt-2" style={{ paddingHorizontal: layout.screenPaddingX }}>
        <Pressable
          onPress={() => { hapticLight(); router.back(); }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full border"
          style={({ pressed }) => [
            {
              backgroundColor: `${colors.surfaceContainerHigh}CC`,
              borderColor: `${colors.outlineVariant}66`,
            },
            pressed && { opacity: 0.72 },
          ]}
        >
          <ArrowLeft size={18} color={colors.onSurface} />
        </Pressable>

        <View className="flex-row items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: `${colors.primary}14` }}>
          <Sparkles size={12} color={colors.primary} />
          <Text className="font-label text-[11px] uppercase tracking-[1.8px] text-primary">Daily Arth</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: layout.screenPaddingX, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-8 pt-7">
          <Text className="mb-3 font-label text-xs uppercase tracking-[3px] text-secondary-fixed">Reflect</Text>
          <Text className="font-headline-extra text-[40px] leading-[44px] text-on-surface">
            Carry this into today
          </Text>
        </View>

        <View
          className="mb-6 overflow-hidden rounded-[28px] border p-6"
          style={{
            backgroundColor: `${colors.surfaceBrightGlass}`,
            borderColor: `${colors.outlineVariant}66`,
          }}
        >
          <Feather size={24} color={colors.primary} style={{ marginBottom: 18 }} />
          <Text className="font-headline text-[28px] leading-[34px] text-on-surface">
            "{quote}"
          </Text>
          <Text className="mt-5 font-label text-[11px] uppercase tracking-[2.4px] text-on-surface-variant">
            The {source}
          </Text>
        </View>

        <View className="gap-4">
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ConstellationLoader size={150} message="Preparing your reflection..." />
            </View>
          ) : error ? (
            <ReflectionSection
              icon={<Flame size={17} color={colors.secondaryFixed} />}
              title="Reflection unavailable"
            >
              <Text className="font-body text-base leading-7 text-on-surface-variant">{error}</Text>
            </ReflectionSection>
          ) : reflection ? (
            <>
              <ReflectionSection
                icon={<Flame size={17} color={colors.secondaryFixed} />}
                title="What it means"
              >
                <Text className="mb-3 font-body-medium text-base leading-6 text-on-surface">
                  {reflection.summary}
                </Text>
                <Text className="font-body text-base leading-7 text-on-surface-variant">
                  {reflection.explanation}
                </Text>
              </ReflectionSection>

              <ReflectionSection
                icon={<CheckCircle2 size={17} color={colors.secondaryFixed} />}
                title="Use it today"
              >
                <View className="gap-3.5">
                  {reflection.dailyPractice.map((item, index) => (
                    <View key={item} className="flex-row gap-3">
                      <Text className="mt-0.5 font-label text-sm text-secondary-fixed">{index + 1}</Text>
                      <Text className="flex-1 font-body text-[15px] leading-6 text-on-surface-variant">{item}</Text>
                    </View>
                  ))}
                </View>
              </ReflectionSection>

              <ReflectionSection
                icon={<Sparkles size={17} color={colors.secondaryFixed} />}
                title="Questions"
              >
                <View className="gap-3">
                  {reflection.reflectionPrompts.map((prompt) => (
                    <View key={prompt} className="rounded-2xl px-4 py-3" style={{ backgroundColor: `${colors.surfaceContainerHighest}88` }}>
                      <Text className="font-body-medium text-[15px] leading-6 text-on-surface">{prompt}</Text>
                    </View>
                  ))}
                </View>
              </ReflectionSection>

              <ReflectionSection
                icon={<Feather size={17} color={colors.secondaryFixed} />}
                title="Carry it"
              >
                <Text className="font-headline text-[26px] leading-8 text-on-surface">
                  {reflection.mantra}
                </Text>
              </ReflectionSection>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
