import { lakshmiPujaFor } from '@/lib/diwali';

// GET /api/lakshmi-puja?q=Edison NJ  |  ?lat=..&lng=..  |  (no params → IP location)
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  let lat = parseFloat(url.searchParams.get('lat') ?? '');
  let lng = parseFloat(url.searchParams.get('lng') ?? '');
  let label = url.searchParams.get('label')?.slice(0, 120) ?? null;
  let source: 'query' | 'coords' | 'ip' = 'coords';

  try {
    if (q) {
      source = 'query';
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.slice(0, 120))}&format=jsonv2&addressdetails=1&limit=1&accept-language=en`,
        { headers: { 'User-Agent': 'mihira-web/1.0 (help@getmihira.com)' }, next: { revalidate: 86400 } }
      );
      const data = (await res.json()) as {
        lat: string; lon: string; display_name: string;
        address?: { city?: string; town?: string; village?: string; county?: string; state?: string; country_code?: string };
      }[];
      if (!data.length) return Response.json({ error: "We couldn't find that place. Try a city and state, like “Edison, NJ”." }, { status: 404 });
      lat = parseFloat(data[0].lat);
      lng = parseFloat(data[0].lon);
      const a = data[0].address;
      const locality = a?.city ?? a?.town ?? a?.village ?? a?.county;
      label = [locality, a?.state].filter(Boolean).join(', ') || data[0].display_name;
    } else if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      source = 'ip';
      lat = parseFloat(request.headers.get('x-vercel-ip-latitude') ?? '');
      lng = parseFloat(request.headers.get('x-vercel-ip-longitude') ?? '');
      const city = request.headers.get('x-vercel-ip-city');
      const region = request.headers.get('x-vercel-ip-country-region');
      label = city ? [decodeURIComponent(city), region].filter(Boolean).join(', ') : null;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return Response.json({ error: 'No location' }, { status: 400 });
      }
    }

    if (Math.abs(lat) > 60 || Math.abs(lng) > 180) {
      return Response.json({ error: 'Lakshmi Puja timings need a sunset — try a location below 60° latitude.' }, { status: 400 });
    }

    return Response.json(
      { label, source, lat, lng, ...lakshmiPujaFor(lat, lng) },
      { headers: { 'Cache-Control': source === 'ip' ? 'private, no-store' : 'public, s-maxage=86400' } }
    );
  } catch (err) {
    console.error('[lakshmi-puja]', err);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
