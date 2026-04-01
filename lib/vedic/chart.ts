import { toJDE, toSidereal, parseBirthDt } from './ayanamsha';
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
  const utOffset = lng / 15;
  const hourUT = hour + minute / 60 - utOffset;
  const jde = toJDE(year, month, day, hourUT);

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
