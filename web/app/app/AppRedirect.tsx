'use client';

import { useEffect, useState } from 'react';

const APP_SCHEME = 'mihira://';
const WEB_FALLBACK_URL = 'https://www.getmihira.com/#waitlist';
const FALLBACK_DELAY_MS = 1400;

function getFallbackUrl() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);

  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
  const googlePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;

  if (isIOS && appStoreUrl) return appStoreUrl;
  if (isAndroid && googlePlayUrl) return googlePlayUrl;
  return WEB_FALLBACK_URL;
}

export function AppRedirect() {
  const [fallbackUrl, setFallbackUrl] = useState(WEB_FALLBACK_URL);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /iPad|iPhone|iPod|Android/.test(ua);
    const target = getFallbackUrl();
    setFallbackUrl(target);

    if (!isMobile) {
      window.location.replace(target);
      return;
    }

    const timer = setTimeout(() => {
      if (!document.hidden) {
        window.location.replace(target);
      }
    }, FALLBACK_DELAY_MS);

    const clearOnHide = () => {
      if (document.hidden) clearTimeout(timer);
    };
    document.addEventListener('visibilitychange', clearOnHide);

    window.location.href = APP_SCHEME;

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', clearOnHide);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0F0C08] px-6 text-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E8A33D]/25 border-t-[#E8A33D]" />
      <div className="flex flex-col gap-2">
        <p className="[font-family:var(--font-display)] text-xl font-medium text-[#F7F1E3]">Opening Mihira…</p>
        <p className="max-w-[280px] text-sm leading-[1.6] text-[#F2EAD9]/60">
          If the app doesn’t open automatically, tap below.
        </p>
      </div>
      <a
        href={fallbackUrl}
        className="rounded-full bg-[#E8A33D] px-6 py-3 font-sans text-sm font-bold text-[#1A130A] transition hover:bg-[#F0B454]"
      >
        Continue to Mihira
      </a>
    </main>
  );
}
