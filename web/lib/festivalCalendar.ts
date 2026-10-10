// lib/festivalCalendar.ts — per-city iCalendar feed. Subscribers' calendars
// re-fetch the same URL, so adding festivals here updates everyone.
import tzlookup from 'tz-lookup';
import { getVrishabhaPradoshWindow, makarSankrantiInstant } from '@/lib/vedic/lakshmiPuja';
import { sunriseSunset } from '@/lib/vedic/muhurat';
import type { DiwaliCity } from '@/lib/diwali';
import { cityLabel } from '@/lib/diwali';

interface Ev { uid: string; title: string; desc: string; start: Date | string; end: Date | string; }

const SITE = 'https://www.getmihira.com';

function utc(d: Date) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
function esc(s: string) { return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function fold(line: string) {
  const out: string[] = [];
  let l = line;
  while (l.length > 60) { out.push(l.slice(0, 60)); l = ' ' + l.slice(60); } // ≤75 octets even with multi-byte chars
  out.push(l);
  return out.join('\r\n');
}
function t(d: Date, tz: string) { return d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }); }

export function buildFestivalEvents(city: DiwaliCity): Ev[] {
  const tz = tzlookup(city.lat, city.lng);
  const label = cityLabel(city);
  const evs: Ev[] = [];
  const page = `${SITE}/diwali/${city.slug}`;

  const dhan = getVrishabhaPradoshWindow(new Date(Date.UTC(2026, 10, 6, 12)), city.lat, city.lng);
  if (dhan.pujaStart && dhan.pujaEnd) evs.push({
    uid: 'dhanteras-2026', title: 'Dhanteras puja',
    desc: `Dhanteras puja window for ${label}: ${t(dhan.pujaStart, tz)} – ${t(dhan.pujaEnd, tz)}. For buying gold, silver or a new vessel, the whole of Trayodashi (all of Friday) is considered good.\n${page}`,
    start: dhan.pujaStart, end: dhan.pujaEnd,
  });
  evs.push({ uid: 'choti-diwali-2026', title: 'Choti Diwali (Naraka Chaturdashi)', desc: `Abhyang snan before sunrise.\n${page}`, start: '20261107', end: '20261108' });

  const lp = getVrishabhaPradoshWindow(new Date(Date.UTC(2026, 10, 8, 12)), city.lat, city.lng);
  if (lp.pujaStart && lp.pujaEnd) evs.push({
    uid: 'lakshmi-puja-2026', title: 'Lakshmi Puja muhurat (Diwali)',
    desc: `Diwali Lakshmi Puja for ${label}: ${t(lp.pujaStart, tz)} – ${t(lp.pujaEnd, tz)}. Sunset ${t(lp.sunset, tz)}; Pradosh Kaal until ${t(lp.pradoshEnd, tz)}. Worked out for your sunset, not converted from India time.\n${page}`,
    start: lp.pujaStart, end: lp.pujaEnd,
  });
  evs.push({ uid: 'govardhan-2026', title: 'Govardhan Puja / Annakut', desc: `In the US this is Monday. Indian calendars show Tuesday because Pratipada reaches sunrise a day later there.\n${SITE}/blog/diwali-2026-dates-usa`, start: '20261109', end: '20261110' });
  evs.push({ uid: 'bhai-dooj-2026', title: 'Bhai Dooj', desc: `In the US this is Tuesday, one day earlier than in India.\n${SITE}/blog/diwali-2026-dates-usa`, start: '20261110', end: '20261111' });
  evs.push({ uid: 'dev-uthani-2026', title: 'Dev Uthani Ekadashi', desc: `Traditionally ends Chaturmas, and the wedding season begins after it.\n${SITE}`, start: '20261120', end: '20261121' });

  const sank = makarSankrantiInstant(new Date(Date.UTC(2027, 0, 14)));
  const localDay = sank.toLocaleDateString('en-CA', { timeZone: tz }).replace(/-/g, '');
  const { sunset } = sunriseSunset(new Date(Date.UTC(+localDay.slice(0, 4), +localDay.slice(4, 6) - 1, +localDay.slice(6), 12)), city.lat, city.lng);
  if (sunset > sank) evs.push({
    uid: 'makar-sankranti-2027', title: 'Makar Sankranti punya kaal',
    desc: `The Sun enters Makara at ${t(sank, tz)} in ${label}, so punya kaal runs from then until sunset (${t(sunset, tz)}). In India it is observed a day later, because there the moment falls after sunset.\n${SITE}`,
    start: sank, end: sunset,
  });
  else {
    const d = new Date(Date.UTC(+localDay.slice(0, 4), +localDay.slice(4, 6) - 1, +localDay.slice(6) + 1));
    const ds = d.toISOString().slice(0, 10).replace(/-/g, '');
    const de = new Date(d.getTime() + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    evs.push({ uid: 'makar-sankranti-2027', title: 'Makar Sankranti', desc: `The Sun enters Makara after sunset, so it is observed the next day.\n${SITE}`, start: ds, end: de });
  }
  return evs;
}

export function buildIcs(city: DiwaliCity): string {
  const now = utc(new Date());
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mihira//Festival Calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:Hindu festivals · ${city.name} (Mihira)`,
    `X-WR-CALDESC:Festival dates and puja windows computed for ${cityLabel(city)}. Updates automatically.`,
    'REFRESH-INTERVAL;VALUE=DURATION:P1D', 'X-PUBLISHED-TTL:P1D',
  ];
  for (const e of buildFestivalEvents(city)) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}-${city.slug}@getmihira.com`, `DTSTAMP:${now}`);
    if (typeof e.start === 'string') lines.push(`DTSTART;VALUE=DATE:${e.start}`, `DTEND;VALUE=DATE:${e.end as string}`, 'TRANSP:TRANSPARENT');
    else lines.push(`DTSTART:${utc(e.start)}`, `DTEND:${utc(e.end as Date)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)} begins in 30 minutes`, 'TRIGGER:-PT30M', 'END:VALARM');
    lines.push(`SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.desc)}`, `URL:${SITE}/diwali/${city.slug}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
