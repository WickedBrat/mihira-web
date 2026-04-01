import {
  sunTropicalLongitude,
  moonTropicalLongitude,
  rahuTropicalLongitude,
  planetTropicalLongitude,
  ascendantTropical,
  norm360,
} from '@/lib/vedic/ephemeris';

const J2000 = 2451545.0;

describe('sunTropicalLongitude', () => {
  it('returns ~280.46 at J2000.0', () => {
    expect(sunTropicalLongitude(J2000)).toBeCloseTo(280.46, 0);
  });
  it('returns a value in [0, 360)', () => {
    const lng = sunTropicalLongitude(J2000);
    expect(lng).toBeGreaterThanOrEqual(0);
    expect(lng).toBeLessThan(360);
  });
});

describe('moonTropicalLongitude', () => {
  it('returns a value in [0, 360)', () => {
    const lng = moonTropicalLongitude(J2000);
    expect(lng).toBeGreaterThanOrEqual(0);
    expect(lng).toBeLessThan(360);
  });
  it('returns ~223 at J2000.0', () => {
    expect(moonTropicalLongitude(J2000)).toBeCloseTo(223, 0);
  });
});

describe('rahuTropicalLongitude', () => {
  it('returns ~125.04 at J2000.0', () => {
    expect(rahuTropicalLongitude(J2000)).toBeCloseTo(125.04, 0);
  });
});

describe('planetTropicalLongitude', () => {
  it('returns a value in [0,360) for each planet', () => {
    for (const planet of ['Mercury','Venus','Mars','Jupiter','Saturn'] as const) {
      const lng = planetTropicalLongitude(J2000, planet);
      expect(lng).toBeGreaterThanOrEqual(0);
      expect(lng).toBeLessThan(360);
    }
  });
});

describe('ascendantTropical', () => {
  it('returns a value in [0,360)', () => {
    // Mumbai coordinates, noon on 2000-Jan-1
    const asc = ascendantTropical(J2000, 19.076, 72.877);
    expect(asc).toBeGreaterThanOrEqual(0);
    expect(asc).toBeLessThan(360);
  });
});
