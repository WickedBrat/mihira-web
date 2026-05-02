export function toJDE(year: number, month: number, day: number, hourUT = 0): number {
  const Y = month > 2 ? year : year - 1;
  const M = month > 2 ? month : month + 12;
  const A = Math.trunc(Y / 100);
  const B = 2 - A + Math.trunc(A / 4);
  return (
    Math.trunc(365.25 * (Y + 4716)) +
    Math.trunc(30.6001 * (M + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

export function lahiriAyanamsha(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return 23.85 + T * (50.3 / 3600);
}

export function toSidereal(tropicalDeg: number, jde: number): number {
  return ((tropicalDeg - lahiriAyanamsha(jde)) % 360 + 360) % 360;
}

export function parseBirthDt(birthDt: string): {
  year: number; month: number; day: number; hour: number; minute: number;
} {
  const [datePart, timePart] = birthDt.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [timeStr, ampm] = timePart.split(' ');
  let [hour, minute] = timeStr.split(':').map(Number);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return { year, month, day, hour, minute };
}
