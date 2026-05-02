import { parseBirthDt, toJDE, toSidereal } from './ayanamsha';
import { moonTropicalLongitude } from './ephemeris';
import { getNakshatra } from './chart';
import { SIGNS, type SignName } from './types';

export interface MoonProfile {
  nakshatra: string;
  rashi: SignName;
}

const DEFAULT_MOON_PROFILE: MoonProfile = {
  nakshatra: 'Ashwini',
  rashi: 'Aries',
};

export function deriveMoonProfile(
  birthDate: Date,
  birthTime: Date,
  unknownTime = false
): MoonProfile {
  try {
    const dateTime = new Date(birthDate);
    dateTime.setHours(birthTime.getHours(), birthTime.getMinutes(), 0, 0);

    const hourUT = unknownTime
      ? 6
      : dateTime.getUTCHours() + dateTime.getUTCMinutes() / 60;
    const jde = toJDE(
      dateTime.getUTCFullYear(),
      dateTime.getUTCMonth() + 1,
      dateTime.getUTCDate(),
      hourUT
    );
    const moonSid = toSidereal(moonTropicalLongitude(jde), jde);
    const rashiIndex = Math.floor(moonSid / 30) % 12;

    return {
      nakshatra: getNakshatra(moonSid),
      rashi: SIGNS[rashiIndex] ?? 'Aries',
    };
  } catch {
    return DEFAULT_MOON_PROFILE;
  }
}

export function deriveMoonProfileFromBirthDt(birthDt: string): MoonProfile | null {
  if (!birthDt) return null;

  try {
    const { year, month, day, hour, minute } = parseBirthDt(birthDt);
    const birthDate = new Date(year, month - 1, day);
    const birthTime = new Date(year, month - 1, day, hour, minute);

    return deriveMoonProfile(birthDate, birthTime);
  } catch {
    return null;
  }
}
