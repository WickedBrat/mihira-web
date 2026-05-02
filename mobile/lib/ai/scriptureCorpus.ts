import type { ScriptureSource } from '@/features/ask/types';
import type { EditorialConfidence, ScripturePassage } from '@/lib/scriptures/schema';

import gitaCorpus from '@/lib/scriptures/corpus/gita.json';
import upanishadsCorpus from '@/lib/scriptures/corpus/upanishads.json';
import ramayanaCorpus from '@/lib/scriptures/corpus/ramayana.json';
import yogaSutrasCorpus from '@/lib/scriptures/corpus/yoga-sutras.json';
import companionCorpus from '@/lib/scriptures/corpus/companion-texts.json';

export interface RankedPassage extends ScripturePassage {
  citation_label: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

const corpus = [
  ...(gitaCorpus as ScripturePassage[]),
  ...(upanishadsCorpus as ScripturePassage[]),
  ...(ramayanaCorpus as ScripturePassage[]),
  ...(yogaSutrasCorpus as ScripturePassage[]),
  ...(companionCorpus as ScripturePassage[]),
];

function buildCitationLabel(passage: ScripturePassage): string {
  const location = [passage.chapter, passage.verse].filter(Boolean).join('.');
  if (location) {
    return `${passage.scripture_name} ${location}`;
  }
  if (passage.book && passage.section_title) {
    return `${passage.scripture_name} - ${passage.book}: ${passage.section_title}`;
  }
  if (passage.book) {
    return `${passage.scripture_name} - ${passage.book}`;
  }
  if (passage.section_title) {
    return `${passage.scripture_name} - ${passage.section_title}`;
  }
  return passage.scripture_name;
}

export function editorialConfidenceToResponseConfidence(
  value: EditorialConfidence,
): 'high' | 'medium' | 'low' {
  if (value === 'high') return 'high';
  if (value === 'medium') return 'medium';
  return 'low';
}

export function getScriptureCorpus(): ScripturePassage[] {
  return corpus;
}

export function withCitation(passage: ScripturePassage): ScripturePassage & { citation_label: string } {
  return {
    ...passage,
    citation_label: buildCitationLabel(passage),
  };
}

export function toScriptureSource(
  passage: ScripturePassage,
  relevanceReason: string,
  confidence: 'high' | 'medium' | 'low',
): ScriptureSource {
  const withLabel = withCitation(passage);
  return {
    id: passage.id,
    scripture: passage.scripture_name,
    book: passage.book,
    chapter: passage.chapter,
    verse: passage.verse,
    citation_label: withLabel.citation_label,
    original_text: passage.original_text,
    transliteration: passage.transliteration,
    translation: passage.translation,
    relevance_reason: relevanceReason,
    confidence,
    themes: passage.themes,
    life_topics: passage.life_topics,
  };
}
