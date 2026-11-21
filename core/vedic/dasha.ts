// lib/vedic/dasha.ts

const LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'] as const;
type Lord = typeof LORDS[number];
const YEARS: Record<Lord, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const TOTAL_YEARS = 120;

export function getNakshatraLord(nakshatraIndex: number): Lord {
  return LORDS[nakshatraIndex % 9];
}

export function getCurrentDasha(
  moonSidLng: number,
  birthDate: Date,
  today: Date
): string {
  const nakshatraIdx = Math.floor(moonSidLng / (360 / 27));
  const lordIdx = nakshatraIdx % 9;
  const lord = LORDS[lordIdx];

  // Fraction elapsed in the nakshatra at birth
  const posInNakshatra = (moonSidLng % (360 / 27)) / (360 / 27);
  const yearsRemaining = YEARS[lord] * (1 - posInNakshatra);

  // Build dasha sequence
  const dashas: { lord: Lord; start: Date; end: Date }[] = [];
  let cursor = new Date(birthDate);

  const firstEnd = new Date(cursor.getTime() + yearsRemaining * 365.25 * 86400000);
  dashas.push({ lord, start: new Date(cursor), end: firstEnd });
  cursor = firstEnd;

  for (let i = 1; i <= 10; i++) {
    const nextLord = LORDS[(lordIdx + i) % 9];
    const end = new Date(cursor.getTime() + YEARS[nextLord] * 365.25 * 86400000);
    dashas.push({ lord: nextLord, start: new Date(cursor), end });
    cursor = end;
  }

  const maha = dashas.find(d => today >= d.start && today < d.end) ?? dashas[dashas.length - 1];
  const mahaLordIdx = LORDS.indexOf(maha.lord);

  const mahaDurationMs = maha.end.getTime() - maha.start.getTime();
  let antarCursor = new Date(maha.start);
  let currentAntar: Lord = maha.lord;
  for (let i = 0; i < 9; i++) {
    const antarLord = LORDS[(mahaLordIdx + i) % 9];
    const fraction = YEARS[antarLord] / TOTAL_YEARS;
    const antarEnd = new Date(antarCursor.getTime() + mahaDurationMs * fraction);
    if (today >= antarCursor && today < antarEnd) {
      currentAntar = antarLord;
      break;
    }
    antarCursor = antarEnd;
  }

  return `${maha.lord}-${currentAntar}`;
}
