'use client';

import { track as vercelTrack } from '@vercel/analytics';
import { sendGAEvent } from '@next/third-parties/google';

type Props = Record<string, string | number | boolean>;

/** Fire one product event to both Vercel Analytics and GA4 (same name, same props). */
export function trackEvent(name: string, props: Props = {}) {
  try {
    vercelTrack(name, props);
  } catch {
    /* analytics must never break the page */
  }
  try {
    sendGAEvent('event', name, props);
  } catch {
    /* ditto */
  }
}

/** utm_* params from the current URL, for attribution on form submits. */
export function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

/** Append prefilled_email + client_reference_id to a Stripe Payment Link so the payment can be matched to the request. */
export function stripeLinkWith(base: string, email: string, ref: string) {
  try {
    const u = new URL(base);
    if (email) u.searchParams.set('prefilled_email', email);
    if (ref) u.searchParams.set('client_reference_id', ref.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 200));
    return u.toString();
  } catch {
    return base;
  }
}
