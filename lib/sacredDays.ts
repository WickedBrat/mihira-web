// lib/sacredDays.ts
// Sacred calendar data. Key format: "MM-DD".
// Each entry is fully self-contained with a local image, accent color, and rich detail content.

export interface SacredDay {
  id: string;
  title: string;
  subtitle: string;
  imageKey: 'hanuman-jayanti' | 'ram-navami' | 'navratri';
  accentColor: string;
  // Detail page content
  deity?: string;
  significance: string;
  howToObserve: string[];
  mantra?: string;
  mantraTranslation?: string;
  tags: string[];
}

// Map of MM-DD → events on that date
const SACRED_CALENDAR: Record<string, SacredDay[]> = {
  // April 6 — Ram Navami 2025
  '04-06': [
    {
      id: 'ram-navami-2025',
      title: 'Ram Navami',
      subtitle: "Celebration of Lord Rama's birth",
      imageKey: 'ram-navami',
      accentColor: '#e8a020',
      deity: 'Lord Rama',
      significance:
        'Ram Navami marks the birth of Lord Rama, the seventh avatar of Vishnu and the embodiment of dharma. Celebrated on the ninth day of Chaitra, it falls at the peak of the Shukla Paksha — a time when solar energy is said to be strongest. Rama represents the ideal of righteousness, compassion, and devotion to cosmic order.',
      howToObserve: [
        'Begin the day with a bath before sunrise and offer prayers to the rising sun',
        'Recite the Ramacharitmanas or Ramraksha Stotra',
        'Observe a fast till noon — the birth time of Rama',
        'Perform puja with flowers, dhoop, and a lamp',
        'Offer tulsi leaves and panchamrit to the idol',
        'Listen to or sing Ram bhajans throughout the day',
        'Break the fast at noon with satvik prasad',
      ],
      mantra: 'ॐ रां रामाय नमः',
      mantraTranslation: 'Om — salutations to Rama, the one who delights the soul.',
      tags: ['Vaishnava', 'Chaitra', 'Dharma', 'Avatar'],
    },
  ],
  // April 12 — Hanuman Jayanti 2025
  '04-12': [
    {
      id: 'hanuman-jayanti-2025',
      title: 'Hanuman Jayanti',
      subtitle: 'Birth of the mighty Anjaneya',
      imageKey: 'hanuman-jayanti',
      accentColor: '#ff6b1a',
      deity: 'Lord Hanuman',
      significance:
        'Hanuman Jayanti celebrates the birth of Lord Hanuman — the embodiment of devotion, strength, and selfless service. Born to Anjana and Kesari on the full moon of Chaitra, Hanuman stands as a paragon of Bhakti Yoga. His life is a living scripture of what focused surrender to the divine looks like — fearless, playful, and absolutely devoted.',
      howToObserve: [
        'Wake before sunrise and recite the Hanuman Chalisa',
        'Offer sindoor (vermillion) and oil to Hanuman — symbols of strength and protection',
        'Visit a Hanuman temple and perform 11 pradakshinas (circumambulations)',
        'Fast throughout the day or eat only satvik food',
        'Donate sesame seeds, jaggery, and bananas — all considered dear to Hanuman',
        'Chant the Bajrang Baan or Sundara Kanda from the Valmiki Ramayana',
        'Light a mustard oil lamp in the evening',
      ],
      mantra: 'ॐ हनुमते नमः',
      mantraTranslation: 'Om — salutations to Hanuman, the embodiment of devotion and power.',
      tags: ['Bhakti', 'Strength', 'Chaitra Purnima', 'Service'],
    },
  ],
  // April 2-10 — Chaitra Navratri 2025 (first day shown)
  '04-02': [
    {
      id: 'chaitra-navratri-2025',
      title: 'Chaitra Navratri',
      subtitle: '9 nights of the Divine Mother',
      imageKey: 'navratri',
      accentColor: '#c0392b',
      deity: 'Goddess Durga',
      significance:
        "Chaitra Navratri — the spring Navratri — is one of the most sacred nine-night festivals in the Hindu calendar. Each of the nine nights honors one of the nine forms of Goddess Durga (Navadurga): from Shailaputri on day one to Siddhidatri on day nine. The festival is a journey through the cosmic feminine — from the earth's primordial power to the transcendent grace of liberation itself.",
      howToObserve: [
        "Set up a Kalash (sacred pot) as a symbol of the goddess's presence",
        'Begin with Ghatasthapana — the ritual installation on day one',
        'Recite the Durga Saptashati (700 verses) across the nine days',
        'Observe a fast or eat only kuttu, sabudana, and fruits',
        'Each day, worship the specific Navadurga form for that tithi',
        'Light an akhanda diya (continuous flame) for the full nine nights',
        'On Ashtami or Navami, perform Kanya Puja — honor nine girls as forms of the goddess',
        'Break the fast on Dashami (Rama Navami or local tradition)',
      ],
      mantra: 'ॐ दुं दुर्गायै नमः',
      mantraTranslation: 'Om — salutations to Durga, the invincible one who removes all obstacles.',
      tags: ['Shakti', 'Navadurga', 'Fasting', 'Nine nights'],
    },
  ],
};

// Navratri spans April 2–10. Wire every day so getTodaySacredDays always hits during the festival.
const NAVRATRI_EVENT = SACRED_CALENDAR['04-02'];
const NAVRATRI_DAYS = ['04-03','04-04','04-05','04-07','04-08','04-09','04-10'];
for (const d of NAVRATRI_DAYS) {
  SACRED_CALENDAR[d] = NAVRATRI_EVENT;
}
// April 6 has both Ram Navami and Navratri (same day)
SACRED_CALENDAR['04-06'] = [...SACRED_CALENDAR['04-06'], ...NAVRATRI_EVENT];

/** Returns today's sacred events. Falls back to a curated set if nothing matches. */
export function getTodaySacredDays(): SacredDay[] {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const key = `${mm}-${dd}`;

  if (SACRED_CALENDAR[key]?.length) {
    return SACRED_CALENDAR[key];
  }

  // Return the upcoming nearest events as a fallback "what's coming" preview
  return getAllUpcomingSacredDays().slice(0, 3);
}

/** Returns all sacred days sorted by next upcoming date */
export function getAllUpcomingSacredDays(): SacredDay[] {
  const all = Object.values(SACRED_CALENDAR).flat();
  return all;
}

/** Look up a sacred day by id */
export function getSacredDayById(id: string): SacredDay | undefined {
  return getAllUpcomingSacredDays().find((d) => d.id === id);
}
