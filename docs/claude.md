# Aksha — Complete Project Context

## App Identity

**Aksha** is a premium React Native mobile application for the modern Indian diaspora. It bridges Vedic astrology, spiritual wisdom, and AI-powered personalization into a single, immersive, dark-mode experience. The product is built around four pillars:

1. **Daily Alignment** — Personalized daily horoscope based on the user's birth chart.
2. **Muhurat Finder** — Calculates auspicious time windows for real-world decisions/events.
3. **Ask Aksha** — A streaming AI spiritual chat guide ("Ask Krishna") grounded in Bhagavad Gita.
4. **Gurukul** — A curated knowledge library of spiritual micro-lessons.

---

## Core Technologies

| Domain              | Technology                                              |
|---------------------|---------------------------------------------------------|
| Framework           | Expo SDK 54 (`expo-router` file-based routing)         |
| Language            | TypeScript + TSX (React Native 0.81 / React 19)        |
| Styling             | React Native `StyleSheet` + custom `lib/theme.ts`      |
| Animations          | `moti` and `react-native-reanimated` (~4.1)            |
| Authentication      | Clerk (`@clerk/clerk-expo` v2) via OAuth                |
| Token Cache         | `expo-secure-store` (keychain-backed, persists after first unlock) |
| Database            | Supabase (`@supabase/supabase-js`) for profile sync    |
| Local Storage       | `@react-native-async-storage/async-storage`            |
| AI                  | Perplexity AI via `sonar-pro` (structured) and `sonar` (streaming) |
| Graphics            | `react-native-svg` + `@shopify/react-native-skia`      |
| Typography          | `Lexend` font family (6 weights, static via `expo-font`) |
| Date Pickers        | `@react-native-community/datetimepicker` (cross-platform) |
| Haptics             | `expo-haptics`                                         |
| Icons               | `lucide-react-native`                                  |
| Blur/Glass          | `expo-blur` (`BlurView` component)                     |

---

## Environment Variables

The following env vars are required:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=  # Clerk OAuth
EXPO_PUBLIC_SUPABASE_URL=           # Supabase project URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY= (or EXPO_PUBLIC_SUPABASE_ANON_KEY=)
PERPLEXITY_API_KEY=                 # Used server-side only (API routes)
```

---

## Expo App Config (`app.json`)

- **Name**: Aksha | **Slug**: `aksha` | **Version**: `1.0.0`
- **Orientation**: Portrait-only
- **Color Scheme**: Dark (`userInterfaceStyle: 'dark'`)
- **Splash Screen**: `#0e0e0e` background
- **iOS**: Tablet unsupported
- **Web Bundler**: Metro (with SSR-capable `output: 'server'`)
- **Typed Routes**: Enabled (`experiments.typedRoutes: true`)
- **Plugins**: `expo-router`, `expo-font` (preloads all 6 Lexend weights), `@react-native-community/datetimepicker`, `expo-secure-store`, `expo-web-browser`

---

## Project Structure

```
aksha/
├── app/                        # Expo Router — file-based pages & API routes
│   ├── _layout.tsx             # Root layout: providers, fonts, stack navigation
│   ├── (tabs)/                 # Main app (bottom tab group)
│   │   ├── _layout.tsx         # Tab layout — renders custom TabBar
│   │   ├── index.tsx           # Home: Daily Aksha / Alignment
│   │   ├── ask-krishna.tsx     # AI Chat screen
│   │   ├── gurukul.tsx         # Spiritual library screen
│   │   ├── muhurat.tsx         # Auspicious timing finder
│   │   └── profile.tsx         # User profile & settings
│   ├── onboarding/             # 12 sequential onboarding screens (steps 1–12)
│   └── api/                    # Expo Server API routes (server-only)
│       ├── chat+api.ts         # SSE stream for AI chat
│       └── wisdom/
│           ├── daily+api.ts    # Daily alignment generation
│           └── muhurat+api.ts  # Muhurat calculation + AI commentary
│
├── components/ui/              # Design-system-level reusable components
│   ├── AmbientBlob.tsx         # SVG radial gradient glows
│   ├── PageAmbientBlobs.tsx    # Pre-configured dual-blob background
│   ├── GlowCard.tsx            # Glowing container card
│   ├── GlassCard.tsx           # Glassmorphism card
│   ├── BottomSheet.tsx         # Custom bottom sheet overlay
│   ├── SacredButton.tsx        # Primary CTA Button with animated press
│   ├── PageHero.tsx            # Header block (meta label + headline + subtitle)
│   ├── TabBar.tsx              # Custom animated bottom navigation bar
│   ├── ToastProvider.tsx       # Global toast notification system
│   └── GurukulYogiBackdrop.tsx # Decorative background for Gurukul
│
├── features/                   # Feature-specific components, hooks, types
│   ├── auth/
│   │   ├── OAuthButton.tsx     # Google/Apple OAuth button
│   │   └── useSignIn.ts        # Clerk OAuth flows (Google + Apple)
│   ├── chat/
│   │   ├── ChatBubble.tsx      # Message render component
│   │   ├── ChatInput.tsx       # Keyboard-attached input bar
│   │   └── useChatState.ts     # Chat state & streaming message hook
│   ├── daily/
│   │   ├── DailyArthCard.tsx   # Quote/scripture hero card (Gita quotes)
│   │   ├── LessonCard.tsx      # Gurukul lesson card
│   │   └── types.ts            # Shared types for daily features
│   ├── gurukul/
│   │   ├── CategoryCard.tsx    # Gurukul category (e.g., Breathwork, Philosophy)
│   │   ├── FeaturedCard.tsx    # Featured lesson highlight card
│   │   └── LessonRow.tsx       # Compact lesson list item
│   ├── horoscope/
│   │   ├── DailyAlignmentCard.tsx   # Main renderers for daily cosmic insight
│   │   ├── TimelineItem.tsx    # A single timeline entry (dot + line + card)
│   │   ├── VedicReasoningAccordion.tsx # Collapsed Jyotish explanation
│   │   ├── types.ts            # TimeOfDay, TimelineEntry types
│   │   └── useDailyAlignment.ts # Hook: fetches / caches daily alignment
│   ├── muhurat/
│   │   ├── MuhuratCard.tsx     # Result card (recommendation badge + windows)
│   │   ├── useMuhurat.ts       # Hook: triggers muhurat API with request params
│   │   └── components/         # MuhuratDateSheet (iOS date picker sheet)
│   ├── onboarding/             # (Onboarding UI sub-components if any)
│   └── profile/
│       ├── useProfile.ts       # Core profile hook: Supabase CRUD + debounce auto-save
│       ├── constants.ts        # Profile field configs, DEFAULT_BIRTH_DATE, LANGUAGE_OPTIONS
│       ├── utils.ts            # formatBirthDateTime, mergeDateAndTime, getProfileInitials
│       └── components/         # ProfileHero, ProfileHeader, ProfileFields,
│                               # ProfileAuthSheet, ProfileSettingsSheet, ProfileDateTimeSheet
│
├── lib/                        # Pure logic and service modules
│   ├── theme.ts                # Color palette, font names, glassMorphism, gradients, layout
│   ├── typography.ts           # scaleFont(size) — applies FONT_SCALE=1.14 globally
│   ├── haptics.ts              # hapticLight, hapticMedium, hapticSuccess wrappers
│   ├── clerk.ts                # Clerk tokenCache (SecureStore-backed)
│   ├── supabase.ts             # getSupabaseClient() — Clerk JWT-authenticated Supabase client
│   ├── chatStorage.ts          # AsyncStorage: persist/load last 50 chat messages
│   ├── profileStorage.ts       # AsyncStorage: snapshot current user profile per userId
│   ├── dailyAlignmentStorage.ts # AsyncStorage: cache AI daily alignment (date-keyed)
│   ├── onboardingStore.ts      # In-memory store for onboarding wizard state + nakshatra insights
│   ├── ai/
│   │   ├── perplexity.ts       # API wrapper: perplexityChat + perplexityStream
│   │   ├── prompts.ts          # DAILY_SYSTEM, MUHURAT_SYSTEM, CHAT_SYSTEM, builder functions
│   │   └── parseModelJson.ts   # Robust JSON extractor for AI model output
│   └── vedic/
│       ├── types.ts            # PlanetName, SignName, SIGNS[], BirthChart, MuhuratWindow
│       ├── ayanamsha.ts        # toJDE(), lahiriAyanamsha(), toSidereal(), parseBirthDt()
│       ├── ephemeris.ts        # sunTropicalLongitude(), moonTropicalLongitude(), planetTropicalLongitude(), ascendantTropical()
│       ├── houses.ts           # signIndex(), signName(), wholeSignHouse()
│       ├── dasha.ts            # getCurrentDasha() — Vimshottari Maha + Antar Dasha
│       ├── chart.ts            # buildBirthChart() — orchestrates full chart compile
│       ├── muhurat.ts          # getMuhuratWindows(), getMuhuratWindowsForRange(), sunrise/sunset
│       └── geocode.ts          # Nominatim (OpenStreetMap) geocoding API call
│
├── types/                      # Global type declarations
├── assets/                     # Static: icons, SVGs, splash
└── docs/                       # This documentation
```

---

## Design System — "Ethereal Monolith"

### Color Palette (`lib/theme.ts`)

| Token                   | Value         | Usage                                    |
|-------------------------|---------------|------------------------------------------|
| `surface`               | `#0e0e0e`     | Global background                        |
| `surfaceContainerLow`   | `#131313`     | Card backgrounds                         |
| `surfaceContainer`      | `#191a1a`     | Elevated surfaces                        |
| `primary`               | `#b564fc`     | Purple — CTA, glows, accent              |
| `primaryFixedDim`       | `#b44aff`     | Deeper purple variant                    |
| `secondaryFixed`        | `#ff9500`     | Orange/gold — meta labels, icons, tabs   |
| `onSurface`             | `#ffffff`     | Primary text                             |
| `onSurfaceVariant`      | `#d3cec9`     | Secondary text                           |
| `error`                 | `#ee7d77`     | Error states                             |

**Glassmorphism** values:
- Card background: `rgba(37, 38, 38, 0.6)`
- Input background: `rgba(37, 38, 38, 0.7)`
- Light glass: `rgba(43, 44, 44, 0.4)`

**Onboarding palette (`OB`)** is a separate warm palette (saffron, gold, parchment) distinct from the main app.

### Typography (`lib/theme.ts` + `lib/typography.ts`)

All fonts are from the `Lexend` family, loaded statically. A global `FONT_SCALE = 1.14` multiplier (via `scaleFont()`) makes text render larger for premium readability.

| Token            | Weight     | Use Case               |
|------------------|------------|------------------------|
| `headlineExtra`  | ExtraBold  | Page titles, numbers   |
| `headline`       | Bold       | Card titles            |
| `label`          | SemiBold   | Metadata, form labels  |
| `bodyMedium`     | Medium     | Emphasized body text   |
| `body`           | Regular    | Body copy, descriptions|
| `labelLight`     | Light      | Subtle fine print      |

---

## Root Layout & Provider Hierarchy

`app/_layout.tsx` is the application shell. It establishes the entire provider tree:

```
ClerkProvider
  └── GestureHandlerRootView
       └── SafeAreaProvider
            └── ToastProvider
                 └── StatusBar (dark + #0e0e0e background)
                      └── Stack Navigator (all screens)
```

Fonts are loaded with `useFonts()` and the SplashScreen is held until they resolve. Onboarding screens have `gestureEnabled: false` and some use `animation: 'fade'` to create a ritualistic progression feel.

---

## Navigation Architecture

- **Stack Navigator** at root (no back-swipe during onboarding)
- **Tab Navigator** inside `(tabs)` with a fully custom `TabBar` component (replaces native tab bar)
- The `TabBar` uses `expo-blur`'s `BlurView` for its frosted glass effect and a spring-animated position indicator that slides between tabs
- Tab labels and icons are defined in `TAB_ICONS` and `TAB_LABELS` maps in `TabBar.tsx`
- Haptic feedback (`hapticLight`) fires on every tab press

---

## Screen Reference

### Home — `app/(tabs)/index.tsx`
- Displays the "Daily Aksha" page with a Gita quote card (`DailyArthCard`) and the Daily Cosmic Alignment (`DailyAlignmentCard`/`TimelineItem`)
- Uses `useDailyAlignment()` hook which fetches/caches the AI-generated day plan
- A "Reflect" CTA with social proof text ("4.2k others")

### Ask Aksha — `app/(tabs)/ask-krishna.tsx`
- Full `FlatList`-based chat view with `ChatBubble` components
- Messages animate in differently: AI responses use `FadeIn`, user messages use `SlideInRight`
- `useChatState()` manages the message list, streaming from `/api/chat`, with SSE parsing
- Shows a "TypingIndicator" while the AI is responding (three dots + italic "Aksha is reflecting…")
- `KeyboardAvoidingView` handles keyboard displacement cross-platform

### Muhurat — `app/(tabs)/muhurat.tsx`
- Form UI: multi-line intent description textbox + date range pickers (platform-split: Android uses `DateTimePickerAndroid.open`, iOS uses a custom `MuhuratDateSheet` bottom-sheet)
- Submits a `MuhuratRequest` to `useMuhurat()` which calls `/api/wisdom/muhurat`
- Results appear in `MuhuratCard`: color-coded `Yes/No/Wait` badge, suggestion text, list of auspicious windows by date/time, and a collapsible `VedicReasoningAccordion`

### Gurukul — `app/(tabs)/gurukul.tsx`
- Primarily static at this stage; content is hardcoded
- Features a `FeaturedCard`, a `CategoryCard` row (Breathwork + Philosophy with progress bars), and a `LessonRow` list
- Closes with a Rumi quote section

### Profile — `app/(tabs)/profile.tsx`
- Displays avatar/initials derived from `useUser()` (Clerk) or `profile.name`
- Birth date/time picker is fully custom and platform-split (Android: dual-step picker; iOS: combined date+time bottom sheet)
- Profile fields: name, birth_dt (formatted as `DD/MM/YYYY, HH:MM AM`), birth_place
- Settings sheet accessed via gear icon: shows language selection, sign-out, account info
- Auth sheet for Google/Apple sign-in (appears when user taps "Sign In" in settings)

---

## Onboarding Flow (12 Screens)

All 12 screens are locked (no back gesture) to create a ritualistic feel. They use the warm `OB` palette, not the main app palette. Each step persists data into `onboardingStore.ts` (module-level memory store).

| Step | File        | Purpose                                                        |
|------|-------------|----------------------------------------------------------------|
| 1    | `index.tsx` | Splash / brand intro — breathing crescent animation, starfield |
| 2    | `step-2.tsx`| Pain point intake — multi-select pill chips                    |
| 3    | `step-3.tsx`| Persona selection                                              |
| 4    | `step-4.tsx`| Name input                                                     |
| 5    | `step-5.tsx`| Birth date selection                                           |
| 6    | `step-6.tsx`| Birth time (fade transition)                                   |
| 7    | `step-7.tsx`| **Revelation** — runs Vedic math in-client to show the user's Nakshatra + Rashi + Soul Insight |
| 8    | `step-8.tsx`| Birth place input                                              |
| 9    | `step-9.tsx`| Unknown birth time option                                      |
| 10   | `step-10.tsx`| Commitment tier / Focus area selection                        |
| 11   | `step-11.tsx`| First question / intent for Ask Aksha                         |
| 12   | `step-12.tsx`| **The Threshold** — long-press (2s hold) "enter the app" interaction. Fires haptics at 25%/55%/80%/100%. On completion, saves profile fields and navigates to `/(tabs)` |

**Step 7 is notable**: It directly runs `toJDE`, `toSidereal`, and `moonTropicalLongitude` on-device to compute the user's Moon Nakshatra and Rashi immediately — no network call needed. The `NAKSHATRA_INSIGHTS` dictionary maps all 27 Nakshatras to a personalized "soul insight" string shown on a beautiful animated "Birth Alignment Card."

---

## Key Shared Components

### `AmbientBlob` / `PageAmbientBlobs`
An SVG `RadialGradient` absolutely positioned behind content. Parses both `rgba()` and `#rrggbbaa` color formats. `PageAmbientBlobs` is a pre-built composition used across all main tab pages.

### `GlowCard`
A `LinearGradient` glow layer placed above the card container, combined with a bordered, translucent inner card. `glowIntensity` controls opacity and is converted to a hex alpha value.

### `TabBar`
The flagship custom tab bar. Key mechanics:
- Measures its own width via `onLayout`
- Calculates slot widths then animates an `Animated.View` "selector" using `withSpring` from Reanimated
- Each tab press fires `hapticLight()` and standard React Navigation `tabPress` events
- `BlurView` provides the frosted glass background
- Active tab icons are slightly larger (21px) with `secondaryFixed` (orange) color; inactive at 20px with 40% white opacity

### `ToastProvider`
A `React.createContext` system for imperative toast notifications:
- Single toast at a time (new toast replaces previous)
- Animates via `Animated.parallel` with `opacity` + `translateY`
- Three types: `success` (green accent), `error` (red), `info` (orange)
- Tappable to dismiss early
- Default duration: 2600ms; can be set per-invocation
- Used everywhere via `useToast()` hook

### `VedicReasoningAccordion`
Collapsible section that reveals the AI's technical Jyotish reasoning. Animates `maxHeight` from 0→200 and `opacity` with `withTiming` on a Reanimated shared value. The chevron rotates 0→180° on toggle.

---

## Supabase Integration

`lib/supabase.ts` creates a Supabase client with:
- `persistSession: false` (Clerk manages sessions)
- `autoRefreshToken: false`
- `accessToken: getToken` — passes a Clerk JWT getter function so Supabase uses the Clerk-issued token for RLS

The Supabase `profiles` table schema (inferred from `useProfile.ts`):
```
profiles (
  id          text PRIMARY KEY,  -- Clerk userId
  name        text,
  birth_dt    text,              -- "DD/MM/YYYY, HH:MM AM" format
  birth_place text,
  language    text,
  region      text,
  focus_area  text,
  updated_at  timestamptz
)
```
