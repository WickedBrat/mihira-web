# Aksha — Deep Logic & Architecture

This document covers every significant logic system in the Aksha codebase — data flows, state machines, mathematical algorithms, and AI pipeline mechanics.

---

## 1. Full End-to-End Data Flow

### 1A. App Boot Sequence

```
[App Launch]
  → SplashScreen.preventAutoHideAsync()
  → useFonts() — loads 6 Lexend weights
  → fontsLoaded → SplashScreen.hideAsync()
  → ClerkProvider initializes session from SecureStore
  → Stack Navigator renders current route
     → If first launch: /onboarding/index
     → If authenticated: /(tabs)
```

### 1B. Daily Alignment Flow (Home Screen)

```
HomeScreen mounts
  → useDailyAlignment() runs
     → reads profile.birth_dt + profile.birth_place from useProfile()
     → if either is empty: returns empty state (shows "Add your birth details" prompt)
     → constructs profileKey = "{birth_dt}::{birth_place_lowercase}"
     → getCachedDailyAlignment(profileKey)
        → reads AsyncStorage key 'aksha_daily_alignment'
        → if exists and dateKey === today AND profileKey matches → returns cached data instantly
        → else → cache miss
     → on cache miss: POST /api/wisdom/daily
        → body: { birthDt, birthPlace }
    
[SERVER: /api/wisdom/daily+api.ts]
  → geocode(birthPlace) → Nominatim API → { lat, lng }
  → buildBirthChart(birthDt, lat, lng)
     → parseBirthDt(birthDt) → { year, month, day, hour, minute }
     → utOffset = lng / 15 (timezone approximation from longitude)
     → hourUT = hour + minute/60 - utOffset
     → jde = toJDE(year, month, day, hourUT)
     → compute all 9 sidereal planet positions
     → compute ascendant (lagna)
     → derive nakshatra from Moon position
     → derive current Dasha cycle
     → returns { lagna, lagnaLongitude, planets[], nakshatra, currentDasha }
  → perplexityChat('sonar-pro', [DAILY_SYSTEM, buildDailyPrompt(chart)])
     → receives raw JSON string
  → parseModelJson(raw, ['summary', 'highlights', 'reasoning'])
  → returns { chart, summary, highlights[], reasoning }

[CLIENT: useDailyAlignment.ts]
  → receives response
  → saveCachedDailyAlignment(profileKey, payload)
     → writes to AsyncStorage with today's dateKey
  → setState → triggers DailyAlignmentCard re-render
     → shows WordReveal animation for summary
     → renders TimelineItem list for highlights
     → shows VedicReasoningAccordion for reasoning
```

### 1C. Muhurat Flow

```
MuhuratScreen
  → user fills eventDescription + startDate + endDate
  → presses "Find Auspicious Windows"
  → validates: eventDescription must be non-empty
  → setRequest({ eventDescription, startDate: ISO, endDate: ISO })
  → useMuhurat(request) triggers useEffect (request is dependency)
     → POST /api/wisdom/muhurat
        → body: { birthDt, birthPlace, eventDescription, startDate, endDate }

[SERVER: /api/wisdom/muhurat+api.ts]
  → validates: all 5 fields required
  → validates: date range ≤ 14 days
  → geocode(birthPlace) → { lat, lng }
  → buildBirthChart(birthDt, lat, lng) → BirthChart
  → getMuhuratWindowsForRange(start, end, lat, lng, eventDescription)
     → iterates each day in range
     → getMuhuratWindows(date, lat, lng, eventType) per day:
        → sunriseSunset(date, lat, lng) → { sunrise, sunset }
        → splits day into 8 equal Chaughadiya periods
        → splits night into 8 equal Chaughadiya periods
        → computes Abhijit Muhurat (noon ± 24 min), skips Wednesdays
        → returns 16–17 MuhuratWindow objects per day
  → filters to auspicious ones → builds prompt string
  → perplexityChat('sonar-pro', [MUHURAT_SYSTEM, buildMuhuratPrompt(...)])
  → parseModelJson(raw, ['recommendation', 'suggestion', 'reasoning'])
  → returns { windows, recommendation, suggestion, reasoning }

[CLIENT: useMuhurat.ts → MuhuratCard]
  → recommendation badge: Yes (green) / No (red) / Wait (yellow)
  → suggestion text
  → list of auspicious windows (type: abhijit has orange border highlight)
  → VedicReasoningAccordion for technical explanation
```

### 1D. Ask Aksha (Chat) Flow

```
User types message → presses send
  → sendMessage(text) in useChatState
  → if isTyping: return (prevents double-send)
  → adds user Message to local state
  → creates empty AI message placeholder in state
  → POST /api/chat
     → includes last 10 messages as history (excluding welcome message)

[SERVER: /api/chat+api.ts]
  → constructs messages array:
     [{ role: 'system', CHAT_SYSTEM }, ...history[-10], { role: 'user', message }]
  → calls perplexityStream('sonar', messages, onChunk)
  → each chunk: writes "data: { token: '...' }\n\n" to SSE stream
  → when done: writes "data: [DONE]\n\n"

[CLIENT: useChatState.ts]
  → reads SSE stream line-by-line
  → on each "data: { token }" event: appends to fullText, updates the AI message in state
  → on "[DONE]": stops reading, calls saveHistory(messages) → AsyncStorage (last 50)
  → on error: AbortError is silenced; other errors update the AI message text with error
  → finally: setIsTyping(false)
```

---

## 2. The Vedic Math Engine (`lib/vedic/`)

This is a full local astronomical computation engine — no external ephemeris API is used.

### 2A. Time System: Julian Ephemeris Day (`ayanamsha.ts`)

**`toJDE(year, month, day, hourUT)`**

Converts a calendar date to Julian Day Number (JDE). Uses the standard Gregor/Julian calendar algorithm from Jean Meeus' *Astronomical Algorithms*:

```
Y = year (adjusted for months ≤ 2)
M = month (adjusted for months ≤ 2)
A = floor(Y / 100)
B = 2 - A + floor(A / 4)   ← Gregorian correction
JDE = floor(365.25 * (Y + 4716)) + floor(30.6001 * (M+1)) + day + hourUT/24 + B - 1524.5
```

JDE is the single time basis for all subsequent calculations. J2000.0 epoch = JDE 2451545.0.

**`parseBirthDt(birthDt)`**

Parses the app's birth datetime string format `"DD/MM/YYYY, HH:MM AM/PM"` into individual `{ year, month, day, hour, minute }` values. Handles 12-hour AM/PM conversion to 24-hour.

### 2B. Sidereal Correction (`ayanamsha.ts`)

**`lahiriAyanamsha(jde)`**

Computes the Lahiri ayanamsha (sidereal—tropical offset) at a given JDE:
```
T = (jde - 2451545.0) / 36525    ← Julian centuries from J2000
ayanamsha = 23.85 + T * (50.3 / 3600)   ← linear drift of ~50 arcsec/year
```
At J2000.0 the offset is ~23.85°; it grows ~0.0001396°/year.

**`toSidereal(tropicalDeg, jde)`**

Subtracts the ayanamsha from a Tropical longitude and normalizes to 0–360°:
```
sidereal = ((tropical - lahiriAyanamsha(jde)) % 360 + 360) % 360
```

### 2C. Planetary Position Engine (`ephemeris.ts`)

All calculations use `T = (JDE - 2451545.0) / 36525` (Julian centuries from J2000.0).

**`sunTropicalLongitude(jde)`** — Meeus Ch. 25, ~0.01° accuracy:
```
L0 = 280.46646 + 36000.76983 * T          ← mean longitude
M  = 357.52911 + 35999.05029*T - 0.0001537*T²  ← mean anomaly (normalized)
C  = (1.914602 - 0.004817*T - 0.000014*T²)*sin(M)
   + (0.019993 - 0.000101*T)*sin(2M)
   + 0.000289*sin(3M)                      ← equation of center
sunLng = norm360(L0 + C)
```

**`moonTropicalLongitude(jde)`** — Simplified Meeus Ch. 47, ~1° accuracy:
Uses 5 fundamental angular arguments (Lp, M, Ms, D, F) and 10 trigonometric correction terms for gravitational perturbations from the Sun.

**`rahuTropicalLongitude(jde)`** — Mean ascending node:
```
rahu = norm360(125.0445 - 1934.1363*T + 0.0020754*T²)
```
Ketu is always `(rahu + 180) % 360`.

**`planetTropicalLongitude(jde, planet)`** — Geocentric position for Mercury, Venus, Mars, Jupiter, Saturn. Uses Keplerian orbital elements:

| Planet  | L0 (°)  | L1 (°/century) | a (AU)  | e       | ω (°)   |
|---------|---------|----------------|---------|---------|---------|
| Mercury | 252.25  | 149474.07      | 0.38710 | 0.20563 | 77.456  |
| Venus   | 181.98  | 58519.21       | 0.72333 | 0.00677 | 131.563 |
| Mars    | 355.43  | 19141.70       | 1.52366 | 0.09340 | 336.041 |
| Jupiter | 34.35   | 3036.30        | 5.20336 | 0.04849 | 14.331  |
| Saturn  | 50.08   | 1223.51        | 9.53707 | 0.05550 | 93.057  |

Steps per planet:
1. `L = norm360(L0 + L1*T)` — mean longitude
2. `M = norm360(L - ω)` — mean anomaly
3. `C = eqCenter(M, e)` — equation of center (two-term Kepler approximation)
4. `trueLon = norm360(L + C)` — heliocentric true longitude
5. `v = norm360(trueLon - ω)` — true anomaly
6. `r = a*(1-e²)/(1 + e*cos(v))` — heliocentric distance
7. Convert to geocentric X,Y vectors relative to Earth's position:
   ```
   X = r*cos(trueLon) - earthR*cos(earthLon)
   Y = r*sin(trueLon) - earthR*sin(earthLon)
   geocentricLng = atan2(Y, X)
   ```

**`ascendantTropical(jde, lat, lng)`** — Rising sign (Ascendant):
1. Compute GMST (Greenwich Mean Sidereal Time) at the Julian date
2. Add observer's longitude to get LST (Local Sidereal Time)
3. Use the standard formula:
   ```
   ASC = atan2(-cos(RAMC), sin(ε)*tan(φ) + cos(ε)*sin(RAMC))
   ```
   where RAMC = Local Sidereal Time in radians, ε = obliquity of ecliptic, φ = latitude

### 2D. Houses & Signs (`houses.ts`, `types.ts`)

The app uses **Whole Sign Houses** — the simplest traditional Indian system:
- Each zodiac sign (30°) is one house
- The Lagna sign is House 1, the next sign is House 2, etc.

```typescript
signIndex(deg) = floor(((deg % 360) + 360) % 360 / 30)   // 0-11
signName(deg)  = SIGNS[signIndex(deg)]                     // "Aries" ... "Pisces"
wholeSignHouse(planetSignIndex, lagnaSignIndex) = ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1
```

The 12 SIGNS array: `['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']`

### 2E. Nakshatra (`chart.ts`)

27 nakshatras span 360°, so each occupies 360/27 ≈ 13.33°:
```typescript
nakshatraIndex = floor(moonSidLng / (360/27)) % 27
nakshatra = NAKSHATRAS[nakshatraIndex]
```

The 27 nakshatra names are hardcoded in the `NAKSHATRAS` array in `chart.ts` (and also re-exported for use in onboarding step 7).

### 2F. Vimshottari Dasha System (`dasha.ts`)

The Vimshottari system assigns a 120-year planetary rulership cycle to each human life. It is calculated from the Moon's position.

**Dasha Lord Sequence** (always in this fixed order):
`Ketu(7y) → Venus(20y) → Sun(6y) → Moon(10y) → Mars(7y) → Rahu(18y) → Jupiter(16y) → Saturn(19y) → Mercury(17y)`

**Algorithm:**

1. Find which Nakshatra the Moon occupies at birth: `nakshatraIdx = floor(moonSid / (360/27))`
2. The Dasha lord is `LORDS[nakshatraIdx % 9]` (maps nakshatra to lord via mod 9)
3. Fraction consumed in that Nakshatra at birth: `posInNakshatra = (moonSid % (360/27)) / (360/27)`
4. Remaining years of the first Dasha: `yearsRemaining = YEARS[lord] * (1 - posInNakshatra)`
5. Build a chronological sequence of up to 11 Maha Dashas from birth date
6. Find `today`'s active Maha Dasha by date-range lookup
7. **Sub-period (Antar Dasha)**: Sub-periods within a Maha are proportional sub-slices of the Maha's total duration, following the same lord sequence rotated from the Maha lord:
   ```
   antarDuration = mahaDurationMs * (YEARS[antarLord] / 120)
   ```
8. Returns `"MahaLord-AntarLord"` string e.g. `"Jupiter-Mars"`

### 2G. Chart Assembly (`chart.ts`)

`buildBirthChart(birthDt, lat, lng)` orchestrates the full pipeline:

```
parseBirthDt → year, month, day, hour, minute
utOffset = lng / 15
hourUT = hour + minute/60 - utOffset
jde = toJDE(year, month, day, hourUT)

sunSid   = toSidereal(sunTropicalLongitude(jde), jde)
moonSid  = toSidereal(moonTropicalLongitude(jde), jde)
rahuSid  = toSidereal(rahuTropicalLongitude(jde), jde)
ketuSid  = (rahuSid + 180) % 360
mercSid  = toSidereal(planetTropicalLongitude(jde, 'Mercury'), jde)
venusSid = toSidereal(planetTropicalLongitude(jde, 'Venus'), jde)
marsSid  = toSidereal(planetTropicalLongitude(jde, 'Mars'), jde)
jupSid   = toSidereal(planetTropicalLongitude(jde, 'Jupiter'), jde)
satSid   = toSidereal(planetTropicalLongitude(jde, 'Saturn'), jde)
ascSid   = toSidereal(ascendantTropical(jde, lat, lng), jde)

lagnaSignIdx = signIndex(ascSid)
lagna = SIGNS[lagnaSignIdx]

planets[] = for each planet: {
  name, longitude: siderealDeg,
  sign: signName(siderealDeg),
  house: wholeSignHouse(signIndex(siderealDeg), lagnaSignIdx)
}

nakshatra = getNakshatra(moonSid)
currentDasha = getCurrentDasha(moonSid, birthDate, now)

return { lagna, lagnaLongitude, planets, nakshatra, currentDasha }
```

**Note on timezone**: The app uses `lng / 15` as UTC offset approximation. This is a simplification (doesn't account for political timezone boundaries or DST), but is standard practice in Vedic astrology software where precision is secondary to consistency.

### 2H. Muhurat Calculator (`muhurat.ts`)

**Sunrise/Sunset calculation:**

Uses the Equation of Time (`EoT`) to find accurate solar noon, then computes half the day-arc:

```
declination = arcsin(sin(ε) * sin(sunLng))   ← solar declination
H = arccos(-tan(lat) * tan(declination))       ← hour angle at horizon
EoT = (4 terms of Fourier approximation) * (180/π) * 4  ← minutes
noon = 12 - (lng/15) - (EoT/60)               ← solar noon in UTC hours
sunrise = noon - H/15
sunset  = noon + H/15
```

**Chaughadiya sequence:**

The 7-period Hindu day-quality sequence is: `[Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog]`

Day-start index per weekday (Sun=0…Sat=6): `[0, 3, 6, 2, 5, 1, 4]`

For daytime periods: `quality = CHAUGHADIYA_SEQ[(dayStart + periodIndex) % 7]`
For nighttime periods: `startIdx = (dayStart + 5) % 7`, otherwise same formula.

Auspicious qualities are: `[Amrit, Shubh, Labh, Char]` — 4 of the 7.

**Abhijit Muhurat**: The "invincible" window around solar noon:
- Duration: solar noon ± 24 minutes
- Only available Monday–Saturday (Wednesday excluded — Wednesday is Budh/Mercury day which traditionally conflicts with Abhijit)

**Window Generation** for a range:
- Iterates each day in `[startDate, endDate]` inclusive
- Computes 8 day-periods + 8 night-periods + 0 or 1 Abhijit = 16–17 windows per day
- Returns all sorted by `start` ISO string

---

## 3. Geocoding (`lib/vedic/geocode.ts`)

Uses the **Nominatim** (OpenStreetMap) API:
```
GET https://nominatim.openstreetmap.org/search?q={place}&format=json&limit=1
User-Agent: aksha-app/1.0
```
Returns the first result's `lat` and `lon`. This is not authenticated and is rate-limited by OpenStreetMap's fair-use policy. A failed geocode throws an error that surfaces as a toast.

---

## 4. AI Inference Layer (`lib/ai/`)

### 4A. Perplexity Client (`perplexity.ts`)

Two modes:

**`perplexityChat(model, messages)`** — Full response at once:
- POST to `https://api.perplexity.ai/chat/completions`
- `stream: false`
- Returns `choices[0].message.content`
- Used for: Daily Alignment, Muhurat

**`perplexityStream(model, messages, onChunk)`** — Server-Sent Events:
- POST with `stream: true`
- Reads response body as a streaming `ReadableStream`
- Decodes each SSE line: `data: {choices[0].delta.content}`
- Calls `onChunk(token)` for each text fragment
- Terminates on `data: [DONE]`
- Used for: Chat (Ask Aksha)

### 4B. Prompt Engineering (`prompts.ts`)

**`DAILY_SYSTEM`** (system prompt for daily alignment):
> You are a master Jyotish pandit. You receive Ground Truth planetary data computed by a precise ephemeris engine. You NEVER move planets from the houses provided. You speak directly to the user in the second person using dharma-focused language — no fortune-teller clichés. Respond ONLY in valid JSON.

**`buildDailyPrompt(chart)`** — Injects:
- Lagna (ascendant sign)
- Current Dasha (e.g., "Jupiter-Mars")
- Moon Nakshatra
- All 9 planets with sign and house number

Requests 5 time blocks covering the full day with concrete ranges like "1:00 AM – 3:00 AM."

Output schema:
```json
{
  "summary": "2 sentences, dharma-focused",
  "highlights": [
    { "timeRange": "HH:MM – HH:MM", "activity": "...", "note": "..." }
  ],
  "reasoning": "2 sentences in technical Jyotish"
}
```

**`MUHURAT_SYSTEM`** (system prompt for muhurat):
> You are a master Jyotish pandit assessing muhurat for a specific event. You receive the user's birth chart and pre-calculated timing windows. You NEVER invent planets or change their house positions. Respond ONLY in valid JSON.

**`buildMuhuratPrompt(eventDescription, chart, windows, startDate, endDate)`** — Injects:
- User's stated intention
- Lagna, Dasha, Nakshatra (from chart)
- First 5 planetary positions
- All auspicious windows formatted as `"DD Mon YYYY, HH:MM – HH:MM: Quality"`

Output schema:
```json
{
  "recommendation": "Yes" | "No" | "Wait",
  "suggestion": "2 sentences naming strongest date/time",
  "reasoning": "2 sentences of Vedic technical reasoning"
}
```

**`CHAT_SYSTEM`** (system prompt for chat):
> You are Krishna, a wise and compassionate spiritual guide in Aksha. You speak with warmth, depth, and directness. You draw on the Bhagavad Gita, Upanishads, and Vedic philosophy. Never be preachy. Keep responses to 2–4 sentences unless the user asks to elaborate.

### 4C. Response Parsing (`parseModelJson.ts`)

LLMs frequently wrap JSON in markdown code fences or include commentary. This parser handles both:

**Step 1 — Strip markdown fences:**
```
/^```(?:json)?\s*([\s\S]*?)\s*```$/i
```
If matched, returns the inner content; otherwise returns raw trimmed string.

**Step 2 — Extract first valid JSON object:**
Character-by-character depth-tracking parser that:
- Handles string literals (ignores brackets inside strings)
- Handles escape sequences (`\"` inside strings)
- Tracks `{}` nesting depth
- Extracts exactly the first complete top-level object

**Step 3 — Validate required keys:**
Tries to `JSON.parse()` both the stripped string and the extracted object. Validates that all `requiredKeys` are present in the result. Throws `'AI response parse error'` if both attempts fail.

---

## 5. Profile System (`features/profile/useProfile.ts`)

The profile hook is the central state manager for user data. It integrates Clerk auth, Supabase backend, and local React state.

### 5A. State Architecture

```typescript
ProfileData = {
  name: string;
  birth_dt: string;         // "DD/MM/YYYY, HH:MM AM"
  birth_place: string;
  language: 'English' | 'Hindi';
  region: string;           // default: 'India'
  focus_area: string;
}
```

Key refs used to prevent runaway saves:
- `isLoadedFromDB` — gates auto-save until initial fetch completes
- `skipNextSave` — used to suppress the auto-save that would otherwise fire when `profile` state is set after loading from DB or after `saveField()` is called
- `debounceRef` — 800ms debounce timer for auto-save
- `hasWarnedSyncUnavailable` — prevents repeated error toasts per auth session

### 5B. Supabase Client Factory

`getSupabaseClient(getToken)` builds a Supabase client on-demand with:
- No persistent session (Clerk is the identity layer)
- `accessToken: getToken` — Supabase uses this to inject the JWT into every request header at RLS level

The token is retrieved via `session.getToken()`, falling back to `session.getToken({ template: 'supabase' })`. If neither yields a token, an error toast is shown and `null` is returned — causing the profile operation to skip gracefully.

### 5C. Load/Save Lifecycle

**On sign-in (useEffect watches isSignedIn, userId, session):**
1. Upsert `{ id: userId }` to create the row if it doesn't exist (`ignoreDuplicates: true`)
2. Select `*` for the user's row
3. Set `skipNextSave = true` before setState (prevents the load triggering immediate re-save)
4. Update local React state with DB values

**On field update (`updateField`):**
- Only updates local React state — no DB call
- Triggers the auto-save debounce (500ms later resolves if no other changes)

**On explicit save (`saveField`):**
- Clears any pending debounce
- Sets `skipNextSave = true` (prevents double-save)
- Updates React state
- Immediately calls `persistFields({ [key]: value })`

**Auto-save (useEffect watches profile):**
- Skips if `skipNextSave` is set (resets it and returns)
- Otherwise, debounces 800ms then calls `persistFields(profile)` — saves the entire profile

**`persistFields(fields)`:**
- Upserts the given partial `ProfileData` into Supabase `profiles` table
- Sets `updated_at` to now
- Shows success toast (rate-limited to once per 3.2 seconds to avoid spam)

### 5D. Error Handling

`getSyncUnavailableMessage()` maps common error strings to human-readable messages:
- Missing Supabase env var → tells user to restart Expo
- Empty Clerk session token → tells user to sign out and back in
- Native API disabled → links to Clerk Dashboard action needed
- Network error → connectivity advice

---

## 6. Chat State Machine (`features/chat/useChatState.ts`)

### State

```typescript
messages: Message[]    // All chat messages, loaded from AsyncStorage on mount
isTyping: boolean      // AI is streaming a response
inputText: string      // Controlled text input value
```

### Send Flow

1. Guard: if `isTyping || !text.trim()` → return
2. Append `userMsg` to messages
3. Append empty `aiMsg` placeholder to messages
4. Create `AbortController` (stored in `abortRef`)
5. POST `/api/chat` with last 10 non-welcome messages as history
6. Stream-read the response line-by-line:
   - Each `data: { token }` line: append `token` to `fullText`, update the `aiMsg` in state using `.map()` on messages array
   - On `[DONE]`: cancel reader, exit loop
7. After streaming: call `saveHistory(messages)` → AsyncStorage (trims to last 50)
8. On `AbortError`: silently return (user navigated away)
9. On other errors: replace `aiMsg.text` with the error string
10. Finally: `setIsTyping(false)`

**History sent to API**: Messages are mapped as `role: 'user'|'assistant'` (Perplexity format), filtering out the hardcoded welcome message.

---

## 7. Storage Layer

### AsyncStorage Keys

| Key                      | Module                  | Content                                          |
|--------------------------|-------------------------|--------------------------------------------------|
| `aksha_daily_alignment`  | `dailyAlignmentStorage` | `{ dateKey, profileKey, chart, summary, highlights, reasoning }` |
| `aksha_profile_snapshot` | `profileStorage`        | `{ userId, profile, savedAt }`                   |
| `aksha_chat_history`     | `chatStorage`           | `Message[]` (last 50, timestamps as strings)     |

### Cache Invalidation Logic

**Daily Alignment**: Cache is valid only if:
1. `parsed.dateKey === today` (YYYY-MM-DD format)
2. `parsed.profileKey === current profileKey` (derived from birth_dt + birth_place)

This means a cache miss fires whenever: it's a new day OR the user changes their birth details.

**Profile Snapshot**: Valid only if `parsed.userId === currentUserId`. Cross-user protection.

**Chat History**: Never invalidated automatically; capped at 50 messages. On load, date strings are converted back to `Date` objects.

---

## 8. Onboarding Store (`lib/onboardingStore.ts`)

A simple module-level singleton (not React state, not AsyncStorage) that accumulates onboarding answers across the 12 screens:

```typescript
OnboardingData = {
  painPoints: string[];       // Step 2: multi-select
  persona: string | null;     // Step 3
  userName: string;           // Step 4
  birthDate: Date;            // Step 5
  birthTime: Date;            // Step 6
  birthPlace: string;         // Step 8
  unknownBirthTime: boolean;  // Step 9
  commitmentTier: string | null; // Step 10
  firstQuestion: string;      // Step 11
}
```

Data is accumulated with `setOnboardingData(partial)` which merges shallow. On step 12 completion, if the user is signed in, key fields are persisted to the profile (`name`, `birth_place`, `focus_area`) via `saveField()`.

**The Nakshatra Computation in Step 7** is done live in the UI without any API call. It uses the math from `ayanamsha.ts` and `ephemeris.ts` directly, with a try/catch fallback to `'Ashwini'/'Aries'`. The `NAKSHATRA_INSIGHTS` map in `onboardingStore.ts` holds all 27 Nakshatra descriptions.

---

## 9. Authentication Flow (`features/auth/useSignIn.ts`)

OAuth is handled via Clerk's `useOAuth` hook with two strategies:
- `oauth_google`
- `oauth_apple`

Both flows:
1. Call `startOAuthFlow()` — opens device browser via `expo-web-browser`
2. On successful redirect: `setActive({ session: createdSessionId })`
3. Call `onSuccess()` callback (closes the auth sheet in ProfileScreen)
4. On error: display error toast

`WebBrowser.maybeCompleteAuthSession()` is called at module level to clean up OAuth browser sessions.

Token caching (`lib/clerk.ts`): Clerk tokens are stored in `expo-secure-store` with `keychainAccessible: AFTER_FIRST_UNLOCK`. The `getToken`/`saveToken`/`clearToken` methods form the `TokenCache` interface. On get errors (e.g., corrupted keychain), the item is deleted and `null` is returned.

---

## 10. UI System Internals

### `AmbientBlob` Component Logic

Parses the `color` prop supporting two formats:
- `rgba(r, g, b, a)` → extracted via regex, used as SVG stop color and opacity
- `#rrggbbaa` / `#rrggbb` → hex extracted, alpha converted from 0-255 to 0-1

Renders an absolutely-positioned SVG with a `RadialGradient` (center full color → edge transparent), creating a soft circular light blob. The `zIndex: -1` ensures it always appears behind content.

### `TabBar` Animation

Tracks the active tab index and the container's measured pixel width to calculate slot positions:
```
slotWidth = (barWidth - BAR_PADDING*2) / totalTabs
selectorX = withSpring(activeIndex * slotWidth + SELECTOR_HORIZONTAL_INSET, SPRING)
```
Spring params: `damping: 22, stiffness: 240, mass: 0.85` — tuned for quick but not snappy feel.

### `VedicReasoningAccordion` Animation

Uses a single `progress` shared value (0–1):
- `maxHeight`: interpolated from 0 to 200 (collapses/expands content area)
- `opacity`: same progress value
- Chevron rotation: `0deg` → `180deg` 
- Duration: 250ms `withTiming`

### `ToastProvider` Animation

Two parallel Reanimated animations on `showToast`:
- `opacity`: 0 → 1 over 220ms (Easing.out cubic)
- `translateY`: -18 → 0 over 220ms (slides down from above)
On auto-hide or press: reverse animation over 180ms, then `setToast(null)`.

### `DailyAlignmentCard` — `WordReveal` Animation

Splits the summary text into words and uses `setInterval` at 80ms cadence to increment a `visible` counter. Renders `words.slice(0, visible).join(' ')` creating a typewriter word-by-word reveal effect.

### Onboarding Step 12 — Long Press Interaction

The "Hold to Enter" button runs a 16ms interval (60fps) from `pressIn` to `pressOut`:
```
progress = min((Date.now() - startTime) / 2000, 1)
```
Haptic milestones: Light at 25%, Medium at 55%, Heavy at 80%, Success on completion.
Multiple animated views react to progress:
- Outer ring: scales from 1x → 2.4x, fades out → dramatic ripple effect
- Mid ring: scales 1x → 1.6x, partial opacity
- Button fill overlay: fades from invisible → nearly opaque (saffron fill)
- Label text: fades out as progress increases
- Crescent moon symbol: fades in as progress increases
On release before 100%: `progress.value = withTiming(0, ...)` — smoothly resets.

---

## 11. `birth_dt` Format Contract

The birth datetime is stored and transmitted as a localized string: `"DD/MM/YYYY, HH:MM AM/PM"`

Example: `"01/03/1995, 10:30 AM"`

This string is:
- Created by `formatBirthDateTime(date)` in `features/profile/utils.ts`
- Parsed by `parseBirthDt(birthDt)` in `lib/vedic/ayanamsha.ts`
- Displayed in the profile field with placeholder `"DD/MM/YYYY, HH:MM AM"`
- Stored verbatim in Supabase `profiles.birth_dt`
- Used as part of the `profileKey` for daily alignment cache (`birth_dt::birth_place`)

This coupled format means **any change to either component** invaliates the daily alignment cache and triggers a fresh AI generation.
