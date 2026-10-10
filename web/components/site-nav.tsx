import Image from 'next/image';
import Link from 'next/link';
import { Charmonman } from 'next/font/google';
import mihiraLogo from '@/app/logo.svg';

const charmonman = Charmonman({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const navLinkClass =
  'text-[#F2EAD9]/70 transition-colors hover:text-[#F2EAD9] focus-visible:text-[#F2EAD9] focus-visible:outline-none focus-visible:underline underline-offset-[6px] decoration-[#E8A33D]';
const navAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;

/** The wordmark. Use for the logo only, not inside running text. */
export function MihiraText() {
  return <span className={charmonman.className}>Mihira</span>;
}

export function MarkGlyph({ size = 26 }: { size?: number }) {
  return <Image src={mihiraLogo} width={size} height={size} alt="" aria-hidden="true" unoptimized />;
}

export function SiteNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-[#F2EAD9]/[0.08] bg-[#0F0C08]/92 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between gap-6 px-6 lg:px-12">
        <Link className="flex items-center gap-2.5 text-[22px] leading-none text-[#F2EAD9]" href="/">
          <MarkGlyph size={24} />
          <MihiraText />
        </Link>

        <div className="hidden items-center gap-8 text-[15px] md:flex">
          <Link className={navLinkClass} href="/muhurat-finder">
            Sacred Timing
          </Link>
          <Link className={navLinkClass} href="/ask-mihira">
            Ask Mihira
          </Link>
          <Link className={navLinkClass} href="/#plans">
            Plans
          </Link>
          <Link className={navLinkClass} href="/blog">
            Blog
          </Link>
        </div>

        <Link
          className="rounded-md bg-[#E8A33D] px-4 py-2 text-[15px] font-semibold text-[#1A130A] transition-colors hover:bg-[#F0B454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D]"
          href={navAppStoreUrl || '/#waitlist'}
        >
          {navAppStoreUrl ? 'Get the app' : 'Join the waitlist'}
        </Link>
      </nav>
    </div>
  );
}
