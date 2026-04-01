import type { BirthChart, MuhuratWindow } from '@/lib/vedic/types';

export const DAILY_SYSTEM = `You are a master Jyotish pandit. You receive Ground Truth planetary data computed by a precise ephemeris engine. You NEVER move planets from the houses provided. You speak directly to the user in the second person using dharma-focused language — no fortune-teller clichés. Respond ONLY in valid JSON with no markdown fences.`;

export function buildDailyPrompt(chart: BirthChart): string {
  return `Here is the user's Vedic birth chart (Whole Sign houses, Lahiri ayanamsha):

Lagna: ${chart.lagna}
Current Dasha: ${chart.currentDasha}
Moon Nakshatra: ${chart.nakshatra}

Planets:
${chart.planets.map(p => `  ${p.name}: ${p.sign} (House ${p.house})`).join('\n')}

Generate a Daily Alignment response. Return ONLY this JSON:
{
  "guidance": "<3 sentences of dharma-focused guidance for today>",
  "reasoning": "<2 sentences explaining the key astrological factors in technical Jyotish terms>"
}`;
}

export const MUHURAT_SYSTEM = `You are a master Jyotish pandit assessing muhurat (auspicious timing) for a specific event. You receive the user's birth chart and pre-calculated timing windows. You NEVER invent planets or change their house positions. Respond ONLY in valid JSON with no markdown fences.`;

export function buildMuhuratPrompt(
  eventType: string,
  chart: BirthChart,
  windows: MuhuratWindow[]
): string {
  const auspicious = windows.filter(w => w.isAuspicious);
  return `Event: ${eventType}

User's birth chart:
  Lagna: ${chart.lagna}, Dasha: ${chart.currentDasha}, Nakshatra: ${chart.nakshatra}
  Key planets: ${chart.planets.slice(0, 5).map(p => `${p.name} in House ${p.house}`).join(', ')}

Auspicious timing windows for today:
${auspicious.map(w => `  ${new Date(w.start).toTimeString().slice(0,5)}–${new Date(w.end).toTimeString().slice(0,5)}: ${w.quality}`).join('\n')}

Return ONLY this JSON:
{
  "recommendation": "Yes" | "No" | "Wait",
  "suggestion": "<2 sentences connecting the best window to the user's personal chart>",
  "reasoning": "<2 sentences of Vedic technical reasoning>"
}`;
}

export const CHAT_SYSTEM = `You are Krishna, a wise and compassionate spiritual guide in Aksha, a Vedic app for the Indian diaspora. You speak with warmth, depth, and directness. You draw on the Bhagavad Gita, Upanishads, and Vedic philosophy. Never be preachy. Keep responses to 2–4 sentences unless the user asks to elaborate.`;
