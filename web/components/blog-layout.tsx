import type { ReactNode } from 'react';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import type { BlogContentBlock } from '@/lib/blog-posts';

export function BlogLayout({
  kicker,
  title,
  meta,
  children,
}: {
  kicker: string;
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />

      <div className="mx-auto w-full max-w-[720px] px-6 pb-24 pt-14 md:pt-20">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E8A33D]">{kicker}</span>
        <h1 className="mt-3 [font-family:var(--font-display)] text-[clamp(2rem,4.4vw,2.75rem)] font-medium leading-[1.15] text-[#F7F1E3]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#F2EAD9]/45">{meta}</p>

        <div className="mt-10 flex flex-col gap-6">{children}</div>
      </div>

      <SiteFooter />
    </main>
  );
}

export function BlogContent({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={index}
              className="mt-4 [font-family:var(--font-display)] text-2xl font-semibold text-[#F7F1E3] md:text-[26px]"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={index}
              className="my-2 border-l-2 border-[#E8A33D]/50 pl-5 [font-family:var(--font-display)] text-xl italic leading-[1.5] text-[#F2EAD9]/90"
            >
              {block.text}
              {block.attribution ? (
                <footer className="mt-2 font-sans text-xs not-italic uppercase tracking-[0.14em] text-[#F2EAD9]/45">
                  {block.attribution}
                </footer>
              ) : null}
            </blockquote>
          );
        }

        if (block.type === 'callout') {
          return (
            <aside
              key={index}
              className="rounded-2xl border border-[#E8A33D]/25 bg-[#261C10]/50 px-6 py-5"
            >
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
                {block.title}
              </span>
              <p className="mt-2 text-[16px] leading-[1.7] text-[#F2EAD9]/85">{block.text}</p>
            </aside>
          );
        }

        if (block.type === 'table') {
          return (
            <figure key={index} className="my-2">
              <div className="overflow-x-auto rounded-2xl border border-[#E8A33D]/[0.16]">
                <table className="w-full min-w-[520px] border-collapse text-left font-sans text-[14px]">
                  <thead>
                    <tr className="bg-[#261C10]/70">
                      {block.columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8A33D]"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join('|')} className="border-t border-[#E8A33D]/[0.1]">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={
                              cellIndex === 0
                                ? 'px-4 py-3 font-semibold text-[#F7F1E3]'
                                : 'whitespace-nowrap px-4 py-3 text-[#F2EAD9]/75'
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {block.caption ? (
                <figcaption className="mt-3 text-[13px] leading-[1.6] text-[#F2EAD9]/45">{block.caption}</figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="flex flex-col gap-2.5 pl-5 text-[16px] leading-[1.75] text-[#F2EAD9]/70">
              {block.items.map((item) => (
                <li key={item} className="list-disc marker:text-[#E8A33D]">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-[16px] leading-[1.8] text-[#F2EAD9]/70">
            {block.text}
          </p>
        );
      })}
    </>
  );
}
