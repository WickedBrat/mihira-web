import { ImageResponse } from 'next/og';
import { DIWALI_CITIES, getCity, lakshmiPujaFor } from '@/lib/diwali';
import { DiwaliCard } from '@/components/diwali-card';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Diwali 2026 Lakshmi Puja time for your city';

export function generateStaticParams() {
  return DIWALI_CITIES.map((c) => ({ city: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city) ?? DIWALI_CITIES[0];
  return new ImageResponse(<DiwaliCard city={c} t={lakshmiPujaFor(c.lat, c.lng)} />, size);
}
