// Square 1080×1080 share card: /diwali/card/edison-nj.png — for WhatsApp/Instagram.
import { ImageResponse } from 'next/og';
import { DIWALI_CITIES, getCity, lakshmiPujaFor } from '@/lib/diwali';
import { DiwaliCard } from '@/components/diwali-card';

export function generateStaticParams() {
  return DIWALI_CITIES.map((c) => ({ file: `${c.slug}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const c = getCity(file.replace(/\.png$/, ''));
  if (!c) return new Response('Not found', { status: 404 });
  return new ImageResponse(<DiwaliCard city={c} t={lakshmiPujaFor(c.lat, c.lng)} square />, { width: 1080, height: 1080 });
}
