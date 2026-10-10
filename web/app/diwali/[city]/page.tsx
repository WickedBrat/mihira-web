import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { DiwaliLookup } from '@/components/diwali-lookup';
import { DiwaliTable } from '@/components/diwali-table';
import { DIWALI_CITIES, DIWALI_DATE_LABEL, cityLabel, getCity, googleCalendarLink, lakshmiPujaFor } from '@/lib/diwali';

const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/us/app/mihira/id6785519525';

export function generateStaticParams() {
  return DIWALI_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const t = lakshmiPujaFor(c.lat, c.lng);
  const label = cityLabel(c);
  return {
    title: `Lakshmi Puja Muhurat in ${label}, Diwali 2026: ${t.pujaStart} – ${t.pujaEnd}`,
    description: `Diwali 2026 Lakshmi Puja in ${label} is ${t.pujaStart} – ${t.pujaEnd} ${t.tzAbbr} on Sunday, November 8. Worked out for ${c.name}'s own sunset (${t.sunset}), not converted from India time.`,
    alternates: { canonical: `/diwali/${c.slug}` },
  };
}

export default async function DiwaliCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const t = lakshmiPujaFor(c.lat, c.lng);
  const label = cityLabel(c);
  const cal = googleCalendarLink(label, t);
  const nearby = DIWALI_CITIES.filter((x) => x.slug !== c.slug && (c.metro ? x.metro === c.metro : x.region === c.region));
  const others = DIWALI_CITIES.filter((x) => x.slug === c.slug || nearby.some((n) => n.slug === x.slug));

  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />
      <header className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 md:px-12 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_10%,rgba(232,163,61,0.22),transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">Diwali 2026 · {label}</span>
          <h1 className="text-balance [font-family:var(--font-display)] text-[clamp(2.1rem,5.5vw,3.3rem)] font-medium leading-[1.1] text-[#F7F1E3]">
            Lakshmi Puja in {c.name}: {t.pujaStart} – {t.pujaEnd} <span className="text-[0.6em] text-[#F2EAD9]/50">{t.tzAbbr}</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.65] text-[#F2EAD9]/70">
            {DIWALI_DATE_LABEL}. Sunset in {c.name} is {t.sunset}. The muhurat is the {t.durationMin}-minute stretch where Vrishabha (Taurus), a fixed sign, is rising during Pradosh Kaal, which runs until {t.pradoshEnd}. It was worked out for {c.name}&rsquo;s coordinates, not converted from India.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {cal ? <a href={cal} target="_blank" rel="noopener" className="rounded-full bg-[#E8A33D] px-5 py-3 text-sm font-bold text-[#1A130A] hover:bg-[#F0B454]">Add to Google Calendar</a> : null}
            <a href={`/diwali/calendar/${c.slug}.ics`} className="rounded-full border border-[#F2EAD9]/20 px-5 py-3 text-sm font-semibold text-[#F7F1E3] hover:border-[#E8A33D]/50">Subscribe: {c.name} festival calendar</a>
          </div>
        </div>
      </header>

      <section className="border-t border-[#E8A33D]/10 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5">
          {others.length > 1 ? (
            <>
              <h2 className="[font-family:var(--font-display)] text-[clamp(1.6rem,3.2vw,2rem)] font-medium text-[#F7F1E3]">Nearby</h2>
              <DiwaliTable cities={others} highlight={c.slug} />
            </>
          ) : null}
          <h2 className="pt-4 [font-family:var(--font-display)] text-[clamp(1.6rem,3.2vw,2rem)] font-medium text-[#F7F1E3]">Somewhere else?</h2>
          <DiwaliLookup appStoreUrl={appStoreUrl} />
          <p className="text-[15px] text-[#F2EAD9]/65">
            <Link href="/diwali" className="font-semibold text-[#E8A33D] underline underline-offset-4">See every US city</Link>
            {' · '}
            <Link href="/blog/india-panchang-wrong-time-usa" className="underline underline-offset-4 hover:text-[#E8A33D]">Why an Indian panchang gives the wrong time here</Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
