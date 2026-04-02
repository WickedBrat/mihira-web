// Screen 5: The Celestial Coordinates — Birth Data Input
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  TextInput, Switch, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

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
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const canProceed = birthPlace.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        {Array.from({ length: 11 }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= 3 && styles.dotActive]} />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.label}>STEP 5 OF 12</Text>
          <Text style={styles.headline}>Your celestial{'\n'}coordinates</Text>
          <Text style={styles.sub}>
            These details let Aksha calculate your exact cosmic signature, {name.split(' ')[0]}.
          </Text>
        </Animated.View>

        {/* Date */}
        <Animated.View entering={FadeInDown.delay(200).duration(450)} style={styles.field}>
          <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
              setShowTimePicker(false);
            }}
            style={[styles.fieldRow, showDatePicker && styles.fieldRowActive]}
          >
            <Text style={styles.fieldValue}>{fmt(birthDate)}</Text>
            <Text style={styles.fieldCaret}>›</Text>
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
              style={styles.picker}
            />
          )}
        </Animated.View>

        {/* Time */}
        <Animated.View entering={FadeInDown.delay(280).duration(450)} style={styles.field}>
          <Text style={styles.fieldLabel}>TIME OF BIRTH</Text>
          <Pressable
            onPress={() => {
              if (unknownTime) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTimePicker(true);
              setShowDatePicker(false);
            }}
            style={[
              styles.fieldRow,
              showTimePicker && styles.fieldRowActive,
              unknownTime && styles.fieldRowDisabled,
            ]}
          >
            <Text style={[styles.fieldValue, unknownTime && styles.fieldValueMuted]}>
              {unknownTime ? 'Unknown — Solar chart will be used' : fmtTime(birthTime)}
            </Text>
            {!unknownTime && <Text style={styles.fieldCaret}>›</Text>}
          </Pressable>
          {showTimePicker && !unknownTime && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={birthTime}
              onChange={(_, v) => {
                if (v) setBirthTime(v);
                if (Platform.OS === 'android') setShowTimePicker(false);
              }}
              style={styles.picker}
            />
          )}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>I don't know my exact time</Text>
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
        <Animated.View entering={FadeInDown.delay(360).duration(450)} style={styles.field}>
          <Text style={styles.fieldLabel}>PLACE OF BIRTH</Text>
          <View style={styles.fieldRow}>
            <TextInput
              style={styles.fieldInput}
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
        <Animated.View entering={FadeInDown.delay(440).duration(450)} style={styles.seal}>
          <Text style={styles.sealIcon}>🔒</Text>
          <Text style={styles.sealText}>
            Your birth data is encrypted and used only for your personal alignment. It is never shared.
          </Text>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.footer}>
        <Pressable
          onPress={proceed}
          style={({ pressed }) => [
            styles.btn,
            !canProceed && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.btnText}>Calculate My Chart →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: OB.bg },
  scroll:     { flex: 1 },
  progress:   { flexDirection: 'row', gap: 4, paddingHorizontal: 32, paddingTop: 16, paddingBottom: 4 },
  dot:        { flex: 1, height: 2, backgroundColor: OB.cardBorder, borderRadius: 1 },
  dotActive:  { backgroundColor: OB.saffron },
  body:       { padding: 32, paddingTop: 32, gap: 28 },
  header:     { gap: 10, marginBottom: 4 },
  label: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(10),
    letterSpacing: 2.5, color: OB.saffron, textTransform: 'uppercase',
  },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(36),
    color: OB.text, letterSpacing: -1, lineHeight: scaleFont(42),
  },
  sub: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(15),
    color: OB.muted, lineHeight: scaleFont(23),
  },
  field:      { gap: 8 },
  fieldLabel: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(10),
    letterSpacing: 2, color: OB.muted, textTransform: 'uppercase',
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 16,
    backgroundColor: OB.card, borderRadius: 12,
    borderWidth: 1, borderColor: OB.cardBorder,
  },
  fieldRowActive:   { borderColor: OB.goldBorder, backgroundColor: OB.goldDim },
  fieldRowDisabled: { opacity: 0.5 },
  fieldValue: {
    fontFamily: 'Lexend_500Medium', fontSize: scaleFont(16), color: OB.text,
  },
  fieldValueMuted: { color: OB.muted, fontSize: scaleFont(13) },
  fieldCaret: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(20), color: OB.muted,
  },
  fieldInput: {
    flex: 1,
    fontFamily: 'Lexend_500Medium', fontSize: scaleFont(16), color: OB.text,
  },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 4,
  },
  toggleLabel: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(13), color: OB.muted,
  },
  picker: { alignSelf: 'stretch' },
  seal: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: OB.card, borderRadius: 12,
    borderWidth: 1, borderColor: OB.cardBorder,
    padding: 14,
  },
  sealIcon: { fontSize: scaleFont(14), marginTop: 1 },
  sealText: {
    flex: 1, fontFamily: 'Lexend_400Regular',
    fontSize: scaleFont(12), color: OB.muted, lineHeight: scaleFont(18),
  },
  footer:     { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, paddingBottom: 44, backgroundColor: 'rgba(7,9,12,0.95)' },
  btn: {
    backgroundColor: OB.saffron, paddingVertical: 18, borderRadius: 9999,
    alignItems: 'center', shadowColor: OB.saffron,
    shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 4 },
  },
  btnDisabled: { opacity: 0.35 },
  btnPressed:  { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(16),
    color: '#fff', letterSpacing: 0.3,
  },
});
