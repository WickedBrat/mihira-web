import Link from 'next/link';
import { MarkGlyph, MihiraText } from '@/components/site-nav';

const footerLinkClass = 'text-[#F2EAD9]/60 transition-colors hover:text-[#F2EAD9]';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#F2EAD9]/[0.08]">
      <div className="mx-auto grid w-full max-w-[1160px] gap-8 px-6 py-12 md:grid-cols-[1fr_auto] md:items-end lg:px-12">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2.5 text-[22px] leading-none text-[#F2EAD9]">
            <MarkGlyph size={22} />
            <MihiraText />
          </span>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-[#F2EAD9]/50">
            Guidance drawn from the scriptures, and timing computed for where you live. Not professional, medical,
            or financial advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <Link className={footerLinkClass} href="/blog">
            Blog
          </Link>
          <Link className={footerLinkClass} href="/about">
            About
          </Link>
          <Link className={footerLinkClass} href="/privacy">
            Privacy
          </Link>
          <Link className={footerLinkClass} href="/terms">
            Terms
          </Link>
          <a className={footerLinkClass} href="mailto:founders@getmihira.com">
            founders@getmihira.com
          </a>
        </div>
      </div>
    </footer>
  );
}
