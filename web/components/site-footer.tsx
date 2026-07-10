import Link from 'next/link';
import { MihiraText } from '@/components/site-nav';

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-[#E8A33D]/10 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-12">
      <span className="[font-family:var(--font-display)] text-lg text-[#F2EAD9]/70">
        <MihiraText />
      </span>
      <span className="text-center text-[13px] text-[#F2EAD9]/45">
        Scripture-grounded guidance. Not professional, medical, or financial advice.
      </span>
      <div className="flex flex-wrap justify-center gap-6 font-sans text-[13px]">
        <Link className="text-[#F2EAD9]/70 transition hover:text-[#E8A33D]" href="/blog">
          Blog
        </Link>
        <Link className="text-[#F2EAD9]/70 transition hover:text-[#E8A33D]" href="/about">
          About
        </Link>
        <Link className="text-[#F2EAD9]/70 transition hover:text-[#E8A33D]" href="/privacy">
          Privacy
        </Link>
        <Link className="text-[#F2EAD9]/70 transition hover:text-[#E8A33D]" href="/terms">
          Terms
        </Link>
        <a className="text-[#F2EAD9]/70 transition hover:text-[#E8A33D]" href="mailto:founders@getmihira.com">
          Contact
        </a>
      </div>
    </footer>
  );
}
