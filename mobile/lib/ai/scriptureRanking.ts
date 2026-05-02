import type { AskResponseMode } from '@/features/ask/types';
import type { RetrievalCandidate } from '@/lib/ai/scriptureRetrieval';
import { getScriptureModeConfig } from '@/lib/ai/scriptureModes';

function distinctByScripture(candidates: RetrievalCandidate[], targetCount: number): RetrievalCandidate[] {
  const selected: RetrievalCandidate[] = [];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    if (!seen.has(candidate.scripture_name)) {
      selected.push(candidate);
      seen.add(candidate.scripture_name);
    }
    if (selected.length === targetCount) return selected;
  }

  for (const candidate of candidates) {
    if (selected.some((entry) => entry.id === candidate.id)) continue;
    selected.push(candidate);
    if (selected.length === targetCount) return selected;
  }

  return selected;
}

export function rankScriptureCandidates(
  candidates: RetrievalCandidate[],
  mode: AskResponseMode,
): RetrievalCandidate[] {
  const config = getScriptureModeConfig(mode);
  const sorted = [...candidates].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.scripture_name !== b.scripture_name) return a.scripture_name.localeCompare(b.scripture_name);
    return a.id.localeCompare(b.id);
  });

  if (config.requireSourceDiversity) {
    return distinctByScripture(sorted, config.finalSourceCount);
  }

  return sorted.slice(0, config.finalSourceCount);
}
