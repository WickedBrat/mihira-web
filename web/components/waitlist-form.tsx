"use client";

import { type FormEvent, useId, useState } from 'react';
import { CheckCircle2, LoaderCircle, Mail, Send, Smartphone } from 'lucide-react';

type Platform = 'ios' | 'android' | 'both';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const platformOptions: Array<{ label: string; value: Platform }> = [
  { label: 'iPhone', value: 'ios' },
  { label: 'Android', value: 'android' },
  { label: 'Both', value: 'both' },
];

function readResponseMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null;

  const value = payload as { error?: unknown; message?: unknown };
  if (typeof value.error === 'string') return value.error;
  if (typeof value.message === 'string') return value.message;

  return null;
}

export function WaitlistForm() {
  const nameId = useId();
  const emailId = useId();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform>('ios');
  const [website, setWebsite] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('Private beta invites are sent in careful batches.');

  const isSubmitting = submitState === 'submitting';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setMessage('Saving your place...');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName,
          platform,
          source: 'landing_page_waitlist',
          website,
        }),
      });

      const payload = await response.json().catch(() => null);
      const responseMessage = readResponseMessage(payload);

      if (!response.ok) {
        throw new Error(responseMessage ?? 'The waitlist could not be reached.');
      }

      setSubmitState('success');
      setMessage(responseMessage ?? 'You are on the waitlist. We will email you when your invite is ready.');
      setFullName('');
      setEmail('');
      setWebsite('');
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(37,38,38,0.94),rgba(15,15,15,0.98))] p-5 shadow-[0_24px_54px_rgba(0,0,0,0.32)] md:p-6"
      onSubmit={handleSubmit}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(255,149,0,0.12),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(174,227,255,0.1),transparent_30%)]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.2em] text-[#ff9500]">
              Join Waitlist
            </p>
            <h3 className="mt-2 font-[var(--font-display)] text-[1.75rem] font-semibold leading-[1.05] text-white">
              Reserve early access
            </h3>
          </div>
          <span className="inline-flex size-11 items-center justify-center rounded-full border border-[#ff9500]/20 bg-[#ff9500]/10 text-[#ff9500]">
            <Mail className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/[0.62]" htmlFor={nameId}>
              Name
            </label>
            <input
              id={nameId}
              autoComplete="name"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-black/24 px-4 text-base text-white outline-none transition focus:border-[#ff9500]/70 focus:ring-2 focus:ring-[#ff9500]/20"
              disabled={isSubmitting}
              name="fullName"
              placeholder="Your name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/[0.62]" htmlFor={emailId}>
              Email
            </label>
            <input
              id={emailId}
              autoComplete="email"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-black/24 px-4 text-base text-white outline-none transition focus:border-[#ff9500]/70 focus:ring-2 focus:ring-[#ff9500]/20"
              disabled={isSubmitting}
              name="email"
              placeholder="you@example.com"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <input
            aria-hidden="true"
            autoComplete="off"
            className="sr-only"
            name="website"
            tabIndex={-1}
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />

          <div>
            <p className="mb-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/[0.62]">
              Platform
            </p>
            <div
              aria-label="Preferred platform"
              className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-black/20 p-1"
              role="radiogroup"
            >
              {platformOptions.map((option) => {
                const isSelected = platform === option.value;

                return (
                  <button
                    key={option.value}
                    aria-checked={isSelected}
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-2 font-sans text-[0.68rem] font-bold uppercase tracking-[0.1em] transition ${
                      isSelected
                        ? 'bg-white text-[#111214] shadow-[0_12px_22px_rgba(0,0,0,0.24)]'
                        : 'text-white/[0.66] hover:bg-white/[0.06] hover:text-white'
                    }`}
                    disabled={isSubmitting}
                    role="radio"
                    type="button"
                    onClick={() => setPlatform(option.value)}
                  >
                    <Smartphone className="size-3.5" aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b564fc] px-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(181,100,252,0.28)] transition hover:-translate-y-px hover:bg-[#c47dff] disabled:cursor-not-allowed disabled:opacity-[0.68] disabled:hover:translate-y-0"
          disabled={isSubmitting || submitState === 'success'}
          type="submit"
        >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : submitState === 'success' ? (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          <span>{submitState === 'success' ? 'Joined' : 'Join Waitlist'}</span>
        </button>

        <p
          aria-live="polite"
          className={`mt-4 text-sm leading-[1.55] ${
            submitState === 'error' ? 'text-red-300' : submitState === 'success' ? 'text-green-300' : 'text-white/[0.62]'
          }`}
        >
          {message}
        </p>
      </div>
    </form>
  );
}
