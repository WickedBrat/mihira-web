export function formatBirthDateTime(value: Date) {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  const rawHours = value.getHours();
  const minutes = String(value.getMinutes()).padStart(2, '0');
  const meridiem = rawHours >= 12 ? 'PM' : 'AM';
  const hours = rawHours % 12 || 12;

  return `${day}/${month}/${year}, ${hours}:${minutes} ${meridiem}`;
}

export function mergeDateAndTime(datePart: Date, timePart: Date) {
  return new Date(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate(),
    timePart.getHours(),
    timePart.getMinutes()
  );
}

import type { LucideIcon } from 'lucide-react-native';
import {
  ZodiacAquarius,
  ZodiacAries,
  ZodiacCancer,
  ZodiacCapricorn,
  ZodiacGemini,
  ZodiacLeo,
  ZodiacLibra,
  ZodiacPisces,
  ZodiacSagittarius,
  ZodiacScorpio,
  ZodiacTaurus,
  ZodiacVirgo,
} from 'lucide-react-native';

export function getProfileDisplayName(
  profileName: string,
  firstName?: string | null,
  lastName?: string | null
) {
  const trimmedName = profileName.trim();
  if (trimmedName) return trimmedName;
  if (firstName) return `${firstName}${lastName ? ` ${lastName}` : ''}`;

  return 'Your Mihira Profile';
}

const ZODIAC_SIGNS = [
  { sign: 'Capricorn', icon: ZodiacCapricorn, month: 1, day: 19 },
  { sign: 'Aquarius', icon: ZodiacAquarius, month: 2, day: 18 },
  { sign: 'Pisces', icon: ZodiacPisces, month: 3, day: 20 },
  { sign: 'Aries', icon: ZodiacAries, month: 4, day: 19 },
  { sign: 'Taurus', icon: ZodiacTaurus, month: 5, day: 20 },
  { sign: 'Gemini', icon: ZodiacGemini, month: 6, day: 20 },
  { sign: 'Cancer', icon: ZodiacCancer, month: 7, day: 22 },
  { sign: 'Leo', icon: ZodiacLeo, month: 8, day: 22 },
  { sign: 'Virgo', icon: ZodiacVirgo, month: 9, day: 22 },
  { sign: 'Libra', icon: ZodiacLibra, month: 10, day: 22 },
  { sign: 'Scorpio', icon: ZodiacScorpio, month: 11, day: 21 },
  { sign: 'Sagittarius', icon: ZodiacSagittarius, month: 12, day: 21 },
  { sign: 'Capricorn', icon: ZodiacCapricorn, month: 12, day: 31 },
] as const;

/** Derives zodiac sign from a birth_dt string formatted as `DD/MM/YYYY, HH:MM AM/PM`. */
export function getZodiacSign(birthDt: string): { sign: string; icon: LucideIcon } | null {
  if (!birthDt) return null;
  const match = birthDt.match(/^(\d{2})\/(\d{2})/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const entry = ZODIAC_SIGNS.find((z) => month < z.month || (month === z.month && day <= z.day));
  if (!entry) return null;
  return { sign: entry.sign, icon: entry.icon };
}

export function getProfileInitials(
  profileName: string,
  firstName?: string | null,
  lastName?: string | null
) {
  if (firstName) {
    return `${firstName[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }

  const tokens = profileName.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return '?';

  return `${tokens[0]?.[0] ?? ''}${tokens[1]?.[0] ?? ''}`.toUpperCase();
}
