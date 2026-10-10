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

      <header className="px-6 pb-16 pt-16 md:px-12 md:pt-24">
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="text-[16px] font-medium text-[#E8A33D]">
            {kicker}
          </span>
          <h1 className="max-w-[20ch] text-balance font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.08] text-[#F7F1E3]">
            {h1}
          </h1>
          <p className="max-w-[560px] text-lg leading-[1.65] text-[#F2EAD9]/70">{intro}</p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              className="inline-flex items-center rounded-md bg-[#E8A33D] px-6 py-3.5 text-[16px] font-semibold text-[#1A130A] transition-colors hover:bg-[#F0B454]"
              href={hasAppStoreUrl ? appStoreUrl : '#waitlist'}
            >
              {hasAppStoreUrl ? 'Download for iPhone' : 'Join the waitlist'}
            </a>
            <Link className="text-[15px] text-[#F2EAD9]/60 underline underline-offset-4 hover:text-[#F2EAD9]" href="/#waitlist">
              On Android? Join the waitlist
            </Link>
          </div>
        </div>
      </header>

      <section className="border-t border-[#F2EAD9]/[0.08] py-16 md:py-24">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-6">{children}</div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-[#F2EAD9]/[0.08] py-16">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-6">
            <h2 className="font-serif text-[24px] text-[#F7F1E3]">
              Related reading
            </h2>
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
        className="scroll-mt-20 border-t border-[#F2EAD9]/[0.08] bg-[#14100A] px-6 py-[88px] md:px-12"
      >
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-6 text-center">
          <h2 className="font-serif text-[clamp(1.9rem,3.6vw,2.4rem)] leading-[1.15] text-[#F7F1E3]">
            Mihira is live on iPhone. Android is next.
          </h2>
          <WaitlistInlineForm source="feature_page" align="center" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
