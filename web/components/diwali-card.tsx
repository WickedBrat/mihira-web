// Shared JSX for Diwali share images (OG 1200×630 and square 1080×1080).
import type { DiwaliCity, LakshmiPujaTimes } from '@/lib/diwali';

export function DiwaliCard({ city, t, square }: { city: DiwaliCity; t: LakshmiPujaTimes; square?: boolean }) {
  const big = square ? 150 : 120;
  const strip = (x: string | null) => (x ?? '').replace(/\s?[AP]M$/, '');
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0F0C08', color: '#F7F1E3', padding: square ? 72 : 56, fontFamily: 'serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', borderRadius: 40, border: '2px solid rgba(232,163,61,0.35)', padding: square ? 72 : 56, background: 'radial-gradient(ellipse at 75% 0%, rgba(232,163,61,0.28), rgba(15,12,8,0) 60%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: 6, color: '#E8A33D', fontFamily: 'sans-serif', fontWeight: 700 }}>DIWALI · SUNDAY, NOV 8</div>
          <div style={{ display: 'flex', fontSize: square ? 64 : 56, lineHeight: 1.1 }}>Lakshmi Puja in {city.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: square ? 'column' : 'row', alignItems: square ? 'flex-start' : 'baseline', gap: square ? 8 : 20, whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', fontSize: big, lineHeight: 1 }}>{strip(t.pujaStart)} – {strip(t.pujaEnd)}</div>
            <div style={{ display: 'flex', fontSize: square ? 48 : big * 0.36, color: '#E8A33D', fontFamily: 'sans-serif', fontWeight: 700 }}>PM {t.tzAbbr}</div>
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: 'rgba(242,234,217,0.7)', fontFamily: 'sans-serif' }}>
            Sunset {t.sunset} · Pradosh Kaal until {t.pradoshEnd}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: square ? 'column' : 'row', justifyContent: 'space-between', alignItems: square ? 'flex-start' : 'center', gap: 14, fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', fontSize: 26, color: 'rgba(242,234,217,0.6)' }}>{square ? <>Worked out for {city.name}&rsquo;s own sunset, not converted from India time</> : <>Computed for {city.name}&rsquo;s sunset, not IST</>}</div>
          <div style={{ display: 'flex', flexShrink: 0, fontSize: 32, fontWeight: 700, color: '#E8A33D' }}>getmihira.com/diwali</div>
        </div>
      </div>
    </div>
  );
}
