import Link from 'next/link';
import { DIWALI_CITIES, cityLabel, lakshmiPujaFor, type DiwaliCity } from '@/lib/diwali';

export function DiwaliTable({ cities = DIWALI_CITIES, highlight }: { cities?: DiwaliCity[]; highlight?: string }) {
  const rows = cities.map((c) => ({ c, t: lakshmiPujaFor(c.lat, c.lng) }));
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#E8A33D]/15">
      <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
        <caption className="sr-only">Lakshmi Puja muhurat by US city, Sunday November 8, 2026</caption>
        <thead>
          <tr className="bg-[#17120B] font-sans text-[11px] uppercase tracking-[0.16em] text-[#E8A33D]">
            <th scope="col" className="px-4 py-3 font-bold">City</th>
            <th scope="col" className="px-4 py-3 font-bold">Lakshmi Puja</th>
            <th scope="col" className="px-4 py-3 font-bold">Sunset</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ c, t }) => (
            <tr key={c.slug} className={`border-t border-[#E8A33D]/10 ${c.slug === highlight ? 'bg-[#E8A33D]/10' : ''}`}>
              <th scope="row" className="px-4 py-3 font-semibold text-[#F7F1E3]">
                <Link href={`/diwali/${c.slug}`} className="underline-offset-4 hover:text-[#E8A33D] hover:underline">{cityLabel(c)}</Link>
              </th>
              <td className="px-4 py-3 tabular-nums text-[#F7F1E3]">{t.pujaStart} – {t.pujaEnd} <span className="text-[#F2EAD9]/45">{t.tzAbbr}</span></td>
              <td className="px-4 py-3 tabular-nums text-[#F2EAD9]/65">{t.sunset}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
