import { DIWALI_CITIES, getCity } from '@/lib/diwali';
import { buildIcs } from '@/lib/festivalCalendar';

export function generateStaticParams() {
  return DIWALI_CITIES.map((c) => ({ file: `${c.slug}.ics` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }): Promise<Response> {
  const { file } = await params;
  const city = getCity(file.replace(/\.ics$/, ''));
  if (!city) return new Response('Not found', { status: 404 });
  return new Response(buildIcs(city), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${city.slug}-hindu-festivals.ics"`,
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}
