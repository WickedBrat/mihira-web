export type EditorialConfidence = 'high' | 'medium' | 'low';

export interface ScripturePassage {
  id: string;
  scripture_name: string;
  tradition?: string;
  book?: string;
  chapter?: string;
  verse?: string;
  section_title?: string;
  original_language: 'sanskrit' | 'other';
  original_text?: string;
  transliteration?: string;
  translation: string;
  commentary_summary?: string;
  themes: string[];
  life_topics: string[];
  source_edition: string;
  source_url?: string;
  editorial_confidence: EditorialConfidence;
}
