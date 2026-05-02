import { rankScriptureCandidates } from '@/lib/ai/scriptureRanking';
import type { RetrievalCandidate } from '@/lib/ai/scriptureRetrieval';

const candidates: RetrievalCandidate[] = [
  {
    id: 'a',
    scripture_name: 'Bhagavad Gita',
    citation_label: 'Bhagavad Gita 2.47',
    score: 10,
    confidence: 'high',
    translation: 'A',
    themes: [],
    life_topics: [],
    original_language: 'sanskrit',
    editorial_confidence: 'high',
    source_edition: 'test',
  },
  {
    id: 'b',
    scripture_name: 'Bhagavad Gita',
    citation_label: 'Bhagavad Gita 6.5',
    score: 9,
    confidence: 'high',
    translation: 'B',
    themes: [],
    life_topics: [],
    original_language: 'sanskrit',
    editorial_confidence: 'high',
    source_edition: 'test',
  },
  {
    id: 'c',
    scripture_name: 'Katha Upanishad',
    citation_label: 'Katha Upanishad 1.2.2',
    score: 8,
    confidence: 'high',
    translation: 'C',
    themes: [],
    life_topics: [],
    original_language: 'sanskrit',
    editorial_confidence: 'high',
    source_edition: 'test',
  },
] as RetrievalCandidate[];

describe('scriptureRanking', () => {
  it('preserves diversity in compare mode', () => {
    const result = rankScriptureCandidates(candidates, 'compare');
    expect(result[0].scripture_name).toBe('Bhagavad Gita');
    expect(result[1].scripture_name).toBe('Katha Upanishad');
  });
});
