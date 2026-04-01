// app/(tabs)/muhurat.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { MuhuratCard } from '@/features/muhurat/MuhuratCard';
import { useMuhurat } from '@/features/muhurat/useMuhurat';
import { colors, fonts } from '@/lib/theme';

const EVENT_TYPES = ['Business', 'Travel', 'Marriage', 'Medical', 'Learning', 'Other'];

export default function MuhuratScreen() {
  const [selected, setSelected] = useState('Business');
  const { windows, recommendation, suggestion, reasoning, isLoading, error } = useMuhurat(selected);

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(255,159,75,0.06)" top={-40} left={180} size={280} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.meta}>Auspicious Timing</Text>
          <Text style={styles.title}>Muhurat Finder</Text>
          <Text style={styles.sub}>
            Select your event to find today's auspicious windows.
          </Text>
        </View>

        <View style={styles.chips}>
          {EVENT_TYPES.map(type => (
            <Pressable
              key={type}
              onPress={() => setSelected(type)}
              style={[styles.chip, selected === type && styles.chipActive]}
            >
              <Text style={[styles.chipText, selected === type && styles.chipTextActive]}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        <MuhuratCard
          recommendation={recommendation}
          suggestion={suggestion}
          reasoning={reasoning}
          windows={windows}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingTop: 150, paddingHorizontal: 24, paddingBottom: 160, gap: 20 },
  banner: { gap: 8 },
  meta: {
    fontFamily: fonts.label, fontSize: 10, textTransform: 'uppercase',
    letterSpacing: 3, color: colors.secondaryFixed,
  },
  title: {
    fontFamily: fonts.headlineExtra, fontSize: 36,
    color: colors.onSurface, letterSpacing: -0.5, lineHeight: 42,
  },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9999,
    borderWidth: 1, borderColor: colors.outlineVariant,
  },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
  chipText: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 1, color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.onPrimary },
});
