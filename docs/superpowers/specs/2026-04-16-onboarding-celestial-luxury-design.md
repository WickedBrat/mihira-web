# Onboarding: Celestial Luxury Redesign

**Date:** 2026-04-16
**Scope:** All 12 onboarding screens (`app/onboarding/index.tsx` + `step-2` through `step-12`)
**Approach:** Design Token Lift + Shared Luxury Components (Option A)

---

## Goals

Transition the onboarding flow from a flat, utility aesthetic to a "Celestial Luxury" feel: deep radial gradients, glassmorphism cards, richer ambient backgrounds with a constellation texture, stronger button glow, and bespoke treatments for the three hero screens (Screen 6 Loading dial, Screen 7 Signature card, Screen 12 Threshold).

All screen logic (haptics, analytics, validation, date pickers, long-press mechanic) is preserved. Only the visual layer is modified.

---

## Constraints

- Font: **GoogleSans** only (existing; no new fonts added)
- Libraries used (all already in `package.json`):
  - `expo-blur` — glassmorphism
  - `expo-linear-gradient` — background gradients and button fills
  - `react-native-svg` — SVG illustrations (orb, sunburst, constellation)
  - `lucide-react-native` — contextual input/card icons
  - `moti` — between-screen entry transitions and within-screen spring animations
  - `@shopify/react-native-skia` — already in use on screens 6 & 9; enhancements only
  - `react-native-reanimated` — existing animated values kept intact
- Between-screen transitions: **fade + scale materialise** (Option B)
  - Stack `animation` set to `'none'`
  - Each screen root wrapped in `MotiView` (`from={{ opacity: 0, scale: 0.96 }}` → `animate={{ opacity: 1, scale: 1 }}`, 380ms ease-out)

---

## Updated Design Tokens (`lib/onboardingStore.ts`)

Three new tokens added to the `OB` object; all existing tokens unchanged:

| Token | Value | Purpose |
|---|---|---|
| `bronze` | `#C68B59` | Active-selection glow colour |
| `bronzeGlow` | `rgba(198,139,89,0.30)` | Ambient shadow / outer haze |
| `bronzeBorder` | `rgba(198,139,89,0.60)` | Active card border glow |

Two existing tokens get richer values:

| Token | Old | New |
|---|---|---|
| `card` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.07)` |
| `cardBorder` | `rgba(255,255,255,0.09)` | `rgba(255,255,255,0.13)` |

---

## Shared Components

All new files live in `features/onboarding/`. Each is a pure presentational component with no business logic.

### `CelestialBackground`

**File:** `features/onboarding/CelestialBackground.tsx`

Full-screen base layer. Uses `StyleSheet.absoluteFill`. Every screen renders this as its first child.

Structure (bottom to top):
1. `LinearGradient`: `['#12080F', '#07090C', '#06080B']`, vertical (`start: {x:0.5, y:0}`, `end: {x:0.5, y:1}`)
2. `ConstellationLayer` (see below)
3. Two ambient haze blobs:
   - Saffron blob: top-right, `rgba(224,122,95,0.05)`, 280×280, `borderRadius:999`
   - Gold blob: bottom-left, `rgba(217,160,111,0.04)`, 220×220, `borderRadius:999`

Props: none. Used via `<CelestialBackground />` with no wrapping needed.

Usage pattern in each screen:
```tsx
<View style={{ flex: 1 }}>
  <CelestialBackground />
  <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
    {/* screen content */}
  </SafeAreaView>
</View>
```

### `ConstellationLayer`

**File:** `features/onboarding/ConstellationLayer.tsx`

`react-native-svg` overlay, `pointerEvents="none"`, `StyleSheet.absoluteFill`.

- 24 dot nodes: `<Circle r={1} fill={OB.gold} opacity={0.15}/>` at fixed proportional coordinates (pre-computed, stored as a constant array of `{cx, cy}` pairs in `[0,1]` space, scaled to `useWindowDimensions`)
- 14 line segments: `<Line stroke={OB.gold} strokeOpacity={0.06} strokeWidth={0.6}/>` connecting nearby node pairs
- Wrapped in `MotiView` rotating the entire SVG: `from={{ rotate: '0deg' }}` → `animate={{ rotate: '360deg' }}`, `transition={{ type: 'timing', duration: 120000, loop: true }}`

### `GlassCard`

**File:** `features/onboarding/GlassCard.tsx`

Props: `style?`, `active?: boolean`, `borderRadius?: number` (default 28), `children`

Structure:
- `BlurView` from `expo-blur`: `intensity={20}`, `tint="dark"`, `borderRadius={borderRadius}`, `overflow="hidden"`
- Inside: semi-transparent fill `View` (`rgba(255,255,255,0.06)`) + `{children}`
- Border: 1px `rgba(255,255,255,0.13)` via an `absoluteFill` border View (also uses `borderRadius` prop)
- `active=true`: border colour switches to `OB.bronzeBorder`; adds `shadowColor: OB.bronze`, `shadowRadius: 20`, `shadowOpacity: 0.35`, `shadowOffset: {0, 4}`

Callers that need non-default radius: Screen 5 passes `borderRadius={20}` for field rows. Screen 8 passes `borderRadius={20}` + overrides `borderTopLeftRadius: 4` via `style` for the AI bubble (set `borderRadius={20}` on `BlurView` then apply `{ borderTopLeftRadius: 4 }` to the outer wrapper).

All cards across all screens that previously used `backgroundColor: OB.card` + `borderColor: OB.cardBorder` are replaced with `<GlassCard>`.

### `LuxuryButton`

**File:** `features/onboarding/LuxuryButton.tsx`

Props: `onPress`, `label`, `disabled?: boolean`, `style?`

Structure:
- `Pressable` → `LinearGradient` (`[OB.saffron, '#E8916F']`, horizontal) → `Text`
- `borderRadius: 9999`
- Shadow: `shadowColor: OB.saffron`, `shadowRadius: 32`, `shadowOpacity: 0.55`, `shadowOffset: {0, 8}`
- Press animation via `moti` `useAnimationState`: scale `0.97`, opacity `0.88`, duration 100ms
- `disabled`: opacity `0.35`, shadow removed

Replaces every `backgroundColor: OB.saffron` Pressable button across all 12 screens.

### `CelestialOrb`

**File:** `features/onboarding/CelestialOrb.tsx`

Props: `size?: number` (default 120), `animated?: boolean` (default true)

SVG crescent moon illustration using `react-native-svg`:
- Outer corona ring: `Circle r={size*0.75}`, `stroke={OB.gold}`, `strokeOpacity={0.06}`, no fill
- Mid glow ring: `Circle r={size*0.55}`, `stroke={OB.gold}`, `strokeOpacity={0.12}`, no fill
- Crescent body: main circle clipped by an offset circle using SVG `clipPath` — creates crescent shape, `fill={OB.gold}`
- 5 small dot stars scattered around: `Circle r={1.5}`, `fill={OB.gold}`, `opacity={0.6}`

When `animated=true`: wraps the SVG in the existing `reanimated` breathe + glow logic (moved from Screen 1's inline code into the component).

Used on: Screen 1 (size=120), Screen 6 center (size=52), Screen 8 avatar (size=44), Screen 9 center (size=80), Screen 12 button interior (size=36).

### `CelestialDial`

**File:** `features/onboarding/CelestialDial.tsx`

Enhancement wrapper for Screen 6 (the Skia celestial dial). Not a replacement — the existing Skia Canvas rendering stays in `step-6.tsx`. This component provides the `ConstellationLayer` behind the Canvas and the SVG progress arc that fills as loading steps complete.

Props: `progress: number` (0–1), `width: number`, `children: ReactNode`

In `step-6.tsx`, the entire dial block (the outer `<View style={{ width, height: width }}>` containing the Canvas + all three `Animated.View` layers + center View) is wrapped with `<CelestialDial progress={stepIndex / (STEPS.length - 1)} width={width}>`. The `stepIndex` state already exists in the screen.

Structure:
- Outer `View` sized `width × width`
- `ConstellationLayer` as first child: `StyleSheet.absoluteFill`, `pointerEvents="none"`
- `{children}` (the existing Canvas + animated overlays)
- SVG arc overlay as last child: `StyleSheet.absoluteFill`, `pointerEvents="none"`. A `react-native-svg` `<Circle>` with `strokeDasharray` / `strokeDashoffset` creates the fill arc. Circumference = `2π × (R - 20)` where R is the outer Skia ring radius. `strokeDashoffset` = `circumference × (1 - progress)`. Stroke colour `OB.goldBorder`, strokeWidth 2.
- Existing `rotation`, `innerRot`, `pulse` shared values stay in `step-6.tsx` untouched

---

## Screen-by-Screen Changes

All screens: `SafeAreaView backgroundColor` → `'transparent'`. Outer wrapper `View` receives `CelestialBackground`. All buttons → `LuxuryButton`. All card containers → `GlassCard`. Root view wrapped in `MotiView` entry transition.

### Screen 1 — Splash (`app/onboarding/index.tsx`)

- Replace `<Text style={styles.crescent}>☽</Text>` with `<CelestialOrb size={120} animated />`
- Remove the hand-rolled `breathe` / `glow` shared values (logic moves into `CelestialOrb`)
- `LuxuryButton` for "Begin My Alignment" with `shadowRadius: 40` (largest glow in the flow)
- Remove the static `STARS` array + star View loop (replaced by `ConstellationLayer` in `CelestialBackground`)

### Screen 2 — Pain Points (`app/onboarding/step-2.tsx`)

- Each pill `Pressable` → `GlassCard` wrapper + inner `Pressable`
- Add `lucide-react-native` icons left of each label:
  - Decision Fatigue → `Brain`
  - Career Burnout → `Flame`
  - Search for Purpose → `Compass`
  - Disconnected from Roots → `TreePine`
  - Restless Mind → `Wind`
- Active state: `GlassCard active={true}` (bronze glow) replaces `saffronDim` fill
- `LuxuryButton` for "Continue →"

### Screen 3 — Persona Selection (`app/onboarding/step-3.tsx`)

- Existing `LinearGradient` (`#253b7a → #22214f`) kept. A `View` with `StyleSheet.absoluteFill` + `backgroundColor: 'rgba(255,255,255,0.05)'` is added as the last child inside the `LinearGradient` (i.e. on top of the gradient, behind the text content)
- Card `borderRadius` 16 → 28
- Active border: `OB.bronzeBorder` (replaces `OB.saffronBorder`)
- Persona image shadow: add `shadowColor: OB.gold`, `shadowOpacity: 0.3`
- Description reveal: replace `FadeInDown` with `moti` spring (`type: 'spring', damping: 18`)
- `LuxuryButton` for "This is my chapter →"

### Screen 4 — Name Input (`app/onboarding/step-4.tsx`)

- Input underline (`styles.inputLine`): replace solid `OB.goldBorder` with a `LinearGradient` 1px-height View (`[OB.gold, OB.saffron]`, horizontal)
- Preview `☽ {name}` text: font size bumped from 14 to 18, colour `OB.gold`, `letterSpacing: 2`
- `LuxuryButton` for "Enter as [name] →"

### Screen 5 — Birth Data (`app/onboarding/step-5.tsx`)

- Field row containers (`styles.fieldRow`) → `GlassCard` (radius 20)
- Add icons left of each field label:
  - DATE OF BIRTH → `Calendar` (lucide-react-native, size 13, color `OB.muted`)
  - TIME OF BIRTH → `Clock`
  - PLACE OF BIRTH → `MapPin`
- Active picker state: `GlassCard active={true}`
- Privacy seal → `GlassCard` with `Lock` icon (replaces 🔒 emoji)
- `LuxuryButton` for "Calculate My Chart →"

### Screen 6 — Loading / Mapping (`app/onboarding/step-6.tsx`)

- Add `CelestialBackground` (removes plain `OB.bg` background)
- Wrap the Skia Canvas block in `CelestialDial` (adds constellation behind + SVG progress arc)
- Center ☽ emoji → `CelestialOrb size={52} animated={false}`; pulse animation stays on the wrapping `Animated.View`
- Step progress indicator: replace dot row with a thin animated bar (`height: 2`, `borderRadius: 1`, width animates from 0 to 100% across the 5 steps using `moti`)
- Status text: `letterSpacing: 1`, `fontStyle: 'italic'`

### Screen 7 — Cosmic Signature Card (`app/onboarding/step-7.tsx`)

The hero screen. Most intensive changes:

- Outer card (`styles.card`):
  - `borderRadius`: 24 → 32
  - Replace `backgroundColor: 'rgba(255,255,255,0.03)'` with `GlassCard`
  - Outer shadow: `shadowColor: OB.bronze`, `shadowRadius: 28`, `shadowOpacity: 0.40`
  - Double border: outer `OB.bronzeBorder` + existing inner `OB.goldBorder` shimmer view
- Add SVG sunburst behind the user's name: 12 thin rays (`react-native-svg`), `strokeOpacity: 0.08`, `stroke: OB.gold`, positioned absolute at card top
- Nakshatra + Rashi pills → `GlassCard`:
  - Nakshatra pill: `active={false}`, gold border (`OB.goldBorder`)
  - Rashi pill: `active={true}` (bronze glow)
  - Both: font size 15 → 17, icon added (☽ and zodiac glyph stay as text)
- Corner ornaments ✦: font size 10 → 18, colour `OB.gold` at 70% opacity
- Existing card scale + opacity entry animation: unchanged
- Ambient glow behind card (`styles.glow`): `shadowRadius` 80 → 100, `backgroundColor` opacity 0.12 → 0.18

### Screen 8 — Sarathi's Voice (`app/onboarding/step-8.tsx`)

- Avatar circle → glass style: `BlurView intensity=20` wrapper, border `OB.saffronBorder` at 60%
- Replace ☽ avatar icon with `CelestialOrb size={44} animated={false}`
- AI bubble → `GlassCard` (`borderTopLeftRadius: 4` preserved via `style` prop override)
- User bubble → glass with `OB.saffronDim` tint + `OB.saffronBorder` border
- Input container → `GlassCard` with `active={focused}` state (tracked via `onFocus`/`onBlur` on TextInput)
- Loading dots: replace `withRepeat` with `moti` staggered `MotiView` scale pulse (delays 0, 200, 400ms)
- `LuxuryButton` for "Continue My Journey →"

### Screen 9 — Daily Alignment Dial (`app/onboarding/step-9.tsx`)

- Add `CelestialBackground`
- Abhijit segment: add a `RadialGradient` (Skia) behind the highlighted arc for a soft bloom effect — centred on the segment midpoint, radius 40, `rgba(217,160,111,0.15)` → transparent
- Center ☽ emoji → `CelestialOrb size={80} animated`
- Legend tags → small `GlassCard` pills (`borderRadius: 20`, `paddingHorizontal: 12`, `paddingVertical: 6`)
- `LuxuryButton` for "Allow Daily Reminders →"

### Screen 10 — Social Proof (`app/onboarding/step-10.tsx`)

- Testimonial cards → `GlassCard`
- Avatar fill: replace flat `OB.saffronDim` with a `LinearGradient` (`[OB.saffron, OB.gold]`, diagonal)
- Nakshatra pill: `borderColor: OB.bronzeBorder`, `backgroundColor: OB.goldDim`, font weight `600SemiBold` (up from `500Medium`)
- Star row: `opacity` explicitly `1.0` (remove any dimming)
- Page dots: active dot gets `backgroundColor: OB.gold` (replaces `OB.saffron`)
- `LuxuryButton` for "I'm Ready →"

### Screen 11 — Commitment Tier (`app/onboarding/step-11.tsx`)

- Tier cards → `GlassCard active={selected === tier.id}`
- Replace emoji tier icons with `lucide-react-native`:
  - 🌱 → `Sprout`
  - 🌿 → `Leaf`
  - 🪷 → `Flower2`
- "MOST POPULAR" badge: replace flat `backgroundColor: OB.saffron` with `LinearGradient` (`[OB.saffron, OB.bronze]`, horizontal)
- Active tier: `GlassCard` `active` prop adds `shadowColor: OB.bronze`, `shadowRadius: 18`
- Feature list bullet `·` → small `lucide-react-native` `Check` icon (size 11, color `OB.gold`)
- `LuxuryButton` for "Set My Sankalpa →"

### Screen 12 — The Threshold (`app/onboarding/step-12.tsx`)

Logic (interval, haptics, `progress.value` shared value, navigation) entirely untouched.

Visual changes only:
- Replace ☽ emoji inside button with `CelestialOrb size={36} animated={false}`
- Outer ring (`ringOuter`) border colour: interpolate `progress.value` 0→1 from `OB.saffron` → `OB.gold` using `interpolateColor` from reanimated
- Add 4th static haze ring: large circle (diameter ~360), `borderWidth: 0.5`, `borderColor: rgba(217,160,111,0.04)`, no animation, pure atmosphere
- Bottom quote: `letterSpacing: 1.5`, colour `rgba(217,160,111,0.5)` (gold-tinted, up from plain muted grey)
- Existing `LinearGradient` background unchanged

---

## File Structure

```
features/onboarding/
  CelestialBackground.tsx   (new)
  ConstellationLayer.tsx     (new)
  GlassCard.tsx              (new)
  LuxuryButton.tsx           (new)
  CelestialOrb.tsx           (new)
  CelestialDial.tsx          (new)
  ChoiceCard.tsx             (existing, unchanged)

lib/onboardingStore.ts       (update OB tokens)

app/onboarding/
  index.tsx                  (update)
  step-2.tsx through step-12.tsx  (update)
```

---

## Transition System

In the onboarding layout file (or each screen root), set `animation: 'none'` on the Stack navigator for the onboarding group. Each screen's outermost content View is wrapped in:

```tsx
<MotiView
  from={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'timing', duration: 380, easing: Easing.out(Easing.cubic) }}
  style={{ flex: 1 }}
>
```

Exit animations are not implemented (expo-router stack exits are not controllable without native modules). The entry "materialise" effect alone achieves the desired cinematic feel.

---

## Implementation Order

Build shared components first (they have no dependencies on screen code), then screens from simplest to most complex:

1. `lib/onboardingStore.ts` — token updates
2. `ConstellationLayer.tsx`
3. `CelestialBackground.tsx` (depends on ConstellationLayer)
4. `GlassCard.tsx`
5. `LuxuryButton.tsx`
6. `CelestialOrb.tsx`
7. `CelestialDial.tsx`
8. Apply to screens: 1, 4, 2, 3, 5, 8, 10, 11, 9, 6, 7, 12 (simplest → most complex)
