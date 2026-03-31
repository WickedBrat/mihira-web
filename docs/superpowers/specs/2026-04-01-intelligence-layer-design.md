# Aksha Intelligence Layer Design

**Date:** 2026-04-01
**Scope:** Vedic math engine + Perplexity AI integration for Daily Alignment, Muhurat Finder, and real Ask Krishna chat.

---

## 1. Goals

- Replace all static/mocked content with real AI-generated Vedic guidance.
- Math engine computes Ground Truth (planetary positions, houses, dashas, muhurat windows) server-side — AI only narrates, never infers chart data.
- Ask Krishna chat wired to real Perplexity streaming with local history persistence.
- New "Muhurat" tab in the bottom nav.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Ephemeris | `astronomia` npm (Jean Meeus, pure JS, server-side only) |
| Geocoding | OpenStreetMap Nominatim (free, no API key) |
| AI provider | Perplexity API (OpenAI-compatible) |
| Daily Alignment + Muhurat model | `sonar-pro` |
| Ask Krishna model | `sonar` |
| Chat history | `@react-native-async-storage/async-storage` |
| Glow animation | Reanimated + LinearGradient (no Skia) |

---

## 3. New Environment Variable

`.env.local` (git-ignored):
```
PERPLEXITY_API_KEY=pplx-...
```
`.env.example` (add):
```
PERPLEXITY_API_KEY=
```
**No `EXPO_PUBLIC_` prefix** — used only in server-side API routes.

---

## 4. File Map

### New files
```
lib/vedic/types.ts           — Shared Vedic types
lib/vedic/ephemeris.ts       — Planetary longitudes via astronomia
lib/vedic/ayanamsha.ts       — Lahiri ayanamsha conversion
lib/vedic/houses.ts          — Whole Sign house assignments
lib/vedic/dasha.ts           — Vimshottari Dasha calculator
lib/vedic/muhurat.ts         — Chaughadiya + Abhijit windows
lib/vedic/geocode.ts         — Nominatim text→lat/lng
lib/ai/perplexity.ts         — Perplexity fetch client
lib/ai/prompts.ts            — All prompt templates
lib/chatStorage.ts           — AsyncStorage chat history wrapper
app/api/wisdom/daily+api.ts  — Daily Alignment endpoint
app/api/wisdom/muhurat+api.ts— Muhurat Finder endpoint
app/api/chat+api.ts          — Ask Krishna streaming endpoint
features/horoscope/useDailyAlignment.ts
features/horoscope/DailyAlignmentCard.tsx
features/horoscope/VedicReasoningAccordion.tsx
features/muhurat/useMuhurat.ts
features/muhurat/MuhuratCard.tsx
app/(tabs)/muhurat.tsx
__tests__/lib/vedic/ephemeris.test.ts
__tests__/lib/vedic/houses.test.ts
__tests__/lib/vedic/dasha.test.ts
__tests__/lib/vedic/muhurat.test.ts
__tests__/lib/ai/perplexity.test.ts
__tests__/lib/chatStorage.test.ts
```

### Modified files
```
app/(tabs)/_layout.tsx       — Add muhurat Tabs.Screen
components/ui/TabBar.tsx     — Add muhurat icon + label
app/(tabs)/horoscope.tsx     — Replace static timeline with DailyAlignmentCard
features/chat/useChatState.ts— Wire to real streaming endpoint + AsyncStorage
.env.example
```

---

## 5. Math Engine

### 5.1 Types (`lib/vedic/types.ts`)

```ts
export type PlanetName = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Rahu' | 'Ketu';
export type SignName = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
export const SIGNS: SignName[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

export interface PlanetPosition {
  name: PlanetName;
  longitude: number;    // 0–360 sidereal
  sign: SignName;
  house: number;        // 1–12 Whole Sign
  isRetrograde?: boolean;
}

export interface BirthChart {
  lagna: SignName;
  lagnaLongitude: number;
  planets: PlanetPosition[];
  nakshatra: string;    // Moon's nakshatra name
  currentDasha: string; // e.g. "Jupiter-Mars"
}

export interface ChaughadiyaPeriod {
  start: string;        // ISO datetime
  end: string;
  planet: PlanetName;
  quality: 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Udveg' | 'Rog' | 'Kaal';
  isAuspicious: boolean;
}

export interface MuhuratWindow {
  start: string;
  end: string;
  quality: string;      // e.g. "Excellent (Abhijit Muhurat)"
  type: 'abhijit' | 'chaughadiya';
}
```

### 5.2 Ayanamsha (`lib/vedic/ayanamsha.ts`)

Lahiri ayanamsha at J2000.0 = 23.85°, drifting at 50.3"/year.

```ts
export function lahiriAyanamsha(jde: number): number {
  const T = (jde - 2451545.0) / 36525; // Julian centuries from J2000
  return 23.85 + T * (50.3 / 3600);    // degrees
}
export function toSidereal(tropicalLng: number, jde: number): number {
  return ((tropicalLng - lahiriAyanamsha(jde)) % 360 + 360) % 360;
}
```

### 5.3 Ephemeris (`lib/vedic/ephemeris.ts`)

Use `astronomia` to compute tropical longitudes:
- `solar.apparentLongitude(jde)` → Sun
- `moonposition.position(jde).lon` → Moon
- `planetposition` with VSOP87 data for Mercury, Venus, Mars, Jupiter, Saturn
- `node.meanLongitudeAscending(jde)` → Rahu (Moon's mean ascending node); Ketu = Rahu + 180°

Convert all to sidereal via `toSidereal()`.

Ascendant (Lagna) calculation:
1. GMST from `sidereal.apparent0UT(jde)`
2. LST = GMST + longitude_degrees / 15
3. Obliquity from `nutation.meanObliquityLaskar(jde)`
4. Ascendant ecliptic longitude from LST + obliquity (standard Ascendant formula)

### 5.4 Houses (`lib/vedic/houses.ts`)

```ts
export function wholeSignHouse(planetSign: number, lagnaSign: number): number {
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}
// lagnaSign = floor(lagnaLongitude / 30)
// planetSign = floor(planet.siderealLongitude / 30)
```

### 5.5 Dasha (`lib/vedic/dasha.ts`)

27 nakshatras map to 9 lords (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury) repeating × 3.
Each lord's period in years: `[7, 20, 6, 10, 7, 18, 16, 19, 17]`.

```ts
const NAKSHATRA_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_YEARS     = [7, 20, 6, 10, 7, 18, 16, 19, 17];

export function getCurrentDasha(moonLng: number, birthDate: Date, today: Date): string {
  // nakshatra index 0–26 from moon longitude
  // lord = NAKSHATRA_LORDS[nakshatraIndex % 9]
  // elapsed portion in nakshatra → elapsed years in lord's period
  // iterate periods forward from birth to today
  // return "MahadashaLord-AntardashaLord"
}
```

### 5.6 Muhurat (`lib/vedic/muhurat.ts`)

**Chaughadiya:**
- Day lord by weekday: `[Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn]` (index 0=Sunday)
- Chaughadiya quality by planet: `{Sun:'Udveg', Moon:'Amrit', Mars:'Rog', Mercury:'Labh', Jupiter:'Shubh', Venus:'Char', Saturn:'Kaal'}`
- Auspicious: Amrit, Shubh, Labh, Char
- Divide day (sunrise→sunset) into 8 equal periods; night (sunset→next sunrise) into 8 equal periods
- Starting planet for day periods = day lord (index `weekday` in `[Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn]`)
- Starting planet for night periods = offset by 5 from the day lord (i.e. `(weekdayIndex + 5) % 7`)
- Each period's ruling planet advances through the same 7-planet sequence

**Abhijit Muhurat:**
- Solar noon ± 24 minutes (excellent except Wednesday)

Use `astronomia/rise` for sunrise/sunset. Output: `MuhuratWindow[]` filtered to auspicious periods only.

### 5.7 Geocode (`lib/vedic/geocode.ts`)

```ts
export async function geocode(place: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'aksha-app/1.0' } });
  const data = await res.json();
  if (!data.length) throw new Error(`Could not geocode: ${place}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
```

---

## 6. AI Layer

### 6.1 Perplexity Client (`lib/ai/perplexity.ts`)

Perplexity's API is OpenAI-compatible at `https://api.perplexity.ai`.

```ts
export async function perplexityChat(
  model: string,
  messages: { role: string; content: string }[],
  stream?: false
): Promise<string>

export async function perplexityStream(
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void
): Promise<void>
```

Uses `PERPLEXITY_API_KEY` env var (server-only).

### 6.2 Prompts (`lib/ai/prompts.ts`)

**Daily Alignment system prompt:**
> You are a master Jyotish pandit. You receive Ground Truth planetary data computed by an ephemeris engine. You NEVER move planets from the houses provided. You speak directly to the user using dharma-focused language — never fortune-teller clichés. Respond ONLY in valid JSON.

**Daily Alignment user prompt:** Includes full `BirthChart` JSON + current transit positions. Requests:
```json
{ "guidance": "<3 sentences>", "reasoning": "<2 sentences>" }
```

**Muhurat system prompt:**
> Same Jyotish persona. Given muhurat windows and user chart, assess auspiciousness for the event type. Respond ONLY in valid JSON.

**Muhurat user prompt:** Includes event type, birth chart summary, muhurat windows. Requests:
```json
{ "recommendation": "Yes|No|Wait", "suggestion": "<2 sentences>", "reasoning": "<2 sentences>" }
```

**Chat system prompt:**
> You are Krishna, a wise and compassionate spiritual guide in Aksha, a Vedic app for the Indian diaspora. You speak with warmth, depth, and directness. You draw on Bhagavad Gita, Upanishads, and Vedic philosophy. Never be preachy. Keep responses concise (2–4 sentences unless asked to elaborate).

---

## 7. API Routes

### `app/api/wisdom/daily+api.ts`
- Method: POST
- Body: `{ birthDt: string, birthPlace: string }` — `birthDt` format is `"DD/MM/YYYY, HH:MM AM"` (from profile); API route parses this to a `Date` before passing to the math engine.
- Flow: geocode → compute chart → call `perplexityChat(sonar-pro, ...)` → return `{ chart: BirthChart, guidance: string, reasoning: string }`

### `app/api/wisdom/muhurat+api.ts`
- Method: POST
- Body: `{ birthDt: string, birthPlace: string, eventType: string, date?: string }`
- Flow: geocode → compute chart → compute muhurat windows → call Perplexity → return `{ windows: MuhuratWindow[], recommendation: string, suggestion: string, reasoning: string }`

### `app/api/chat+api.ts`
- Method: POST
- Body: `{ message: string, history: {role: string, content: string}[] }`
- Response: streaming SSE (`text/event-stream`)
- Flow: prepend system prompt → `perplexityStream(sonar, ...)` → stream tokens back

---

## 8. Feature Hooks

### `features/horoscope/useDailyAlignment.ts`
- Reads `profile` from `useProfile()` hook
- POSTs to `/api/wisdom/daily` with birth data
- Returns `{ chart, guidance, reasoning, isLoading, error }`
- Fetches once on mount when profile has `birth_dt` + `birth_place`

### `features/muhurat/useMuhurat.ts`
- Reads `profile` from `useProfile()` hook
- Takes `eventType: string` as param
- POSTs to `/api/wisdom/muhurat`
- Returns `{ windows, recommendation, suggestion, reasoning, isLoading, error }`

---

## 9. UI Components

### `features/horoscope/DailyAlignmentCard.tsx`
- **Glow:** `useSharedValue` pulsing opacity (0.4 → 0.7) with `withRepeat(withTiming(…, {duration:3000}), -1, true)`. `LinearGradient` behind text.
- **Text reveal:** After data loads, show guidance words one-by-one via `useState` + `useEffect` with 80ms intervals.
- **Accordion:** `VedicReasoningAccordion` toggles reasoning text with Reanimated height animation.
- Loading state: 3 shimmer placeholder lines.

### `features/horoscope/VedicReasoningAccordion.tsx`
- Props: `reasoning: string`
- "View Vedic Reasoning" label with chevron. Reanimated `useSharedValue(0)` height interpolation.

### `features/muhurat/MuhuratCard.tsx`
- Shows `recommendation` badge: Yes=green, No=red, Wait=amber
- Lists auspicious `MuhuratWindow[]` with times
- Abhijit window highlighted with gold border
- AI suggestion visible; reasoning in accordion

---

## 10. Chat Upgrade (`features/chat/useChatState.ts`)

- On `sendMessage`: POST to `/api/chat`, read `ReadableStream` response chunked via `fetch + reader.read()`
- Append AI message token-by-token to messages state (live streaming UI)
- On mount: load history from `chatStorage.getHistory()` (max 50 messages)
- After each AI response: `chatStorage.saveHistory(messages)`

### `lib/chatStorage.ts`
- `getHistory(): Promise<Message[]>` — AsyncStorage key `'aksha_chat_history'`
- `saveHistory(messages: Message[]): Promise<void>` — store last 50 messages

---

## 11. Navigation

### `app/(tabs)/muhurat.tsx`
New screen with `useMuhurat` hook. Event type selector (FlatList of chips: Business, Travel, Marriage, Medical, Learning, Other). Shows `MuhuratCard` once loaded.

### `components/ui/TabBar.tsx` changes
Add to `TAB_ICONS`: `muhurat: Clock` (from lucide-react-native)
Add to `TAB_LABELS`: `muhurat: 'MUHURAT'`

### `app/(tabs)/_layout.tsx` changes
Add `<Tabs.Screen name="muhurat" />`.

---

## 12. Error Handling

- Geocoding failure: return `{ error: 'Could not find location. Please update your birth place in Profile.' }` to client.
- Perplexity API error: log to console, return `{ error: 'Unable to fetch guidance. Try again.' }`.
- Profile missing birth data: `useDailyAlignment` returns `{ guidance: null, isLoading: false }` — screen shows "Add your birth details in Profile to unlock cosmic guidance."
- Streaming disconnection: mark message as complete with whatever tokens received.

---

## 13. New Dependencies

```
npm install astronomia @react-native-async-storage/async-storage
```

---

## 14. Out of Scope

- Real-time transit alerts / push notifications
- Dasha sub-period display UI (Antardasha only shown as text)
- Shadbala / planetary strength calculations
- Multiple house systems
- Paying to unlock premium muhurat windows
