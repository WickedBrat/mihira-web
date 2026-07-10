import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { blogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Scripture-grounded essays on sacred timing, decision-making, dharma, and grief — for life lived far from the temples and elders that traditionally guided it.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />

      <div className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-14 md:pt-20">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E8A33D]">The Mihira Blog</span>
        <h1 className="mt-3 max-w-[18ch] [font-family:var(--font-display)] text-[clamp(2.2rem,4.6vw,3rem)] font-medium leading-[1.12] text-[#F7F1E3]">
          Scripture-grounded writing on timing, duty, and distance.
        </h1>
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-[#F2EAD9]/60">
          Essays on sacred timing, decision-making, and grief — for anyone navigating them without a temple,
          priest, or family astrologer nearby.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-7 max-lg:grid-cols-1">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-3xl border border-[#E8A33D]/[0.14] bg-[linear-gradient(180deg,rgba(38,28,16,0.6),rgba(24,18,11,0.6))] p-8 transition hover:border-[#E8A33D]/40"
            >
              <div className="flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
                <span>{post.kicker}</span>
                <span className="h-1 w-1 rounded-full bg-[#E8A33D]/50" />
                <span className="text-[#F2EAD9]/40">{post.readTime}</span>
              </div>
              <h2 className="[font-family:var(--font-display)] text-2xl font-semibold leading-[1.2] text-[#F7F1E3] transition group-hover:text-[#E8A33D]">
                {post.title}
              </h2>
              <p className="text-[14px] leading-[1.7] text-[#F2EAD9]/60">{post.excerpt}</p>
              <span className="mt-2 font-sans text-[13px] font-semibold text-[#E8A33D]">Read the essay →</span>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
