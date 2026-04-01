import type { ComponentType } from 'react';
import { CalendarClock, MapPin, UserRound } from 'lucide-react-native';

export type ProfileFieldId = 'name' | 'birth_dt' | 'birth_place';

export interface ProfileFieldConfig {
  id: ProfileFieldId;
  label: string;
  placeholder: string;
  icon: ComponentType<{ size: number; color: string }>;
  autoCapitalize: 'none' | 'words';
}

export const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1, 9, 0);

export const LANGUAGE_OPTIONS = ['English', 'Hindi'] as const;

export const PROFILE_FIELDS: ProfileFieldConfig[] = [
  {
    id: 'name',
    label: 'Name',
    placeholder: 'Enter your full name',
    icon: UserRound,
    autoCapitalize: 'words',
  },
  {
    id: 'birth_dt',
    label: 'Date & Time of Birth',
    placeholder: 'DD/MM/YYYY, HH:MM AM',
    icon: CalendarClock,
    autoCapitalize: 'none',
  },
  {
    id: 'birth_place',
    label: 'Place of Birth',
    placeholder: 'City, State, Country',
    icon: MapPin,
    autoCapitalize: 'words',
  },
];
