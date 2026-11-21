'use client';

import { type FormEvent, useId, useState } from 'react';
import { readUtm, stripeLinkWith, trackEvent } from '@/lib/track';

type Option = 'home' | 'video';
type State = 'idle' | 'submitting' | 'done' | 'error';

const SLOTS = [
  { value: 'muhurat', label: 'Inside the muhurat (5:02–6:53 PM ET)', note: 'Only 6 homes. One pandit, one window.' },
  { value: 'pradosh', label: 'Pradosh Kaal (6:53–7:31 PM ET)', note: 'Still auspicious; more availability.' },
  { value: 'earlier', label: 'Earlier that evening, from 3 PM', note: 'If the family is coming from far.' },
  { value: 'flexible', label: 'Flexible, suggest a time', note: '' },
];

const inputClass =
  'min-w-0 w-full rounded-xl border border-[#F2EAD9]/[0.16] bg-[#0F0C08] px-4 py-3 text-[16px] text-[#F7F1E3] outline-none transition-colors placeholder:text-[#F2EAD9]/35 focus:border-[#E8A33D]';

export function PujaRequestForm({
  depositUrl,
  videoUrl,
}: {
  depositUrl: string | null;
  videoUrl: string | null;
}) {
  const id = useId();
  const [option, setOption] = useState<Option>('home');
  const [slot, setSlot] = useState('muhurat');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('Hindi + English');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const payUrl = option === 'home' ? depositUrl : videoUrl;
  const payLabel = option === 'home' ? 'Pay the $51 deposit' : 'Pay $71 and confirm';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState('submitting');
    setError(null);
    try {
      const res = await fetch('/api/demand-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer: 'diwali_puja',
          option,
          email,
          fullName,
          phone,
          city,
          slot: option === 'home' ? slot : 'video',
          answers: { language, notes },
          source: 'lakshmi-puja-page',
          utm: readUtm(),
          website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && (data.error as string)) || 'Something went wrong.');
      setRequestId((data && (data.id as string)) || null);
      setState('done');
      trackEvent('puja_request_submitted', { option, slot: option === 'home' ? slot : 'video' });
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (state === 'done') {
    const link = payUrl ? stripeLinkWith(payUrl, email, requestId ?? email) : null;
    return (
      <div className="flex flex-col gap-4 rounded-[24px] border border-[#E8A33D]/35 bg-[#E8A33D]/10 p-6">
        <p className="text-[17px] font-semibold text-[#F7F1E3]">
          {option === 'home' ? 'Request received. One step left to hold the slot.' : 'Request received. One step left to confirm.'}
        </p>
        <p className="text-[15px] leading-[1.6] text-[#F2EAD9]/75">
          {option === 'home'
            ? 'We confirm a pandit for your slot within 24 hours on WhatsApp or email. If we cannot place one, the deposit is refunded in full, no questions.'
            : 'We send the video link, the samagri list and a short prep note within 24 hours. If the slot cannot be met, you get a full refund.'}
        </p>
        {link ? (
          <a
            href={link}
            onClick={() => trackEvent('puja_pay_click', { option })}
            className="inline-flex w-fit items-center rounded-full bg-[#E8A33D] px-6 py-3.5 text-[15px] font-bold text-[#1A130A] hover:bg-[#F0B454]"
          >
            {payLabel}
          </a>
        ) : (
          <p className="text-[15px] text-[#F2EAD9]/75">We will send a secure payment link along with the confirmation.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-[28px] border border-[#E8A33D]/20 bg-[#17120B] p-5 shadow-[0_30px_80px_-30px_rgba(232,163,61,0.35)] md:p-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">How would you like it done?</legend>
        {(
          [
            { v: 'home', title: 'Pandit at your home', price: '$251', sub: 'Lakshmi–Ganesh puja, 60–75 minutes, in New Jersey or NYC. $51 deposit now, $200 to the pandit after.' },
            { v: 'video', title: 'Guided on video, you perform it', price: '$71', sub: 'A pandit on a video call leads your family through the puja at your own shrine. Anywhere in the US.' },
          ] as { v: Option; title: string; price: string; sub: string }[]
        ).map((o) => (
          <label
            key={o.v}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
              option === o.v ? 'border-[#E8A33D] bg-[#E8A33D]/10' : 'border-[#F2EAD9]/[0.12] hover:border-[#E8A33D]/50'
            }`}
          >
            <input type="radio" name="option" value={o.v} checked={option === o.v} onChange={() => setOption(o.v)} className="mt-1.5 accent-[#E8A33D]" />
            <span className="flex flex-1 flex-col gap-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[16px] font-semibold text-[#F7F1E3]">{o.title}</span>
                <span className="text-[16px] font-bold text-[#E8A33D]">{o.price}</span>
              </span>
              <span className="text-[14px] leading-[1.55] text-[#F2EAD9]/65">{o.sub}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {option === 'home' ? (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">Sunday, November 8: which slot?</legend>
          {SLOTS.map((s) => (
            <label key={s.value} className="flex cursor-pointer items-start gap-3 text-[15px] text-[#F2EAD9]/85">
              <input type="radio" name="slot" value={s.value} checked={slot === s.value} onChange={() => setSlot(s.value)} className="mt-1 accent-[#E8A33D]" />
              <span>
                {s.label}
                {s.note ? <span className="block text-[13px] text-[#F2EAD9]/50">{s.note}</span> : null}
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-[13px] font-semibold text-[#F2EAD9]/70">Your name</label>
          <input id={`${id}-name`} className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-phone`} className="text-[13px] font-semibold text-[#F2EAD9]/70">WhatsApp or phone</label>
          <input id={`${id}-phone`} className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" required placeholder="+1" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-[13px] font-semibold text-[#F2EAD9]/70">Email</label>
          <input id={`${id}-email`} className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-city`} className="text-[13px] font-semibold text-[#F2EAD9]/70">{option === 'home' ? 'Town and ZIP' : 'City'}</label>
          <input id={`${id}-city`} className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" required placeholder={option === 'home' ? 'Edison, 08820' : 'Your city'} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-lang`} className="text-[13px] font-semibold text-[#F2EAD9]/70">Language for the explanation</label>
          <select id={`${id}-lang`} className={inputClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
            {['Hindi + English', 'English only', 'Telugu', 'Tamil', 'Gujarati', 'Marathi', 'Kannada', 'Bengali', 'Other'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor={`${id}-notes`} className="text-[13px] font-semibold text-[#F2EAD9]/70">Anything we should know (optional)</label>
          <textarea id={`${id}-notes`} className={`${inputClass} min-h-[72px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="First Diwali in the new house, kids joining, family tradition from Gujarat…" />
        </div>
      </div>

      <input aria-hidden="true" autoComplete="off" className="sr-only" name="website" tabIndex={-1} type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />

      {state === 'error' && error ? <p role="alert" className="text-sm text-[#F0B454]">{error}</p> : null}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded-full bg-[#E8A33D] px-6 py-4 text-[16px] font-bold text-[#1A130A] transition hover:bg-[#F0B454] disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : option === 'home' ? 'Request a pandit for November 8' : 'Request the video puja'}
      </button>
      <p className="text-[13px] leading-[1.55] text-[#F2EAD9]/50">
        No charge on this step. {option === 'home' ? 'The $51 deposit is taken on the next screen and refunded in full if we cannot confirm within 24 hours.' : 'Payment is taken on the next screen and refunded in full if the slot cannot be met.'}
      </p>
    </form>
  );
}
