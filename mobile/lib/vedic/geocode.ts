export interface PlaceSuggestion {
  id: string;
  label: string;
}

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

function getPlaceLabel(result: NominatimResult): string {
  const locality =
    result.address?.city ??
    result.address?.town ??
    result.address?.village ??
    result.address?.county;

  const parts = [locality, result.address?.state, result.address?.country].filter(Boolean);
  return parts.length ? parts.join(', ') : result.display_name;
}

export async function searchBirthPlaces(query: string): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}` +
    '&format=jsonv2&addressdetails=1&limit=5&accept-language=en';

  const res = await fetch(url, { headers: { 'User-Agent': 'aksha-app/1.0' } });
  const data: NominatimResult[] = await res.json();

  return data.map((item) => ({
    id: String(item.place_id),
    label: getPlaceLabel(item),
  }));
}

export async function geocode(place: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'aksha-app/1.0' } });
  const data: { lat: string; lon: string }[] = await res.json();
  if (!data.length) throw new Error(`Could not geocode: ${place}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
