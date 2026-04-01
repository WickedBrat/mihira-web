export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

/** Sun's tropical ecliptic longitude (degrees). Meeus Ch.25, accurate ~0.01°. */
export function sunTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return norm360(L0 + C);
}

/** Moon's tropical ecliptic longitude (degrees). Simplified Meeus Ch.47, ~1° accuracy. */
export function moonTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const Lp = norm360(218.3165 + 481267.8813 * T);
  const M  = norm360(134.9634 + 477198.8676 * T);
  const Ms = norm360(357.5291 + 35999.0503  * T);
  const D  = norm360(297.8502 + 445267.1115 * T);
  const F  = norm360(93.2721  + 483202.0175 * T);
  const corr =
     6.2888 * Math.sin(toRad(M)) +
     1.2740 * Math.sin(toRad(2*D - M)) +
     0.6583 * Math.sin(toRad(2*D)) +
     0.2136 * Math.sin(toRad(2*M)) -
     0.1851 * Math.sin(toRad(Ms)) -
     0.1143 * Math.sin(toRad(2*F)) +
     0.0588 * Math.sin(toRad(2*D - 2*M)) +
     0.0572 * Math.sin(toRad(2*D - Ms - M)) +
     0.0533 * Math.sin(toRad(2*D + M)) +
     0.0459 * Math.sin(toRad(2*D - Ms));
  return norm360(Lp + corr);
}

/** Rahu's (mean ascending node) tropical longitude (degrees). */
export function rahuTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return norm360(125.0445 - 1934.1363 * T + 0.0020754 * T * T);
}

interface OrbitalElements {
  L0: number; L1: number;
  a: number;
  e: number;
  omega: number;
}

const ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: { L0: 252.2504, L1: 149474.0722, a: 0.38710, e: 0.20563, omega: 77.456  },
  Venus:   { L0: 181.9798, L1: 58519.2130,  a: 0.72333, e: 0.00677, omega: 131.563 },
  Mars:    { L0: 355.4332, L1: 19141.6965,  a: 1.52366, e: 0.09340, omega: 336.041 },
  Jupiter: { L0: 34.3515,  L1: 3036.3028,   a: 5.20336, e: 0.04849, omega: 14.331  },
  Saturn:  { L0: 50.0774,  L1: 1223.5110,   a: 9.53707, e: 0.05550, omega: 93.057  },
};

function eqCenter(Mdeg: number, e: number): number {
  const r = toRad(Mdeg);
  return toDeg((2*e - 0.25*e*e*e) * Math.sin(r) + 1.25*e*e * Math.sin(2*r));
}

/** Geocentric tropical ecliptic longitude for Mercury–Saturn (degrees, ~1–2° accuracy). */
export function planetTropicalLongitude(
  jde: number,
  planet: 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn'
): number {
  const T = (jde - 2451545.0) / 36525;
  const el = ELEMENTS[planet];
  const L = norm360(el.L0 + el.L1 * T);
  const M = norm360(L - el.omega);
  const C = eqCenter(M, el.e);
  const trueLon = norm360(L + C);
  const v = norm360(trueLon - el.omega);
  const r_p = el.a * (1 - el.e * el.e) / (1 + el.e * Math.cos(toRad(v)));

  const sunLng = sunTropicalLongitude(jde);
  const earthLon = norm360(sunLng + 180);
  const M_sun = norm360(357.52911 + 35999.05029 * T);
  const earthR = 1.000140 - 0.016708 * Math.cos(toRad(M_sun)) - 0.000141 * Math.cos(toRad(2*M_sun));

  const X = r_p * Math.cos(toRad(trueLon)) - earthR * Math.cos(toRad(earthLon));
  const Y = r_p * Math.sin(toRad(trueLon)) - earthR * Math.sin(toRad(earthLon));
  return norm360(toDeg(Math.atan2(Y, X)));
}

/**
 * Ascendant tropical ecliptic longitude (degrees).
 */
export function ascendantTropical(jde: number, lat: number, lng: number): number {
  const jd0 = Math.floor(jde - 0.5) + 0.5;
  const T = (jd0 - 2451545.0) / 36525;
  const gmst0 = norm360(100.4606184 + 36000.7700536 * T + 0.000387933 * T * T);
  const gmst = norm360(gmst0 + 360.985647 * (jde - jd0));
  const lst = norm360(gmst + lng);
  const RAMC = toRad(lst);
  const eps = toRad(23.439291111 - 0.013004167 * T);
  const latRad = toRad(lat);
  const asc = toDeg(Math.atan2(
    -Math.cos(RAMC),
    Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(RAMC)
  ));
  return norm360(asc);
}
