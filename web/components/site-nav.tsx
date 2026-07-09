import Link from 'next/link';
import { Charmonman } from 'next/font/google';
import mihiraLogo from '@/app/logo.svg';

const charmonman = Charmonman({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const navLinkClass = 'text-[#F2EAD9]/70 transition hover:text-[#E8A33D]';

export function MihiraText() {
  return <span className={charmonman.className}>Mihira</span>;
}

export function MarkGlyph({ size = 26 }: { size?: number }) {
  return <img src={mihiraLogo.src} width={size} height={size} alt="" aria-hidden="true" />;
}

export function SiteNav() {
  return (
    <div className="sticky top-3 z-50 px-4 md:top-5 md:px-6">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-[#E8A33D]/[0.14] bg-[#17130B]/90 py-2 pl-5 pr-2 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:gap-8 md:pr-3">
        <Link className="flex items-center gap-2.5" href="/">
          <MarkGlyph />
          <span className="[font-family:var(--font-display)] text-lg font-semibold leading-none text-[#F2EAD9] md:text-[22px]">
            <MihiraText />
          </span>
        </Link>

        <div className="hidden items-center gap-8 font-sans text-sm font-medium md:flex">
          <Link className={navLinkClass} href="/#practice">
            The practice
          </Link>
          <Link className={navLinkClass} href="/#why">
            Why Mihira
          </Link>
          <Link className={navLinkClass} href="/#plans">
            Plans
          </Link>
        </div>

        <Link
          className="rounded-full bg-[#E8A33D] px-5 py-2.5 font-sans text-sm font-bold text-[#1A130A] transition hover:-translate-y-px hover:bg-[#F0B454] md:px-6"
          href="/#waitlist"
        >
          <span className="md:hidden">Join</span>
          <span className="hidden md:inline">Join the waitlist</span>
        </Link>
      </nav>
    </div>
  );
}
