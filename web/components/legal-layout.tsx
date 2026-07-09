import type { ReactNode } from 'react';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />

      <div className="mx-auto w-full max-w-[680px] px-6 pb-24 pt-14 md:pt-20">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E8A33D]">{eyebrow}</span>
        <h1 className="mt-3 [font-family:var(--font-display)] text-3xl font-semibold leading-tight text-[#F7F1E3] md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#F2EAD9]/45">Last updated: {updated}</p>

        <div className="mt-10 flex flex-col divide-y divide-[#E8A33D]/10 border-t border-[#E8A33D]/10">
          {children}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}

export function LegalSection({
  number,
  heading,
  children,
}: {
  number: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-[2rem_1fr] gap-x-3 py-6 md:grid-cols-[2.5rem_1fr] md:gap-x-4">
      <span className="pt-px font-sans text-sm font-semibold text-[#E8A33D]/60">{number}</span>
      <div className="flex flex-col gap-2.5">
        <h2 className="font-sans text-base font-bold text-[#F7F1E3] md:text-[17px]">{heading}</h2>
        <div className="flex flex-col gap-3 text-[14px] leading-[1.7] text-[#F2EAD9]/60">{children}</div>
      </div>
    </section>
  );
}

export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-[#E8A33D] underline underline-offset-2 transition hover:text-[#F0B454]" href={href}>
      {children}
    </a>
  );
}
