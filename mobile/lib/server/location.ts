export interface RequestLocation {
  lat: number;
  lng: number;
  timeZone: string;
  label: string | null;
  source: 'client' | 'ip';
}

/** Optional location fields a client may send in a request body. */
export interface LocationHints {
  lat?: number;
  lng?: number;
  timeZone?: string;
  locationLabel?: string;
}

export function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function isValidCoord(lat: unknown, lng: unknown): boolean {
  return typeof lat === 'number' && typeof lng === 'number' &&
    Number.isFinite(lat) && Number.isFinite(lng) &&
    Math.abs(lat) <= 66 && Math.abs(lng) <= 180; // beyond ~66° there may be no sunrise
}

/**
 * Where to compute for. Prefer coordinates the app sends; otherwise fall back
 * to Vercel's IP geolocation headers so existing app builds (which send no
 * location) still get times for where the user actually is, not India.
 */
export function resolveLocation(body: LocationHints, headers: Headers): RequestLocation | null {
  if (isValidCoord(body.lat, body.lng)) {
    const tz = isValidTimeZone(body.timeZone) ? body.timeZone : (headers.get('x-vercel-ip-timezone') ?? 'UTC');
    return {
      lat: body.lat as number,
      lng: body.lng as number,
      timeZone: isValidTimeZone(tz) ? tz : 'UTC',
      label: body.locationLabel?.slice(0, 120) ?? null,
      source: 'client',
    };
  }

  const ipLat = parseFloat(headers.get('x-vercel-ip-latitude') ?? '');
  const ipLng = parseFloat(headers.get('x-vercel-ip-longitude') ?? '');
  const ipTz = headers.get('x-vercel-ip-timezone');
  if (isValidCoord(ipLat, ipLng) && isValidTimeZone(ipTz)) {
    const city = headers.get('x-vercel-ip-city');
    const region = headers.get('x-vercel-ip-country-region');
    const label = city ? [decodeURIComponent(city), region].filter(Boolean).join(', ') : null;
    return { lat: ipLat, lng: ipLng, timeZone: ipTz, label, source: 'ip' };
  }
  return null;
}
