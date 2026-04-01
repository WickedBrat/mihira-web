export async function geocode(place: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'aksha-app/1.0' } });
  const data: { lat: string; lon: string }[] = await res.json();
  if (!data.length) throw new Error(`Could not geocode: ${place}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
