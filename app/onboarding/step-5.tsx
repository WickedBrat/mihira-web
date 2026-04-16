// Screen 5: The Celestial Coordinates — Birth Data Input
import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView,
  TextInput, Switch, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

export default function Screen5() {
  const stored = getOnboardingData();
  const [birthDate,       setBirthDate]       = useState(stored.birthDate);
  const [birthTime,       setBirthTime]       = useState(stored.birthTime);
  const [birthPlace,      setBirthPlace]      = useState(stored.birthPlace);
  const [unknownTime,     setUnknownTime]     = useState(stored.unknownBirthTime);
  const [showDatePicker,  setShowDatePicker]  = useState(false);
  const [showTimePicker,  setShowTimePicker]  = useState(false);

  const name = stored.userName || 'you';

  function proceed() {
    const place = birthPlace.trim();
    if (!place) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ birthDate, birthTime, birthPlace: place, unknownBirthTime: unknownTime });
    router.push('/onboarding/step-6');
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const canProceed = birthPlace.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 p-8 pt-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(500)} className="mb-1 gap-2.5">
          <Text className="font-headline text-[36px] leading-[42px] tracking-[-1px] text-ob-text">
            Your celestial{'\n'}coordinates
          </Text>
          <Text className="font-body text-[15px] leading-[23px] text-ob-muted">
            These details let Aksha calculate your exact cosmic signature, {name.split(' ')[0]}.
          </Text>
        </Animated.View>

        {/* Date */}
        <Animated.View entering={FadeInDown.delay(200).duration(450)} className="gap-2">
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-ob-muted">
            DATE OF BIRTH
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
              setShowTimePicker(false);
            }}
            className={`flex-row items-center justify-between rounded-xl border px-[18px] py-4 ${
              showDatePicker
                ? 'border-ob-gold-border bg-ob-gold-dim'
                : 'border-ob-card-border bg-ob-card'
            }`}
          >
            <Text className="font-body-medium text-base text-ob-text">{fmt(birthDate)}</Text>
            <Text className="font-body text-xl text-ob-muted">›</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={birthDate}
              maximumDate={new Date()}
              onChange={(_, v) => {
                if (v) setBirthDate(v);
                if (Platform.OS === 'android') setShowDatePicker(false);
              }}
              style={{ alignSelf: 'stretch' }}
            />
          )}
        </Animated.View>

        {/* Time */}
        <Animated.View entering={FadeInDown.delay(280).duration(450)} className="gap-2">
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-ob-muted">
            TIME OF BIRTH
          </Text>
          <Pressable
            onPress={() => {
              if (unknownTime) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTimePicker(true);
              setShowDatePicker(false);
            }}
            className={`flex-row items-center justify-between rounded-xl border px-[18px] py-4 ${
              showTimePicker
                ? 'border-ob-gold-border bg-ob-gold-dim'
                : 'border-ob-card-border bg-ob-card'
            } ${unknownTime ? 'opacity-50' : ''}`}
          >
            <Text className={`font-body-medium text-base ${unknownTime ? 'text-sm text-ob-muted' : 'text-ob-text'}`}>
              {unknownTime ? 'Unknown — Solar chart will be used' : fmtTime(birthTime)}
            </Text>
            {!unknownTime && <Text className="font-body text-xl text-ob-muted">›</Text>}
          </Pressable>
          {showTimePicker && !unknownTime && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={birthTime}
              locale="en-US"
              onChange={(_, v) => {
                if (v) setBirthTime(v);
                if (Platform.OS === 'android') setShowTimePicker(false);
              }}
              style={{ alignSelf: 'stretch' }}
            />
          )}
          <View className="flex-row items-center justify-between pt-1">
            <Text className="font-body text-sm text-ob-muted">I don't know my exact time</Text>
            <Switch
              value={unknownTime}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setUnknownTime(v);
                if (v) setShowTimePicker(false);
              }}
              trackColor={{ false: OB.cardBorder, true: OB.saffron }}
              thumbColor="#fff"
            />
          </View>
        </Animated.View>

        {/* Place */}
        <Animated.View entering={FadeInDown.delay(360).duration(450)} className="gap-2">
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-ob-muted">
            PLACE OF BIRTH
          </Text>
          <View className="flex-row items-center justify-between rounded-xl border border-ob-card-border bg-ob-card px-[18px] py-4">
            <TextInput
              className="flex-1 font-body-medium text-base text-ob-text"
              value={birthPlace}
              onChangeText={setBirthPlace}
              placeholder="City, Country…"
              placeholderTextColor={OB.muted}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
        </Animated.View>

        {/* Privacy seal */}
        <Animated.View
          entering={FadeInDown.delay(440).duration(450)}
          className="flex-row items-start gap-2.5 rounded-xl border border-ob-card-border bg-ob-card p-3.5"
        >
          <Text className="mt-px text-sm">🔒</Text>
          <Text className="flex-1 font-body text-xs leading-[18px] text-ob-muted">
            Your birth data is encrypted and used only for your personal alignment. It is never shared.
          </Text>
        </Animated.View>

        <View className="h-[120px]" />
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(700).duration(500)}
        className="absolute bottom-0 left-0 right-0 items-end bg-[rgba(7,9,12,0.95)] p-8 pb-11"
      >
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            !canProceed ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">
            Calculate My Chart →
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
