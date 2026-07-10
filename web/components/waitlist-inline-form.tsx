"use client";

import { type FormEvent, useId, useState } from 'react';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function readResponseMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null;

  const value = payload as { error?: unknown; message?: unknown };
  if (typeof value.error === 'string') return value.error;
  if (typeof value.message === 'string') return value.message;

  return null;
}

export function WaitlistInlineForm({
  source,
  successMessage = "You're on the list. Invites go out in small, careful batches.",
  align = 'left',
  platform = 'android',
  buttonLabel = 'Join the Android waitlist',
}: {
  source: string;
  successMessage?: string;
  align?: 'left' | 'center';
  platform?: string;
  buttonLabel?: string;
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = submitState === 'submitting';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, platform, source, website }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(readResponseMessage(payload) ?? 'The waitlist could not be reached.');
      }

      setSubmitState('success');
      setEmail('');
      setWebsite('');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  if (submitState === 'success') {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border border-[#E8A33D]/35 bg-[#E8A33D]/10 px-6 py-[15px] ${
          align === 'center' ? 'mx-auto max-w-[480px]' : 'max-w-[480px]'
        }`}
      >
        <span className="text-lg text-[#E8A33D]">✓</span>
        <span className="text-[15px] font-semibold text-[#F2EAD9]">{successMessage}</span>
      </div>
    );
  }

  return (
    <form
      className={`flex flex-col gap-2 ${align === 'center' ? 'mx-auto max-w-[480px]' : 'max-w-[480px]'}`}
      onSubmit={handleSubmit}
    >
      <div className="flex w-full gap-2.5">
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          id={emailId}
          autoComplete="email"
          className="min-w-0 flex-1 rounded-full border border-[#F2EAD9]/[0.18] bg-[#F2EAD9]/[0.06] px-[22px] py-[15px] font-sans text-[15px] text-[#F2EAD9] outline-none transition placeholder:text-[#F2EAD9]/35 focus:border-[#E8A33D]"
          disabled={isSubmitting}
          name="email"
          placeholder="you@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
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
        <button
          className="whitespace-nowrap rounded-full bg-[#E8A33D] px-7 py-[15px] font-sans text-[15px] font-bold text-[#1A130A] transition hover:bg-[#F0B454] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Joining…' : buttonLabel}
        </button>
      </div>
      {submitState === 'error' && errorMessage ? (
        <p className="text-sm leading-[1.5] text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
