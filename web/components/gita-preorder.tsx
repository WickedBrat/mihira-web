'use client';

import { type FormEvent, useId, useState } from 'react';
import { readUtm, stripeLinkWith, trackEvent } from '@/lib/track';

type State = 'idle' | 'submitting' | 'done' | 'error';
type Option = 'preorder' | 'free_day1';

const STAGES = [
  'Early career, mostly on my own',
  'Married, building a life together',
  'Young kids at home',
  'Parents ageing, from a distance',
  'In the middle of a big change: house, job, move',
];
const PRESSING = [
  'Decisions at work, leading people',
  'Marriage and family',
  'A restless, anxious mind',
  'Grief, or a loss',
  'Purpose. Is this it?',
];
const FAMILIARITY = ['Never read it', 'Heard it at home, never read it', 'Read parts of it', 'Studied it properly'];

const inputClass =
  'min-w-0 w-full rounded-xl border border-[#F2EAD9]/[0.16] bg-[#0F0C08] px-4 py-3 text-[16px] text-[#F7F1E3] outline-none transition-colors placeholder:text-[#F2EAD9]/35 focus:border-[#E8A33D]';

function Choice({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o}
          className={`cursor-pointer rounded-full border px-3.5 py-2 text-[14px] transition-colors ${
            value === o ? 'border-[#E8A33D] bg-[#E8A33D]/15 text-[#F7F1E3]' : 'border-[#F2EAD9]/[0.14] text-[#F2EAD9]/75 hover:border-[#E8A33D]/50'
          }`}
        >
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function GitaPreorder({ preorderUrl, price }: { preorderUrl: string | null; price: string }) {
  const id = useId();
  const [stage, setStage] = useState('');
  const [pressing, setPressing] = useState('');
  const [familiarity, setFamiliarity] = useState('');
  const [city, setCity] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [option, setOption] = useState<Option>('preorder');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const [payLink, setPayLink] = useState<string | null>(null);

  const answered = Boolean(stage && pressing && familiarity);

  async function submit(chosen: Option) {
    setOption(chosen);
    setState('submitting');
    setError(null);
    try {
      const res = await fetch('/api/demand-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer: 'gita_18',
          option: chosen,
          email,
          fullName,
          city,
          answers: { stage, pressing, familiarity },
          source: 'gita-page',
          utm: readUtm(),
          website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && (data.error as string)) || 'Something went wrong.');
      const reqId = (data && (data.id as string)) || email;
      trackEvent('gita_request_submitted', { option: chosen, stage, pressing, familiarity });
      if (chosen === 'preorder' && preorderUrl) {
        const link = stripeLinkWith(preorderUrl, email, reqId);
        setPayLink(link);
        trackEvent('gita_pay_redirect', {});
        window.location.assign(link);
        return;
      }
      setState('done');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit(option);
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col gap-3 rounded-[24px] border border-[#E8A33D]/35 bg-[#E8A33D]/10 p-6">
        <p className="text-[17px] font-semibold text-[#F7F1E3]">
          {option === 'preorder' ? 'Seat reserved. We will email a secure payment link within a day.' : 'Day 1 is on its way.'}
        </p>
        <p className="text-[15px] leading-[1.6] text-[#F2EAD9]/75">
          {option === 'preorder'
            ? 'The course starts Thursday, December 3 and ends on Gita Jayanti, Sunday, December 20. Your answers shape which examples you get.'
            : 'Chapter 1 arrives by email in the next day or so, written for where you are. The full 18 days start December 3.'}
        </p>
        {payLink ? (
          <a href={payLink} className="w-fit rounded-full bg-[#E8A33D] px-6 py-3.5 text-[15px] font-bold text-[#1A130A] hover:bg-[#F0B454]">Continue to payment</a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-[28px] border border-[#E8A33D]/20 bg-[#17120B] p-5 shadow-[0_30px_80px_-30px_rgba(232,163,61,0.35)] md:p-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">Four questions, so the examples fit your life</span>
        <p className="text-[14px] text-[#F2EAD9]/55">The verses stay the verses. What changes is the situation each one is applied to.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[15px] font-semibold text-[#F7F1E3]">1. Where are you right now?</p>
        <Choice name="stage" options={STAGES} value={stage} onChange={setStage} />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[15px] font-semibold text-[#F7F1E3]">2. What is pressing most?</p>
        <Choice name="pressing" options={PRESSING} value={pressing} onChange={setPressing} />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[15px] font-semibold text-[#F7F1E3]">3. The Gita and you</p>
        <Choice name="familiarity" options={FAMILIARITY} value={familiarity} onChange={setFamiliarity} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-city`} className="text-[13px] font-semibold text-[#F2EAD9]/70">4. Your city</label>
          <input id={`${id}-city`} className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Jose, CA" autoComplete="address-level2" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-[13px] font-semibold text-[#F2EAD9]/70">First name</label>
          <input id={`${id}-name`} className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="given-name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-[13px] font-semibold text-[#F2EAD9]/70">Email</label>
          <input id={`${id}-email`} className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
      </div>

      <input aria-hidden="true" autoComplete="off" className="sr-only" name="website" tabIndex={-1} type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />

      {state === 'error' && error ? <p role="alert" className="text-sm text-[#F0B454]">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          onClick={() => setOption('preorder')}
          disabled={state === 'submitting' || !answered}
          className="rounded-full bg-[#E8A33D] px-6 py-4 text-[16px] font-bold text-[#1A130A] transition hover:bg-[#F0B454] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'submitting' && option === 'preorder' ? 'One moment…' : `Pre-order the 18 days for ${price}`}
        </button>
        <button
          type="button"
          onClick={() => void submit('free_day1')}
          disabled={state === 'submitting' || !answered || !email}
          className="rounded-full border border-[#F2EAD9]/20 px-6 py-4 text-[15px] font-semibold text-[#F7F1E3] transition hover:border-[#E8A33D]/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'submitting' && option === 'free_day1' ? 'Sending…' : 'Send me Day 1 free'}
        </button>
      </div>
      <p className="text-[13px] leading-[1.55] text-[#F2EAD9]/50">
        {answered ? 'Pre-orders are refundable in full until December 3.' : 'Answer the three questions above to continue.'} {price} is the pre-order price; it is $49 from December 1.
      </p>
    </form>
  );
}
