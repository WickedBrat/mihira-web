import { toJDE, toSidereal } from './ayanamsha';
import {
  sunTropicalLongitude, moonTropicalLongitude, rahuTropicalLongitude, planetTropicalLongitude,
} from './ephemeris';
import { signIndex, signName, wholeSignHouse } from './houses';
import { getNakshatra } from './chart';
import { SIGNS, type PlanetName, type SignName } from './types';

export interface TransitPosition {
  name: PlanetName;
  sign: SignName;
  /** Whole Sign house counted from the natal Lagna. */
  house: number;
}

export interface TransitSnapshot {
  planets: TransitPosition[];
  moonNakshatra: string;
}

/** Sidereal (Lahiri) positions at an instant, placed in the natal chart's houses. */
export function getTransits(at: Date, natalLagna: SignName): TransitSnapshot {
  const jde = toJDE(
    at.getUTCFullYear(),
    at.getUTCMonth() + 1,
    at.getUTCDate(),
    at.getUTCHours() + at.getUTCMinutes() / 60,
  );
  const lagnaIdx = SIGNS.indexOf(natalLagna);
  const rahu = toSidereal(rahuTropicalLongitude(jde), jde);
  const moon = toSidereal(moonTropicalLongitude(jde), jde);

  const raw: { name: PlanetName; lng: number }[] = [
    { name: 'Sun', lng: toSidereal(sunTropicalLongitude(jde), jde) },
    { name: 'Moon', lng: moon },
    { name: 'Mercury', lng: toSidereal(planetTropicalLongitude(jde, 'Mercury'), jde) },
    { name: 'Venus', lng: toSidereal(planetTropicalLongitude(jde, 'Venus'), jde) },
    { name: 'Mars', lng: toSidereal(planetTropicalLongitude(jde, 'Mars'), jde) },
    { name: 'Jupiter', lng: toSidereal(planetTropicalLongitude(jde, 'Jupiter'), jde) },
    { name: 'Saturn', lng: toSidereal(planetTropicalLongitude(jde, 'Saturn'), jde) },
    { name: 'Rahu', lng: rahu },
    { name: 'Ketu', lng: (rahu + 180) % 360 },
  ];

  return {
    planets: raw.map(({ name, lng }) => ({
      name,
      sign: signName(lng),
      house: wholeSignHouse(signIndex(lng), lagnaIdx),
    })),
    moonNakshatra: getNakshatra(moon),
  };
}
