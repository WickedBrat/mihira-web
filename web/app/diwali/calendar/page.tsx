import type { Metadata } from 'next';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { DIWALI_CITIES, cityLabel } from '@/lib/diwali';

export const metadata: Metadata = {
  title: 'Hindu Festival Calendar for Your US City (Subscribe Free)',
  description: 'Add Diwali, Dhanteras, Bhai Dooj, Makar Sankranti and more to Google or Apple Calendar, with puja windows computed for your city. It updates automatically.',
  alternates: { canonical: '/diwali/calendar' },
};

export default function FestivalCalendarPage() {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />
      <section className="px-4 pb-16 pt-14 sm:px-6 md:pt-20">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">Festival calendar</span>
          <h1 className="text-balance [font-family:var(--font-display)] text-[clamp(2.1rem,5.5vw,3.2rem)] font-medium leading-[1.1] text-[#F7F1E3]">
            The panchang on the kitchen wall, now in your phone&rsquo;s calendar.
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.65] text-[#F2EAD9]/70">
            Pick your city and subscribe once. Festival dates arrive in Google or Apple Calendar with the puja window for where you live, plus a reminder 30 minutes before. When we add festivals, your calendar picks them up automatically.
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {DIWALI_CITIES.map((c) => {
              const https = `https://www.getmihira.com/diwali/calendar/${c.slug}.ics`;
              const webcal = https.replace('https://', 'webcal://');
              const gcal = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`;
              return (
                <li key={c.slug} className="flex flex-col gap-2 rounded-2xl border border-[#E8A33D]/15 bg-[#17120B] p-4">
                  <span className="font-semibold text-[#F7F1E3]">{cityLabel(c)}</span>
                  <span className="flex flex-wrap gap-3 text-sm">
                    <a href={webcal} className="font-semibold text-[#E8A33D] underline underline-offset-4">Apple / Outlook</a>
                    <a href={gcal} target="_blank" rel="noopener" className="font-semibold text-[#E8A33D] underline underline-offset-4">Google Calendar</a>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-sm text-[#F2EAD9]/55">Don&rsquo;t see your city? Pick the nearest one. Times shift by about a minute for every 12 miles east or west.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
