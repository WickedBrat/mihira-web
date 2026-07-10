import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogContent, BlogLayout } from '@/components/blog-layout';
import { blogPosts, getBlogPost } from '@/lib/blog-posts';

const siteUrl = 'https://www.getmihira.com';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: post.seoTitle,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Mihira',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mihira',
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger -- static server-generated JSON-LD, not user input */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(articleSchema)}
      </script>

      <BlogLayout
        kicker={post.kicker}
        title={post.title}
        meta={`${new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} · ${post.readTime}`}
      >
        <BlogContent blocks={post.content} />

        <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[#E8A33D]/[0.16] bg-[#261C10]/40 p-7">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
            Put this into practice
          </span>
          <div className="flex flex-wrap gap-3">
            {post.relatedFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="rounded-full border border-[#E8A33D]/30 px-5 py-2.5 font-sans text-sm font-semibold text-[#F2EAD9] transition hover:border-[#E8A33D] hover:text-[#E8A33D]"
              >
                {feature.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
            More from the blog
          </span>
          <div className="flex flex-col gap-3">
            {otherPosts.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="text-[15px] font-semibold text-[#F2EAD9]/80 underline underline-offset-4 transition hover:text-[#E8A33D]"
              >
                {other.title}
              </Link>
            ))}
          </div>
        </div>
      </BlogLayout>
    </>
  );
}
