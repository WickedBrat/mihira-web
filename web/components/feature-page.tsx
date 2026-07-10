import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { WaitlistInlineForm } from '@/components/waitlist-inline-form';

export function FeaturePage({
  kicker,
  h1,
  intro,
  children,
  relatedPosts,
  hasAppStoreUrl,
  appStoreUrl,
}: {
  kicker: string;
  h1: string;
  intro: string;
  children: ReactNode;
  relatedPosts: { href: string; label: string }[];
  hasAppStoreUrl: boolean;
  appStoreUrl: string;
}) {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-14 pt-16 md:px-12 md:pt-[88px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(120,72,20,0.3),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">
            {kicker}
          </span>
          <h1 className="max-w-[20ch] text-balance [font-family:var(--font-display)] text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-[1.1] text-[#F7F1E3]">
            {h1}
          </h1>
          <p className="max-w-[560px] text-lg leading-[1.65] text-[#F2EAD9]/70">{intro}</p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              className="flex items-center gap-2 rounded-full bg-[#E8A33D] px-7 py-[15px] font-sans text-[15px] font-bold text-[#1A130A] transition hover:bg-[#F0B454]"
              href={hasAppStoreUrl ? appStoreUrl : '#waitlist'}
            >
              {hasAppStoreUrl ? 'Download on the App Store' : 'App Store — coming soon'}
            </a>
            <Link className="font-sans text-sm font-semibold text-[#F2EAD9]/70 hover:text-[#E8A33D]" href="/#waitlist">
              or join the waitlist
            </Link>
          </div>
        </div>
      </header>

      <section className="border-t border-[#E8A33D]/10 py-16 md:py-24">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-6">{children}</div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-[#E8A33D]/10 py-16">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-6">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
              Related reading
            </span>
            <div className="flex flex-col gap-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="text-[15px] font-semibold text-[#F2EAD9]/80 underline underline-offset-4 transition hover:text-[#E8A33D]"
                >
                  {post.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="waitlist"
        className="relative scroll-mt-28 overflow-hidden border-t border-[#E8A33D]/10 px-6 py-[88px] md:px-12"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_100%,rgba(120,72,20,0.35),transparent_75%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-[560px] flex-col items-center gap-6 text-center">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.9rem,3.6vw,2.4rem)] font-medium leading-[1.15] text-[#F7F1E3]">
            Mihira is live on iPhone. Android is next.
          </h2>
          <WaitlistInlineForm source="feature_page" align="center" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
