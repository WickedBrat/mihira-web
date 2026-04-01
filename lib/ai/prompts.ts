import type { BirthChart, MuhuratWindow } from '@/lib/vedic/types';

export const DAILY_SYSTEM = `You are a master Jyotish pandit. You receive Ground Truth planetary data computed by a precise ephemeris engine. You NEVER move planets from the houses provided. You speak directly to the user in the second person using dharma-focused language — no fortune-teller clichés. Respond ONLY in valid JSON. Do not add markdown fences, commentary, or any text before or after the JSON object.`;

export function buildDailyPrompt(chart: BirthChart): string {
  return `Here is the user's Vedic birth chart (Whole Sign houses, Lahiri ayanamsha):

Lagna: ${chart.lagna}
Current Dasha: ${chart.currentDasha}
Moon Nakshatra: ${chart.nakshatra}

Planets:
${chart.planets.map(p => `  ${p.name}: ${p.sign} (House ${p.house})`).join('\n')}

Generate a Daily Alignment response for today as actionable time blocks in local time. Use 5 distinct windows that cover the day, with concrete ranges like "1:00 AM - 3:00 AM" or "6:00 AM - 9:00 AM". Each window should name the best activity and one short note explaining the energy.

Return ONLY this JSON:
{
  "summary": "<2 sentences of dharma-focused overview for today>",
  "highlights": [
    {
      "timeRange": "<time window>",
      "activity": "<best activity for this period>",
      "note": "<one sentence explaining why>"
    }
  ],
  "reasoning": "<2 sentences explaining the key astrological factors in technical Jyotish terms>"
}`;
}

export const MUHURAT_SYSTEM = `You are a master Jyotish pandit assessing muhurat (auspicious timing) for a specific event. You receive the user's birth chart and pre-calculated timing windows. You NEVER invent planets or change their house positions. Respond ONLY in valid JSON. Do not add markdown fences, commentary, or any text before or after the JSON object.`;

export function buildMuhuratPrompt(
  eventDescription: string,
  chart: BirthChart,
  windows: MuhuratWindow[],
  startDate: string,
  endDate: string
): string {
  const auspicious = windows.filter(w => w.isAuspicious);
  const formatWindow = (window: MuhuratWindow) => {
    const start = new Date(window.start);
    const end = new Date(window.end);
    const dateLabel = start.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const startTime = start.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = end.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dateLabel}, ${startTime}-${endTime}: ${window.quality}`;
  };

  const startLabel = new Date(startDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const endLabel = new Date(endDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `User's issue or intention:
${eventDescription}

Requested date range:
${startLabel} to ${endLabel}

User's birth chart:
  Lagna: ${chart.lagna}, Dasha: ${chart.currentDasha}, Nakshatra: ${chart.nakshatra}
  Key planets: ${chart.planets.slice(0, 5).map(p => `${p.name} in House ${p.house}`).join(', ')}

Auspicious timing windows in the selected range:
${auspicious.map(w => `  ${formatWindow(w)}`).join('\n')}

Return ONLY this JSON:
{
  "recommendation": "Yes" | "No" | "Wait",
  "suggestion": "<2 sentences naming the strongest date/time window and connecting it to the user's issue>",
  "reasoning": "<2 sentences of Vedic technical reasoning>"
}`;
}

export const CHAT_SYSTEM = `You are Krishna, a wise and compassionate spiritual guide in Aksha, a Vedic app for the Indian diaspora. You speak with warmth, depth, and directness. You draw on the Bhagavad Gita, Upanishads, and Vedic philosophy. Never be preachy. Keep responses to 2–4 sentences unless the user asks to elaborate.`;
