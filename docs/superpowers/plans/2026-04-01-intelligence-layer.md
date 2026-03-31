# Aksha Intelligence Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Vedic math engine + Perplexity AI to power Daily Alignment, Muhurat Finder (new tab), and real Ask Krishna chat.

**Architecture:** Server-side Expo API routes compute Ground Truth (planetary positions, houses, dashas, muhurat windows) then pass structured JSON to Perplexity — AI only narrates, never infers chart data. Pure TypeScript math engine with no native dependencies.

**Tech Stack:** Pure TS ephemeris (Jean Meeus), Perplexity API (`sonar-pro` for wisdom, `sonar` for chat), `@react-native-async-storage/async-storage` for chat history, Reanimated + LinearGradient for glow UI.

---

### Task 1: Install dependencies + environment

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Install AsyncStorage**

```bash
cd /Users/Apple/projects/aksha
npx expo install @react-native-async-storage/async-storage
```

Expected: package added to dependencies.

- [ ] **Step 2: Add env var placeholder**

In `.env.example`, add after the existing lines:
```
PERPLEXITY_API_KEY=
```

- [ ] **Step 3: Add to your local `.env.local`**

```
PERPLEXITY_API_KEY=pplx-your-key-here
```

- [ ] **Step 4: Commit**

```bash
git add package.json .env.example
git commit -m "chore: add AsyncStorage dep and Perplexity env var"
```

---

### Task 2: Vedic types

**Files:**
- Create: `lib/vedic/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// lib/vedic/types.ts
export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Rahu' | 'Ketu';

export type SignName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const SIGNS: SignName[] = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
];

export interface PlanetPosition {
  name: PlanetName;
  longitude: number;   // 0–360 sidereal degrees
  sign: SignName;
  house: number;       // 1–12 Whole Sign
  isRetrograde?: boolean;
}

export interface BirthChart {
  lagna: SignName;
  lagnaLongitude: number;
  planets: PlanetPosition[];
  nakshatra: string;    // Moon's nakshatra name
  currentDasha: string; // e.g. "Jupiter-Mars"
}

export type ChaughadiyaQuality =
  'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Udveg' | 'Rog' | 'Kaal';

export interface MuhuratWindow {
  start: string;  // ISO datetime
  end: string;
  quality: string;
  type: 'abhijit' | 'chaughadiya';
  isAuspicious: boolean;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/vedic/types.ts
git commit -m "feat: add Vedic types"
```

---

### Task 3: Julian Day + Lahiri Ayanamsha

**Files:**
- Create: `lib/vedic/ayanamsha.ts`
- Create: `__tests__/lib/vedic/ayanamsha.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/ayanamsha.test.ts
import { toJDE, lahiriAyanamsha, toSidereal, parseBirthDt } from '@/lib/vedic/ayanamsha';

describe('toJDE', () => {
  it('returns 2451545.0 for J2000.0 (2000-Jan-1.5 UT)', () => {
    expect(toJDE(2000, 1, 1, 12)).toBeCloseTo(2451545.0, 1);
  });
  it('returns 2446895.5 for 1987-Apr-10 0h UT', () => {
    expect(toJDE(1987, 4, 10, 0)).toBeCloseTo(2446895.5, 1);
  });
});

describe('lahiriAyanamsha', () => {
  it('returns ~23.85 at J2000.0', () => {
    expect(lahiriAyanamsha(2451545.0)).toBeCloseTo(23.85, 1);
  });
});

describe('parseBirthDt', () => {
  it('parses DD/MM/YYYY, HH:MM AM format', () => {
    expect(parseBirthDt('15/08/1947, 12:00 AM')).toEqual({
      year: 1947, month: 8, day: 15, hour: 0, minute: 0,
    });
  });
  it('parses PM time correctly', () => {
    expect(parseBirthDt('01/01/1990, 03:30 PM')).toEqual({
      year: 1990, month: 1, day: 1, hour: 15, minute: 30,
    });
  });
  it('handles 12:00 PM as noon (12)', () => {
    expect(parseBirthDt('01/01/1990, 12:00 PM')).toMatchObject({ hour: 12 });
  });
  it('handles 12:00 AM as midnight (0)', () => {
    expect(parseBirthDt('01/01/1990, 12:00 AM')).toMatchObject({ hour: 0 });
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx jest __tests__/lib/vedic/ayanamsha.test.ts --no-coverage
```

Expected: FAIL — "Cannot find module '@/lib/vedic/ayanamsha'"

- [ ] **Step 3: Implement**

```typescript
// lib/vedic/ayanamsha.ts

export function toJDE(year: number, month: number, day: number, hourUT = 0): number {
  const Y = month > 2 ? year : year - 1;
  const M = month > 2 ? month : month + 12;
  const A = Math.trunc(Y / 100);
  const B = 2 - A + Math.trunc(A / 4);
  return (
    Math.trunc(365.25 * (Y + 4716)) +
    Math.trunc(30.6001 * (M + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

export function lahiriAyanamsha(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return 23.85 + T * (50.3 / 3600);
}

export function toSidereal(tropicalDeg: number, jde: number): number {
  return ((tropicalDeg - lahiriAyanamsha(jde)) % 360 + 360) % 360;
}

export function parseBirthDt(birthDt: string): {
  year: number; month: number; day: number; hour: number; minute: number;
} {
  const [datePart, timePart] = birthDt.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [timeStr, ampm] = timePart.split(' ');
  let [hour, minute] = timeStr.split(':').map(Number);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return { year, month, day, hour, minute };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/lib/vedic/ayanamsha.test.ts --no-coverage
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/vedic/ayanamsha.ts __tests__/lib/vedic/ayanamsha.test.ts
git commit -m "feat: Julian Day + Lahiri ayanamsha"
```

---

### Task 4: Ephemeris — Sun, Moon, Rahu, Planets, Ascendant

**Files:**
- Create: `lib/vedic/ephemeris.ts`
- Create: `__tests__/lib/vedic/ephemeris.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/ephemeris.test.ts
import {
  sunTropicalLongitude,
  moonTropicalLongitude,
  rahuTropicalLongitude,
  planetTropicalLongitude,
  ascendantTropical,
  norm360,
} from '@/lib/vedic/ephemeris';

const J2000 = 2451545.0;

describe('sunTropicalLongitude', () => {
  it('returns ~280.46 at J2000.0', () => {
    expect(sunTropicalLongitude(J2000)).toBeCloseTo(280.46, 0);
  });
  it('returns a value in [0, 360)', () => {
    const lng = sunTropicalLongitude(J2000);
    expect(lng).toBeGreaterThanOrEqual(0);
    expect(lng).toBeLessThan(360);
  });
});

describe('moonTropicalLongitude', () => {
  it('returns a value in [0, 360)', () => {
    const lng = moonTropicalLongitude(J2000);
    expect(lng).toBeGreaterThanOrEqual(0);
    expect(lng).toBeLessThan(360);
  });
  // Moon at J2000.0 is approximately 218° (reference: Meeus p.342)
  it('returns ~218 at J2000.0', () => {
    expect(moonTropicalLongitude(J2000)).toBeCloseTo(218, 0);
  });
});

describe('rahuTropicalLongitude', () => {
  it('returns ~125.04 at J2000.0', () => {
    expect(rahuTropicalLongitude(J2000)).toBeCloseTo(125.04, 0);
  });
});

describe('planetTropicalLongitude', () => {
  it('returns a value in [0,360) for each planet', () => {
    for (const planet of ['Mercury','Venus','Mars','Jupiter','Saturn'] as const) {
      const lng = planetTropicalLongitude(J2000, planet);
      expect(lng).toBeGreaterThanOrEqual(0);
      expect(lng).toBeLessThan(360);
    }
  });
});

describe('ascendantTropical', () => {
  it('returns a value in [0,360)', () => {
    // Mumbai coordinates, noon on 2000-Jan-1
    const asc = ascendantTropical(J2000, 19.076, 72.877);
    expect(asc).toBeGreaterThanOrEqual(0);
    expect(asc).toBeLessThan(360);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/vedic/ephemeris.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/vedic/ephemeris.ts

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

/** Sun's tropical ecliptic longitude (degrees). Meeus Ch.25, accurate ~0.01°. */
export function sunTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return norm360(L0 + C);
}

/** Moon's tropical ecliptic longitude (degrees). Simplified Meeus Ch.47, ~1° accuracy. */
export function moonTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const Lp = norm360(218.3165 + 481267.8813 * T);
  const M  = norm360(134.9634 + 477198.8676 * T);
  const Ms = norm360(357.5291 + 35999.0503  * T);
  const D  = norm360(297.8502 + 445267.1115 * T);
  const F  = norm360(93.2721  + 483202.0175 * T);
  const corr =
     6.2888 * Math.sin(toRad(M)) +
     1.2740 * Math.sin(toRad(2*D - M)) +
     0.6583 * Math.sin(toRad(2*D)) +
     0.2136 * Math.sin(toRad(2*M)) -
     0.1851 * Math.sin(toRad(Ms)) -
     0.1143 * Math.sin(toRad(2*F)) +
     0.0588 * Math.sin(toRad(2*D - 2*M)) +
     0.0572 * Math.sin(toRad(2*D - Ms - M)) +
     0.0533 * Math.sin(toRad(2*D + M)) +
     0.0459 * Math.sin(toRad(2*D - Ms));
  return norm360(Lp + corr);
}

/** Rahu's (mean ascending node) tropical longitude (degrees). */
export function rahuTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return norm360(125.0445 - 1934.1363 * T + 0.0020754 * T * T);
}

interface OrbitalElements {
  L0: number; L1: number; // mean longitude at J2000, deg/century
  a: number;              // semi-major axis (AU)
  e: number;              // eccentricity
  omega: number;          // longitude of perihelion (deg)
}

const ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: { L0: 252.2504, L1: 149474.0722, a: 0.38710, e: 0.20563, omega: 77.456  },
  Venus:   { L0: 181.9798, L1: 58519.2130,  a: 0.72333, e: 0.00677, omega: 131.563 },
  Mars:    { L0: 355.4332, L1: 19141.6965,  a: 1.52366, e: 0.09340, omega: 336.041 },
  Jupiter: { L0: 34.3515,  L1: 3036.3028,   a: 5.20336, e: 0.04849, omega: 14.331  },
  Saturn:  { L0: 50.0774,  L1: 1223.5110,   a: 9.53707, e: 0.05550, omega: 93.057  },
};

function eqCenter(Mdeg: number, e: number): number {
  const r = toRad(Mdeg);
  return toDeg((2*e - 0.25*e*e*e) * Math.sin(r) + 1.25*e*e * Math.sin(2*r));
}

/** Geocentric tropical ecliptic longitude for Mercury–Saturn (degrees, ~1–2° accuracy). */
export function planetTropicalLongitude(
  jde: number,
  planet: 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn'
): number {
  const T = (jde - 2451545.0) / 36525;
  const el = ELEMENTS[planet];
  const L = norm360(el.L0 + el.L1 * T);
  const M = norm360(L - el.omega);
  const C = eqCenter(M, el.e);
  const trueLon = norm360(L + C);
  const v = norm360(trueLon - el.omega);
  const r_p = el.a * (1 - el.e * el.e) / (1 + el.e * Math.cos(toRad(v)));

  // Earth's heliocentric position
  const sunLng = sunTropicalLongitude(jde);
  const earthLon = norm360(sunLng + 180);
  const M_sun = norm360(357.52911 + 35999.05029 * T);
  const earthR = 1.000140 - 0.016708 * Math.cos(toRad(M_sun)) - 0.000141 * Math.cos(toRad(2*M_sun));

  const X = r_p * Math.cos(toRad(trueLon)) - earthR * Math.cos(toRad(earthLon));
  const Y = r_p * Math.sin(toRad(trueLon)) - earthR * Math.sin(toRad(earthLon));
  return norm360(toDeg(Math.atan2(Y, X)));
}

/**
 * Ascendant tropical ecliptic longitude (degrees).
 * birthLng is used to estimate the local time → UT offset (LMT approximation).
 */
export function ascendantTropical(jde: number, lat: number, lng: number): number {
  const jd0 = Math.floor(jde - 0.5) + 0.5;
  const T = (jd0 - 2451545.0) / 36525;
  const gmst0 = norm360(100.4606184 + 36000.7700536 * T + 0.000387933 * T * T);
  const gmst = norm360(gmst0 + 360.985647 * (jde - jd0));
  const lst = norm360(gmst + lng);
  const RAMC = toRad(lst);
  const eps = toRad(23.439291111 - 0.013004167 * T);
  const latRad = toRad(lat);
  const asc = toDeg(Math.atan2(
    -Math.cos(RAMC),
    Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(RAMC)
  ));
  return norm360(asc);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/lib/vedic/ephemeris.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/vedic/ephemeris.ts __tests__/lib/vedic/ephemeris.test.ts
git commit -m "feat: pure-TS ephemeris (Sun, Moon, Rahu, planets, Ascendant)"
```

---

### Task 5: Whole Sign houses + Birth Chart assembly

**Files:**
- Create: `lib/vedic/houses.ts`
- Create: `lib/vedic/chart.ts`
- Create: `__tests__/lib/vedic/houses.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/houses.test.ts
import { wholeSignHouse, signIndex } from '@/lib/vedic/houses';

describe('signIndex', () => {
  it('returns 0 for 0°', () => expect(signIndex(0)).toBe(0));    // Aries
  it('returns 0 for 29.9°', () => expect(signIndex(29.9)).toBe(0));
  it('returns 1 for 30°', () => expect(signIndex(30)).toBe(1));  // Taurus
  it('returns 11 for 350°', () => expect(signIndex(350)).toBe(11)); // Pisces
});

describe('wholeSignHouse', () => {
  it('lagna and planet in same sign → house 1', () => {
    expect(wholeSignHouse(0, 0)).toBe(1);
  });
  it('planet 1 sign ahead of lagna → house 2', () => {
    expect(wholeSignHouse(1, 0)).toBe(2); // Taurus planet, Aries lagna
  });
  it('wraps correctly: planet at Pisces (11), lagna at Aries (0) → house 12', () => {
    expect(wholeSignHouse(11, 0)).toBe(12);
  });
  it('planet at Aries (0), lagna at Taurus (1) → house 12', () => {
    expect(wholeSignHouse(0, 1)).toBe(12);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/vedic/houses.test.ts --no-coverage
```

- [ ] **Step 3: Implement `lib/vedic/houses.ts`**

```typescript
// lib/vedic/houses.ts
import { SIGNS, type SignName } from './types';

export function signIndex(siderealDeg: number): number {
  return Math.floor(((siderealDeg % 360) + 360) % 360 / 30);
}

export function signName(siderealDeg: number): SignName {
  return SIGNS[signIndex(siderealDeg)];
}

export function wholeSignHouse(planetSignIndex: number, lagnaSignIndex: number): number {
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}
```

- [ ] **Step 4: Implement `lib/vedic/chart.ts`**

```typescript
// lib/vedic/chart.ts
import { toJDE, lahiriAyanamsha, toSidereal, parseBirthDt } from './ayanamsha';
import {
  sunTropicalLongitude, moonTropicalLongitude, rahuTropicalLongitude,
  planetTropicalLongitude, ascendantTropical,
} from './ephemeris';
import { signIndex, signName, wholeSignHouse } from './houses';
import { getCurrentDasha } from './dasha';
import { SIGNS, type BirthChart, type PlanetName, type PlanetPosition } from './types';

export async function buildBirthChart(
  birthDt: string,
  lat: number,
  lng: number
): Promise<BirthChart> {
  const { year, month, day, hour, minute } = parseBirthDt(birthDt);
  // Estimate UT from local time using longitude (LMT approximation)
  const utOffset = lng / 15;
  const hourUT = hour + minute / 60 - utOffset;
  const jde = toJDE(year, month, day, hourUT);

  const ayanamsha = lahiriAyanamsha(jde);

  const sunSid    = toSidereal(sunTropicalLongitude(jde), jde);
  const moonSid   = toSidereal(moonTropicalLongitude(jde), jde);
  const rahuSid   = toSidereal(rahuTropicalLongitude(jde), jde);
  const ketuSid   = ((rahuSid + 180) % 360 + 360) % 360;
  const mercSid   = toSidereal(planetTropicalLongitude(jde, 'Mercury'), jde);
  const venusSid  = toSidereal(planetTropicalLongitude(jde, 'Venus'),   jde);
  const marsSid   = toSidereal(planetTropicalLongitude(jde, 'Mars'),    jde);
  const jupSid    = toSidereal(planetTropicalLongitude(jde, 'Jupiter'), jde);
  const satSid    = toSidereal(planetTropicalLongitude(jde, 'Saturn'),  jde);
  const ascSid    = toSidereal(ascendantTropical(jde, lat, lng), jde);

  const lagnaSignIdx = signIndex(ascSid);
  const lagna = SIGNS[lagnaSignIdx];

  const raw: { name: PlanetName; lng: number }[] = [
    { name: 'Sun',     lng: sunSid   },
    { name: 'Moon',    lng: moonSid  },
    { name: 'Mercury', lng: mercSid  },
    { name: 'Venus',   lng: venusSid },
    { name: 'Mars',    lng: marsSid  },
    { name: 'Jupiter', lng: jupSid   },
    { name: 'Saturn',  lng: satSid   },
    { name: 'Rahu',    lng: rahuSid  },
    { name: 'Ketu',    lng: ketuSid  },
  ];

  const planets: PlanetPosition[] = raw.map(({ name, lng }) => ({
    name,
    longitude: lng,
    sign: signName(lng),
    house: wholeSignHouse(signIndex(lng), lagnaSignIdx),
  }));

  const birthDate = new Date(Date.UTC(year, month - 1, day, Math.round(hourUT)));
  const nakshatra = getNakshatra(moonSid);
  const currentDasha = getCurrentDasha(moonSid, birthDate, new Date());

  return { lagna, lagnaLongitude: ascSid, planets, nakshatra, currentDasha };
}

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
];

export function getNakshatra(moonSidLng: number): string {
  const idx = Math.floor(moonSidLng / (360 / 27));
  return NAKSHATRAS[idx % 27];
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npx jest __tests__/lib/vedic/houses.test.ts --no-coverage
```

- [ ] **Step 6: Commit**

```bash
git add lib/vedic/houses.ts lib/vedic/chart.ts __tests__/lib/vedic/houses.test.ts
git commit -m "feat: Whole Sign houses + birth chart assembly"
```

---

### Task 6: Vimshottari Dasha

**Files:**
- Create: `lib/vedic/dasha.ts`
- Create: `__tests__/lib/vedic/dasha.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/dasha.test.ts
import { getCurrentDasha, getNakshatraLord } from '@/lib/vedic/dasha';

describe('getNakshatraLord', () => {
  // nakshatra 0 = Ashwini → Ketu
  it('Ashwini (idx 0) → Ketu', () => expect(getNakshatraLord(0)).toBe('Ketu'));
  // nakshatra 1 = Bharani → Venus
  it('Bharani (idx 1) → Venus', () => expect(getNakshatraLord(1)).toBe('Venus'));
  // nakshatra 9 = Magha → Ketu (repeats cycle)
  it('Magha (idx 9) → Ketu', () => expect(getNakshatraLord(9)).toBe('Ketu'));
});

describe('getCurrentDasha', () => {
  it('returns a string in "X-Y" format', () => {
    const result = getCurrentDasha(10, new Date('1990-01-01'), new Date('2024-01-01'));
    expect(result).toMatch(/^\w+-\w+$/);
  });
  it('returns "Ketu-Ketu" style (valid lords only)', () => {
    const LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
    const [maha, antar] = getCurrentDasha(0, new Date('1990-01-01'), new Date('1991-01-01')).split('-');
    expect(LORDS).toContain(maha);
    expect(LORDS).toContain(antar);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/vedic/dasha.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/vedic/dasha.ts

const LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'] as const;
type Lord = typeof LORDS[number];
const YEARS: Record<Lord, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const TOTAL_YEARS = 120;

export function getNakshatraLord(nakshatraIndex: number): Lord {
  return LORDS[nakshatraIndex % 9];
}

export function getCurrentDasha(
  moonSidLng: number,
  birthDate: Date,
  today: Date
): string {
  const nakshatraIdx = Math.floor(moonSidLng / (360 / 27));
  const lordIdx = nakshatraIdx % 9;
  const lord = LORDS[lordIdx];

  // Fraction elapsed in the nakshatra at birth
  const posInNakshatra = (moonSidLng % (360 / 27)) / (360 / 27);
  // Years remaining in first mahadasha at birth
  const yearsRemaining = YEARS[lord] * (1 - posInNakshatra);

  // Build dasha sequence starting from birth
  const dashas: { lord: Lord; start: Date; end: Date }[] = [];
  let cursor = new Date(birthDate);

  // First partial dasha
  const firstEnd = new Date(cursor.getTime() + yearsRemaining * 365.25 * 86400000);
  dashas.push({ lord, start: new Date(cursor), end: firstEnd });
  cursor = firstEnd;

  // Subsequent full dashas
  for (let i = 1; i <= 10; i++) {
    const nextLord = LORDS[(lordIdx + i) % 9];
    const end = new Date(cursor.getTime() + YEARS[nextLord] * 365.25 * 86400000);
    dashas.push({ lord: nextLord, start: new Date(cursor), end });
    cursor = end;
  }

  // Find current mahadasha
  const maha = dashas.find(d => today >= d.start && today < d.end) ?? dashas[dashas.length - 1];
  const mahaLordIdx = LORDS.indexOf(maha.lord);

  // Build antardasha within maha
  const mahaDurationMs = maha.end.getTime() - maha.start.getTime();
  let antarCursor = new Date(maha.start);
  let currentAntar = maha.lord;
  for (let i = 0; i < 9; i++) {
    const antarLord = LORDS[(mahaLordIdx + i) % 9];
    const fraction = YEARS[antarLord] / TOTAL_YEARS;
    const antarEnd = new Date(antarCursor.getTime() + mahaDurationMs * fraction);
    if (today >= antarCursor && today < antarEnd) {
      currentAntar = antarLord;
      break;
    }
    antarCursor = antarEnd;
  }

  return `${maha.lord}-${currentAntar}`;
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx jest __tests__/lib/vedic/dasha.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/vedic/dasha.ts __tests__/lib/vedic/dasha.test.ts
git commit -m "feat: Vimshottari Dasha calculator"
```

---

### Task 7: Muhurat (Chaughadiya + Abhijit)

**Files:**
- Create: `lib/vedic/muhurat.ts`
- Create: `__tests__/lib/vedic/muhurat.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/muhurat.test.ts
import { getChaughadiya, CHAUGHADIYA_SEQ, DAY_START } from '@/lib/vedic/muhurat';

describe('getChaughadiya', () => {
  it('Sunday day period 0 is Udveg', () => {
    // Sunday = weekday 0, DAY_START[0] = 0 → Udveg
    const result = getChaughadiya(0, 0, false);
    expect(result.quality).toBe('Udveg');
    expect(result.isAuspicious).toBe(false);
  });
  it('Sunday day period 1 is Char', () => {
    expect(getChaughadiya(0, 1, false).quality).toBe('Char');
  });
  it('Monday day period 0 is Amrit (auspicious)', () => {
    const result = getChaughadiya(1, 0, false);
    expect(result.quality).toBe('Amrit');
    expect(result.isAuspicious).toBe(true);
  });
  it('Wednesday day period 0 is Labh (auspicious)', () => {
    expect(getChaughadiya(3, 0, false).isAuspicious).toBe(true);
    expect(getChaughadiya(3, 0, false).quality).toBe('Labh');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/vedic/muhurat.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/vedic/muhurat.ts
import type { ChaughadiyaQuality, MuhuratWindow } from './types';
import { sunTropicalLongitude } from './ephemeris';
import { toJDE } from './ayanamsha';

export const CHAUGHADIYA_SEQ: ChaughadiyaQuality[] =
  ['Udveg','Char','Labh','Amrit','Kaal','Shubh','Rog'];

// Day starting index per weekday (0=Sun … 6=Sat)
export const DAY_START = [0, 3, 6, 2, 5, 1, 4];

const AUSPICIOUS: ChaughadiyaQuality[] = ['Amrit','Shubh','Labh','Char'];

/** Get Chaughadiya for a given period index. isNight=true uses night sequence. */
export function getChaughadiya(
  weekday: number,   // 0=Sun…6=Sat
  periodIndex: number, // 0–7
  isNight: boolean
): { quality: ChaughadiyaQuality; isAuspicious: boolean } {
  const dayStart = DAY_START[weekday];
  const startIdx = isNight ? (dayStart + 5) % 7 : dayStart;
  const quality = CHAUGHADIYA_SEQ[(startIdx + periodIndex) % 7];
  return { quality, isAuspicious: AUSPICIOUS.includes(quality) };
}

function sunriseSunset(date: Date, lat: number, lng: number): { sunrise: Date; sunset: Date } {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const jde = toJDE(year, month, day, 12); // noon
  const T = (jde - 2451545.0) / 36525;

  const sunLng = sunTropicalLongitude(jde);
  const eps = (23.439291 - 0.013004 * T) * Math.PI / 180;
  const declination = Math.asin(Math.sin(eps) * Math.sin(sunLng * Math.PI / 180));
  const latRad = lat * Math.PI / 180;

  const cosH = -Math.tan(latRad) * Math.tan(declination);
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;

  // Equation of time (simplified)
  const L = (280.46646 + 36000.76983 * T) * Math.PI / 180;
  const M = (357.52911 + 35999.05029 * T) * Math.PI / 180;
  const e = 0.016708634 - 0.000042037 * T;
  const y = Math.pow(Math.tan(eps / 2), 2);
  const EoT = (y * Math.sin(2*L) - 2*e*Math.sin(M) + 4*e*y*Math.sin(M)*Math.cos(2*L)
    - 0.5*y*y*Math.sin(4*L) - 1.25*e*e*Math.sin(2*M)) * (180/Math.PI) * 4; // minutes

  const noon = 12 - (lng / 15) - (EoT / 60);
  const riseUT = noon - H / 15;
  const setUT  = noon + H / 15;

  const riseMs = Date.UTC(year, month-1, day) + riseUT * 3600000;
  const setMs  = Date.UTC(year, month-1, day) + setUT  * 3600000;
  return { sunrise: new Date(riseMs), sunset: new Date(setMs) };
}

/** Returns all MuhuratWindow[] for a given date + location, filtered to auspicious only. */
export function getMuhuratWindows(
  date: Date,
  lat: number,
  lng: number,
  eventType: string
): MuhuratWindow[] {
  const { sunrise, sunset } = sunriseSunset(date, lat, lng);
  const weekday = date.getUTCDay();
  const windows: MuhuratWindow[] = [];

  const dayDuration = sunset.getTime() - sunrise.getTime();
  const periodMs = dayDuration / 8;

  // Day periods
  for (let i = 0; i < 8; i++) {
    const { quality, isAuspicious } = getChaughadiya(weekday, i, false);
    const start = new Date(sunrise.getTime() + i * periodMs);
    const end   = new Date(sunrise.getTime() + (i + 1) * periodMs);
    windows.push({
      start: start.toISOString(), end: end.toISOString(),
      quality: `${quality} (${isAuspicious ? 'Auspicious' : 'Inauspicious'})`,
      type: 'chaughadiya', isAuspicious,
    });
  }

  // Night periods
  const nextSunrise = new Date(sunrise.getTime() + 24 * 3600000);
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const nightPeriodMs = nightDuration / 8;
  for (let i = 0; i < 8; i++) {
    const { quality, isAuspicious } = getChaughadiya(weekday, i, true);
    const start = new Date(sunset.getTime() + i * nightPeriodMs);
    const end   = new Date(sunset.getTime() + (i + 1) * nightPeriodMs);
    windows.push({
      start: start.toISOString(), end: end.toISOString(),
      quality: `${quality} (Night)`,
      type: 'chaughadiya', isAuspicious,
    });
  }

  // Abhijit Muhurat: solar noon ± 24 min (skip Wednesday)
  if (weekday !== 3) {
    const dayDur = sunset.getTime() - sunrise.getTime();
    const noon = new Date(sunrise.getTime() + dayDur / 2);
    windows.push({
      start: new Date(noon.getTime() - 24 * 60000).toISOString(),
      end:   new Date(noon.getTime() + 24 * 60000).toISOString(),
      quality: 'Excellent (Abhijit Muhurat)',
      type: 'abhijit', isAuspicious: true,
    });
  }

  return windows;
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx jest __tests__/lib/vedic/muhurat.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/vedic/muhurat.ts __tests__/lib/vedic/muhurat.test.ts
git commit -m "feat: Chaughadiya + Abhijit Muhurat calculator"
```

---

### Task 8: Geocode

**Files:**
- Create: `lib/vedic/geocode.ts`
- Create: `__tests__/lib/vedic/geocode.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/vedic/geocode.test.ts
import { geocode } from '@/lib/vedic/geocode';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('geocode', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns lat/lng from Nominatim response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [{ lat: '19.0760', lon: '72.8777' }],
    });
    const result = await geocode('Mumbai, India');
    expect(result).toEqual({ lat: 19.076, lng: 72.8777 });
  });

  it('throws when no results returned', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [] });
    await expect(geocode('xyznonexistentplace')).rejects.toThrow('Could not geocode');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/vedic/geocode.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/vedic/geocode.ts
export async function geocode(place: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'aksha-app/1.0' } });
  const data: { lat: string; lon: string }[] = await res.json();
  if (!data.length) throw new Error(`Could not geocode: ${place}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx jest __tests__/lib/vedic/geocode.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/vedic/geocode.ts __tests__/lib/vedic/geocode.test.ts
git commit -m "feat: Nominatim geocoding"
```

---

### Task 9: Perplexity AI client

**Files:**
- Create: `lib/ai/perplexity.ts`
- Create: `__tests__/lib/ai/perplexity.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/ai/perplexity.test.ts
import { perplexityChat } from '@/lib/ai/perplexity';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('perplexityChat', () => {
  beforeEach(() => mockFetch.mockReset());

  it('calls Perplexity API with correct headers', async () => {
    process.env.PERPLEXITY_API_KEY = 'test-key';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Hello' } }] }),
    });
    const result = await perplexityChat('sonar', [{ role: 'user', content: 'hi' }]);
    expect(result).toBe('Hello');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.perplexity.ai/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      })
    );
  });

  it('throws when API key missing', async () => {
    delete process.env.PERPLEXITY_API_KEY;
    await expect(perplexityChat('sonar', [])).rejects.toThrow('PERPLEXITY_API_KEY');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/ai/perplexity.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/ai/perplexity.ts

interface Message { role: string; content: string }

export async function perplexityChat(model: string, messages: Message[]): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not set');

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, stream: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

export async function perplexityStream(
  model: string,
  messages: Message[],
  onChunk: (token: string) => void
): Promise<void> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not set');

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!res.ok || !res.body) throw new Error(`Perplexity stream error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const token: string = json.choices?.[0]?.delta?.content ?? '';
        if (token) onChunk(token);
      } catch {}
    }
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx jest __tests__/lib/ai/perplexity.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/ai/perplexity.ts __tests__/lib/ai/perplexity.test.ts
git commit -m "feat: Perplexity AI client (chat + stream)"
```

---

### Task 10: AI Prompts

**Files:**
- Create: `lib/ai/prompts.ts`

- [ ] **Step 1: Create the prompts file**

```typescript
// lib/ai/prompts.ts
import type { BirthChart, MuhuratWindow } from '@/lib/vedic/types';

export const DAILY_SYSTEM = `You are a master Jyotish pandit. You receive Ground Truth planetary data computed by a precise ephemeris engine. You NEVER move planets from the houses provided. You speak directly to the user in the second person using dharma-focused language — no fortune-teller clichés. Respond ONLY in valid JSON with no markdown fences.`;

export function buildDailyPrompt(chart: BirthChart): string {
  return `Here is the user's Vedic birth chart (Whole Sign houses, Lahiri ayanamsha):

Lagna: ${chart.lagna}
Current Dasha: ${chart.currentDasha}
Moon Nakshatra: ${chart.nakshatra}

Planets:
${chart.planets.map(p => `  ${p.name}: ${p.sign} (House ${p.house})`).join('\n')}

Generate a Daily Alignment response. Return ONLY this JSON:
{
  "guidance": "<3 sentences of dharma-focused guidance for today>",
  "reasoning": "<2 sentences explaining the key astrological factors in technical Jyotish terms>"
}`;
}

export const MUHURAT_SYSTEM = `You are a master Jyotish pandit assessing muhurat (auspicious timing) for a specific event. You receive the user's birth chart and pre-calculated timing windows. You NEVER invent planets or change their house positions. Respond ONLY in valid JSON with no markdown fences.`;

export function buildMuhuratPrompt(
  eventType: string,
  chart: BirthChart,
  windows: MuhuratWindow[]
): string {
  const auspicious = windows.filter(w => w.isAuspicious);
  return `Event: ${eventType}

User's birth chart:
  Lagna: ${chart.lagna}, Dasha: ${chart.currentDasha}, Nakshatra: ${chart.nakshatra}
  Key planets: ${chart.planets.slice(0, 5).map(p => `${p.name} in House ${p.house}`).join(', ')}

Auspicious timing windows for today:
${auspicious.map(w => `  ${new Date(w.start).toTimeString().slice(0,5)}–${new Date(w.end).toTimeString().slice(0,5)}: ${w.quality}`).join('\n')}

Return ONLY this JSON:
{
  "recommendation": "Yes" | "No" | "Wait",
  "suggestion": "<2 sentences connecting the best window to the user's personal chart>",
  "reasoning": "<2 sentences of Vedic technical reasoning>"
}`;
}

export const CHAT_SYSTEM = `You are Krishna, a wise and compassionate spiritual guide in Aksha, a Vedic app for the Indian diaspora. You speak with warmth, depth, and directness. You draw on the Bhagavad Gita, Upanishads, and Vedic philosophy. Never be preachy. Keep responses to 2–4 sentences unless the user asks to elaborate.`;
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/ai/prompts.ts
git commit -m "feat: AI prompt templates (daily, muhurat, chat)"
```

---

### Task 11: Daily Alignment API route

**Files:**
- Create: `app/api/wisdom/daily+api.ts`

- [ ] **Step 1: Create the route**

```typescript
// app/api/wisdom/daily+api.ts
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';
import { perplexityChat } from '@/lib/ai/perplexity';
import { DAILY_SYSTEM, buildDailyPrompt } from '@/lib/ai/prompts';

export async function POST(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace } = await request.json() as {
      birthDt: string;
      birthPlace: string;
    };

    if (!birthDt || !birthPlace) {
      return Response.json({ error: 'birthDt and birthPlace are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: DAILY_SYSTEM },
      { role: 'user',   content: buildDailyPrompt(chart) },
    ]);

    let parsed: { guidance: string; reasoning: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    return Response.json({ chart, guidance: parsed.guidance, reasoning: parsed.reasoning });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[daily+api]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/wisdom/daily+api.ts
git commit -m "feat: Daily Alignment API route"
```

---

### Task 12: Muhurat API route

**Files:**
- Create: `app/api/wisdom/muhurat+api.ts`

- [ ] **Step 1: Create the route**

```typescript
// app/api/wisdom/muhurat+api.ts
import { geocode } from '@/lib/vedic/geocode';
import { buildBirthChart } from '@/lib/vedic/chart';
import { getMuhuratWindows } from '@/lib/vedic/muhurat';
import { perplexityChat } from '@/lib/ai/perplexity';
import { MUHURAT_SYSTEM, buildMuhuratPrompt } from '@/lib/ai/prompts';

export async function POST(request: Request): Promise<Response> {
  try {
    const { birthDt, birthPlace, eventType, date } = await request.json() as {
      birthDt: string;
      birthPlace: string;
      eventType: string;
      date?: string;
    };

    if (!birthDt || !birthPlace || !eventType) {
      return Response.json({ error: 'birthDt, birthPlace, and eventType are required' }, { status: 400 });
    }

    const { lat, lng } = await geocode(birthPlace);
    const chart = await buildBirthChart(birthDt, lat, lng);
    const targetDate = date ? new Date(date) : new Date();
    const windows = getMuhuratWindows(targetDate, lat, lng, eventType);

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: MUHURAT_SYSTEM },
      { role: 'user',   content: buildMuhuratPrompt(eventType, chart, windows) },
    ]);

    let parsed: { recommendation: string; suggestion: string; reasoning: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    return Response.json({
      windows,
      recommendation: parsed.recommendation,
      suggestion: parsed.suggestion,
      reasoning: parsed.reasoning,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[muhurat+api]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/wisdom/muhurat+api.ts
git commit -m "feat: Muhurat Finder API route"
```

---

### Task 13: Chat (Ask Krishna) streaming API route

**Files:**
- Create: `app/api/chat+api.ts`

- [ ] **Step 1: Create the route**

```typescript
// app/api/chat+api.ts
import { perplexityStream } from '@/lib/ai/perplexity';
import { CHAT_SYSTEM } from '@/lib/ai/prompts';

interface HistoryMessage { role: string; content: string }

export async function POST(request: Request): Promise<Response> {
  const { message, history = [] } = await request.json() as {
    message: string;
    history: HistoryMessage[];
  };

  const messages = [
    { role: 'system', content: CHAT_SYSTEM },
    ...history.slice(-10), // last 10 messages for context
    { role: 'user', content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await perplexityStream('sonar', messages, (token) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/chat+api.ts
git commit -m "feat: Ask Krishna streaming chat API route"
```

---

### Task 14: Chat storage (AsyncStorage)

**Files:**
- Create: `lib/chatStorage.ts`
- Create: `__tests__/lib/chatStorage.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/chatStorage.test.ts
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistory, saveHistory } from '@/lib/chatStorage';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;

describe('getHistory', () => {
  it('returns empty array when nothing stored', async () => {
    mockGet.mockResolvedValueOnce(null);
    expect(await getHistory()).toEqual([]);
  });
  it('parses stored JSON', async () => {
    const msgs = [{ id: '1', role: 'ai', text: 'Hi', timestamp: new Date().toISOString() }];
    mockGet.mockResolvedValueOnce(JSON.stringify(msgs));
    const result = await getHistory();
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hi');
  });
});

describe('saveHistory', () => {
  it('saves last 50 messages', async () => {
    mockSet.mockResolvedValueOnce(undefined);
    const msgs = Array.from({ length: 60 }, (_, i) => ({
      id: String(i), role: 'user' as const, text: `msg ${i}`, timestamp: new Date(),
    }));
    await saveHistory(msgs);
    const saved = JSON.parse((mockSet.mock.calls[0][1] as string));
    expect(saved).toHaveLength(50);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/lib/chatStorage.test.ts --no-coverage
```

- [ ] **Step 3: Implement**

```typescript
// lib/chatStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Message } from '@/features/chat/useChatState';

const KEY = 'aksha_chat_history';

export async function getHistory(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export async function saveHistory(messages: Message[]): Promise<void> {
  try {
    const trimmed = messages.slice(-50);
    await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('[chatStorage] save error', err);
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx jest __tests__/lib/chatStorage.test.ts --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add lib/chatStorage.ts __tests__/lib/chatStorage.test.ts
git commit -m "feat: chat history storage with AsyncStorage"
```

---

### Task 15: VedicReasoningAccordion component

**Files:**
- Create: `features/horoscope/VedicReasoningAccordion.tsx`

- [ ] **Step 1: Create the component**

```typescript
// features/horoscope/VedicReasoningAccordion.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolate,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';

interface Props { reasoning: string }

export function VedicReasoningAccordion({ reasoning }: Props) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = open ? 0 : 1;
    progress.value = withTiming(next, { duration: 250 });
    setOpen(!open);
  };

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, 200]),
    opacity: progress.value,
    overflow: 'hidden',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={toggle} style={styles.header}>
        <Text style={styles.label}>View Vedic Reasoning</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={14} color={colors.secondaryFixed} />
        </Animated.View>
      </Pressable>
      <Animated.View style={bodyStyle}>
        <Text style={styles.body}>{reasoning}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: 12,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    paddingTop: 10,
  },
});
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add features/horoscope/VedicReasoningAccordion.tsx
git commit -m "feat: VedicReasoningAccordion component"
```

---

### Task 16: DailyAlignmentCard component

**Files:**
- Create: `features/horoscope/DailyAlignmentCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// features/horoscope/DailyAlignmentCard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { colors, fonts } from '@/lib/theme';
import type { BirthChart } from '@/lib/vedic/types';

interface Props {
  guidance: string | null;
  reasoning: string | null;
  chart: BirthChart | null;
  isLoading: boolean;
  error: string | null;
}

function WordReveal({ text }: { text: string }) {
  const words = text.split(' ');
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= words.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <Text style={styles.guidanceText}>
      {words.slice(0, visible).join(' ')}
    </Text>
  );
}

export function DailyAlignmentCard({ guidance, reasoning, chart, isLoading, error }: Props) {
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(0.7, { duration: 3000 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Reading the cosmos…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!guidance) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>
          Add your birth details in Profile to unlock cosmic guidance.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Glow background */}
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <LinearGradient
          colors={['rgba(181, 100, 252, 0.08)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {chart && (
        <Text style={styles.lagnaLabel}>
          {chart.lagna} Rising · {chart.nakshatra} Moon · {chart.currentDasha}
        </Text>
      )}

      <WordReveal text={guidance} />

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(181,100,252,0.12)',
    overflow: 'hidden',
  },
  lagnaLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
    marginBottom: 12,
  },
  guidanceText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
    lineHeight: 26,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add features/horoscope/DailyAlignmentCard.tsx
git commit -m "feat: DailyAlignmentCard with Reanimated glow + word reveal"
```

---

### Task 17: useDailyAlignment hook

**Files:**
- Create: `features/horoscope/useDailyAlignment.ts`

- [ ] **Step 1: Create the hook**

```typescript
// features/horoscope/useDailyAlignment.ts
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { BirthChart } from '@/lib/vedic/types';

interface DailyAlignmentState {
  chart: BirthChart | null;
  guidance: string | null;
  reasoning: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useDailyAlignment(): DailyAlignmentState {
  const { profile } = useProfile();
  const [state, setState] = useState<DailyAlignmentState>({
    chart: null, guidance: null, reasoning: null, isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch('/api/wisdom/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthDt: profile.birth_dt, birthPlace: profile.birth_place }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setState(s => ({ ...s, isLoading: false, error: data.error }));
        } else {
          setState({
            chart: data.chart,
            guidance: data.guidance,
            reasoning: data.reasoning,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => {
        setState(s => ({ ...s, isLoading: false, error: err.message }));
      });
  }, [profile.birth_dt, profile.birth_place]);

  return state;
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add features/horoscope/useDailyAlignment.ts
git commit -m "feat: useDailyAlignment hook"
```

---

### Task 18: Update Horoscope screen

**Files:**
- Modify: `app/(tabs)/horoscope.tsx`

- [ ] **Step 1: Replace the static screen**

Replace the entire file content with:

```typescript
// app/(tabs)/horoscope.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { colors, fonts } from '@/lib/theme';

export default function HoroscopeScreen() {
  const { chart, guidance, reasoning, isLoading, error } = useDailyAlignment();

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(149, 0, 255, 0.08)" top={-60} left={200} size={300} />
      <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={500} left={-80} size={280} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.meta}>Celestial Alignment</Text>
          <Text style={styles.title}>Your Daily Alignment</Text>
          <Text style={styles.sub}>
            Ground truth from the stars. AI-guided dharma for today.
          </Text>
        </View>

        <DailyAlignmentCard
          guidance={guidance}
          reasoning={reasoning}
          chart={chart}
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
  content: { paddingTop: 150, paddingHorizontal: 24, paddingBottom: 160 },
  banner: { marginBottom: 24 },
  meta: {
    fontFamily: fonts.label, fontSize: 10, textTransform: 'uppercase',
    letterSpacing: 3, color: colors.secondaryFixed, marginBottom: 10,
  },
  title: {
    fontFamily: fonts.headlineExtra, fontSize: 36, color: colors.onSurface,
    letterSpacing: -0.5, lineHeight: 42, marginBottom: 12,
  },
  sub: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 22,
  },
});
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/horoscope.tsx
git commit -m "feat: replace static horoscope with DailyAlignmentCard"
```

---

### Task 19: MuhuratCard component

**Files:**
- Create: `features/muhurat/MuhuratCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// features/muhurat/MuhuratCard.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { VedicReasoningAccordion } from '@/features/horoscope/VedicReasoningAccordion';
import { colors, fonts } from '@/lib/theme';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface Props {
  recommendation: string | null;
  suggestion: string | null;
  reasoning: string | null;
  windows: MuhuratWindow[];
  isLoading: boolean;
  error: string | null;
}

const REC_COLORS: Record<string, string> = {
  Yes:  '#4ade80',
  No:   '#f87171',
  Wait: '#fbbf24',
};

export function MuhuratCard({ recommendation, suggestion, reasoning, windows, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Calculating auspicious timings…</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.card}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (!recommendation) return null;

  const recColor = REC_COLORS[recommendation] ?? colors.onSurface;

  return (
    <View style={styles.card}>
      {/* Recommendation badge */}
      <View style={[styles.badge, { borderColor: recColor }]}>
        <Text style={[styles.badgeText, { color: recColor }]}>{recommendation}</Text>
      </View>

      {suggestion && <Text style={styles.suggestion}>{suggestion}</Text>}

      {/* Auspicious windows */}
      <Text style={styles.windowsLabel}>Today's Auspicious Windows</Text>
      {windows.filter(w => w.isAuspicious).map((w, i) => (
        <View
          key={i}
          style={[styles.window, w.type === 'abhijit' && styles.windowAbhijit]}
        >
          <Text style={styles.windowTime}>
            {new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' – '}
            {new Date(w.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.windowQuality}>{w.quality}</Text>
        </View>
      ))}

      {reasoning && <VedicReasoningAccordion reasoning={reasoning} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: fonts.headlineExtra, fontSize: 18, letterSpacing: 1 },
  suggestion: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, lineHeight: 24,
  },
  windowsLabel: {
    fontFamily: fonts.label, fontSize: 9, letterSpacing: 2,
    textTransform: 'uppercase', color: colors.secondaryFixed,
  },
  window: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8,
  },
  windowAbhijit: { borderWidth: 1, borderColor: 'rgba(255,159,75,0.4)' },
  windowTime: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurface },
  windowQuality: { fontFamily: fonts.label, fontSize: 9, color: colors.secondaryFixed, letterSpacing: 1 },
  loadingText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', marginTop: 12,
  },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.error, textAlign: 'center' },
});
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add features/muhurat/MuhuratCard.tsx
git commit -m "feat: MuhuratCard component"
```

---

### Task 20: useMuhurat hook

**Files:**
- Create: `features/muhurat/useMuhurat.ts`

- [ ] **Step 1: Create the hook**

```typescript
// features/muhurat/useMuhurat.ts
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/useProfile';
import type { MuhuratWindow } from '@/lib/vedic/types';

interface MuhuratState {
  windows: MuhuratWindow[];
  recommendation: string | null;
  suggestion: string | null;
  reasoning: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMuhurat(eventType: string): MuhuratState {
  const { profile } = useProfile();
  const [state, setState] = useState<MuhuratState>({
    windows: [], recommendation: null, suggestion: null,
    reasoning: null, isLoading: false, error: null,
  });

  useEffect(() => {
    if (!profile.birth_dt || !profile.birth_place || !eventType) return;

    setState(s => ({ ...s, isLoading: true, error: null }));

    fetch('/api/wisdom/muhurat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDt: profile.birth_dt,
        birthPlace: profile.birth_place,
        eventType,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setState(s => ({ ...s, isLoading: false, error: data.error }));
        } else {
          setState({
            windows: data.windows,
            recommendation: data.recommendation,
            suggestion: data.suggestion,
            reasoning: data.reasoning,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => setState(s => ({ ...s, isLoading: false, error: err.message })));
  }, [profile.birth_dt, profile.birth_place, eventType]);

  return state;
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add features/muhurat/useMuhurat.ts
git commit -m "feat: useMuhurat hook"
```

---

### Task 21: Muhurat screen

**Files:**
- Create: `app/(tabs)/muhurat.tsx`

- [ ] **Step 1: Create the screen**

```typescript
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

        {/* Event type selector */}
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
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/muhurat.tsx features/muhurat/useMuhurat.ts
git commit -m "feat: Muhurat screen with event type selector"
```

---

### Task 22: Navigation — add Muhurat tab

**Files:**
- Modify: `components/ui/TabBar.tsx`
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Update TabBar.tsx**

In `components/ui/TabBar.tsx`, make these changes:

Change the import line:
```typescript
import { Home, Telescope, BookOpen, User } from 'lucide-react-native';
```
to:
```typescript
import { Home, Telescope, BookOpen, User, Clock } from 'lucide-react-native';
```

Change `TAB_ICONS`:
```typescript
const TAB_ICONS = {
  index:    Home,
  horoscope: Telescope,
  gurukul:  BookOpen,
  muhurat:  Clock,
  profile:  User,
} as const;
```

Change `TAB_LABELS`:
```typescript
const TAB_LABELS = {
  index:    'HOME',
  horoscope: 'COSMOS',
  gurukul:  'GURUKUL',
  muhurat:  'MUHURAT',
  profile:  'PROFILE',
} as const;
```

Update the FAB condition — change `showFab` from showing before `gurukul` to showing before `muhurat`:
```typescript
const showFab = tabName === 'muhurat';
```

- [ ] **Step 2: Update `app/(tabs)/_layout.tsx`**

```typescript
// app/(tabs)/_layout.tsx
import { View, StyleSheet } from 'react-native';
import { Tabs, useSegments } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';
import { AppHeader } from '@/components/ui/AppHeader';

export default function TabLayout() {
  const segments = useSegments();
  const hideAppHeader = (segments as readonly string[]).includes('profile');

  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="horoscope" />
        <Tabs.Screen name="gurukul" />
        <Tabs.Screen name="muhurat" />
        <Tabs.Screen name="profile" />
      </Tabs>
      {!hideAppHeader && <AppHeader />}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/TabBar.tsx app/\(tabs\)/_layout.tsx
git commit -m "feat: add Muhurat tab to navigation"
```

---

### Task 23: Upgrade useChatState to real streaming

**Files:**
- Modify: `features/chat/useChatState.ts`

- [ ] **Step 1: Replace the implementation**

Replace the entire `features/chat/useChatState.ts` with:

```typescript
// features/chat/useChatState.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { getHistory, saveHistory } from '@/lib/chatStorage';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'ai',
  text: "Welcome back to your sanctuary. I've been reflecting on our previous discussion about finding stillness. How is your mind feeling in this moment?",
  timestamp: new Date(),
};

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Load history from storage on mount
  useEffect(() => {
    getHistory().then(history => {
      if (history.length > 0) setMessages(history);
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setInputText('');

    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: Message = { id: aiMsgId, role: 'ai', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Build history for context (exclude welcome message)
      const historyForApi = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: historyForApi }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            reader.cancel();
            break;
          }
          try {
            const json = JSON.parse(data);
            if (json.token) {
              fullText += json.token;
              const captured = fullText;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, text: captured } : m)
              );
            }
          } catch {}
        }
      }

      // Persist to storage
      setMessages(prev => {
        saveHistory(prev);
        return prev;
      });
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const errMsg = err instanceof Error ? err.message : 'Connection error';
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, text: `(${errMsg})` } : m)
      );
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [messages, isTyping]);

  return { messages, isTyping, inputText, setInputText, sendMessage };
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Run all tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add features/chat/useChatState.ts
git commit -m "feat: upgrade Ask Krishna to real Perplexity streaming"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by task |
|---|---|
| Math engine (ephemeris, ayanamsha, houses, dasha, muhurat) | Tasks 3–7 |
| Geocoding | Task 8 |
| Perplexity client (chat + stream) | Task 9 |
| AI prompts (daily, muhurat, chat) | Task 10 |
| API routes (daily, muhurat, chat) | Tasks 11–13 |
| Chat storage (AsyncStorage) | Task 14 |
| VedicReasoningAccordion | Task 15 |
| DailyAlignmentCard (glow + word reveal) | Task 16 |
| useDailyAlignment hook | Task 17 |
| Horoscope screen update | Task 18 |
| MuhuratCard | Task 19 |
| useMuhurat hook | Task 20 |
| Muhurat screen + event chips | Task 21 |
| New Muhurat tab in navigation | Task 22 |
| Ask Krishna real streaming | Task 23 |
| `@react-native-async-storage` dep | Task 1 |
| PERPLEXITY_API_KEY env var | Task 1 |

**Placeholder scan:** None found. All steps contain concrete code.

**Type consistency:** `Message` type defined once in `useChatState.ts`, imported by `chatStorage.ts`. `BirthChart`, `MuhuratWindow` defined in `lib/vedic/types.ts`, imported consistently. `ChaughadiyaQuality` used in both `muhurat.ts` and `types.ts`.
