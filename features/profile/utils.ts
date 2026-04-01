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

export function getProfileDisplayName(
  profileName: string,
  firstName?: string | null,
  lastName?: string | null
) {
  const trimmedName = profileName.trim();
  if (trimmedName) return trimmedName;
  if (firstName) return `${firstName}${lastName ? ` ${lastName}` : ''}`;

  return 'Your Aksha Profile';
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
