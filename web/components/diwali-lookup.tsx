'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { track } from '@vercel/analytics';

interface Result {
  label: string | null;
  source: 'query' | 'coords' | 'ip';
  tzAbbr: string;
  sunset: string;
  pujaStart: string | null;
  pujaEnd: string | null;
  pradoshEnd: string;
  pujaStartISO: string | null;
  pujaEndISO: string | null;
  durationMin: number | null;
}

const QUICK = ['Edison, NJ', 'San Jose, CA', 'Seattle, WA', 'Dallas, TX', 'Austin, TX', 'Chicago, IL', 'Atlanta, GA'];

function calLink(r: Result) {
  if (!r.pujaStartISO || !r.pujaEndISO) return null;
  const z = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Lakshmi Puja muhurat (Diwali 2026)',
    dates: `${z(r.pujaStartISO)}/${z(r.pujaEndISO)}`,
    details: `Lakshmi Puja window for ${r.label ?? 'your city'}, computed for your local sunset. Via Mihira — https://www.getmihira.com/diwali`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function waLink(r: Result) {
  const text = `🪔 Diwali 2026 — Lakshmi Puja in ${r.label ?? 'our city'}: ${r.pujaStart} – ${r.pujaEnd} ${r.tzAbbr} on Sunday, Nov 8.\nWorked out for our local sunset, not converted from India time.\nFind your city: https://www.getmihira.com/diwali`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function DiwaliLookup({ appStoreUrl, initialQuery }: { appStoreUrl: string; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(params: string, kind: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lakshmi-puja${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setResult(data);
      if (kind !== 'ip') track('diwali_lookup', { kind, label: data.label ?? '' });
    } catch (e) {
      if (kind !== 'ip') setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) void load(`?q=${encodeURIComponent(initialQuery)}`, 'initial');
    else void load('', 'ip');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) void load(`?q=${encodeURIComponent(query.trim())}`, 'search');
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setError('Your browser does not share location. Type your city instead.');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => void load(`?lat=${pos.coords.latitude.toFixed(3)}&lng=${pos.coords.longitude.toFixed(3)}&label=${encodeURIComponent('your location')}`, 'geo'),
      () => { setLoading(false); setError('Location permission was declined. Type your city instead.'); },
      { timeout: 8000 }
    );
  }

  const cal = result ? calLink(result) : null;

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-[#E8A33D]/20 bg-[#17120B] p-5 shadow-[0_30px_80px_-30px_rgba(232,163,61,0.35)] md:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="diwali-city">Your city</label>
        <input
          id="diwali-city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Your city, e.g. Edison, NJ"
          autoComplete="address-level2"
          className="min-w-0 flex-1 rounded-full border border-[#E8A33D]/25 bg-[#0F0C08] px-5 py-3.5 text-base text-[#F7F1E3] placeholder:text-[#F2EAD9]/40 focus:border-[#E8A33D] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#E8A33D] px-6 py-3.5 font-sans text-[15px] font-bold text-[#1A130A] transition hover:bg-[#F0B454] disabled:opacity-60"
        >
          {loading ? 'Working it out…' : 'Show my time'}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={useMyLocation} className="rounded-full border border-[#E8A33D]/40 px-3.5 py-1.5 text-[13px] font-semibold text-[#E8A33D] hover:bg-[#E8A33D]/10">
          Use my location
        </button>
        {QUICK.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => { setQuery(c); void load(`?q=${encodeURIComponent(c)}`, 'chip'); }}
            className="rounded-full border border-[#F2EAD9]/10 px-3.5 py-1.5 text-[13px] text-[#F2EAD9]/70 hover:border-[#E8A33D]/40 hover:text-[#F7F1E3]"
          >
            {c}
          </button>
        ))}
      </div>

      {error ? <p role="alert" className="text-sm text-[#F0B454]">{error}</p> : null}

      {result && result.pujaStart ? (
        <div aria-live="polite" className="flex flex-col gap-4 rounded-[20px] border border-[#E8A33D]/15 bg-[#0F0C08] p-5 md:p-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
            {result.source === 'ip' ? 'Looks like you’re near ' : 'Lakshmi Puja · '}{result.label ?? 'your location'}
          </span>
          <p className="[font-family:var(--font-display)] text-[clamp(2.2rem,7vw,3.4rem)] font-medium leading-none text-[#F7F1E3]">
            {result.pujaStart} – {result.pujaEnd}
            <span className="ml-2 align-middle font-sans text-base font-semibold text-[#F2EAD9]/50">{result.tzAbbr}</span>
          </p>
          <p className="text-[15px] leading-[1.6] text-[#F2EAD9]/70">
            Sunday, November 8 · {result.durationMin} minutes · Your sunset is {result.sunset}, and Pradosh Kaal runs until {result.pradoshEnd}.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <a href={waLink(result)} target="_blank" rel="noopener" onClick={() => track('diwali_share', { channel: 'whatsapp' })}
              className="rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-[#08210F] hover:brightness-110">
              Send to the family group
            </a>
            {cal ? (
              <a href={cal} target="_blank" rel="noopener" onClick={() => track('diwali_share', { channel: 'gcal' })}
                className="rounded-full border border-[#F2EAD9]/20 px-4 py-2.5 text-sm font-semibold text-[#F7F1E3] hover:border-[#E8A33D]/50">
                Add to Google Calendar
              </a>
            ) : null}
            <a href="/diwali/calendar" className="rounded-full border border-[#F2EAD9]/20 px-4 py-2.5 text-sm font-semibold text-[#F7F1E3] hover:border-[#E8A33D]/50">
              All festival dates in your calendar
            </a>
          </div>
          <p className="border-t border-[#E8A33D]/10 pt-4 text-sm leading-[1.6] text-[#F2EAD9]/60">
            Planning a griha pravesh, a naming ceremony or a big purchase too?{' '}
            <a href={appStoreUrl} onClick={() => track('diwali_app_cta')} className="font-semibold text-[#E8A33D] underline underline-offset-4">
              Mihira finds the window for any date, computed for where you live.
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}
