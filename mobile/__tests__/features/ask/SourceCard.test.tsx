jest.mock('@/lib/analytics', () => ({
  analytics: {
    askSourceExpanded: jest.fn(),
    askPassageSaved: jest.fn(),
  },
}));

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SourceCard } from '@/features/ask/SourceCard';

const source = {
  id: 'gita-2-47',
  scripture: 'Bhagavad Gita',
  citation_label: 'Bhagavad Gita 2.47',
  transliteration: 'karmany evadhikaras te ma phalesu kadacana',
  translation: 'You have a claim on action alone.',
  relevance_reason: 'It addresses action without attachment.',
  confidence: 'high' as const,
  themes: ['duty'],
  life_topics: ['career'],
};

describe('SourceCard', () => {
  it('shows the relevance summary and expands to reveal the full passage', () => {
    const screen = render(
      <SourceCard
        source={source}
        isSaved={false}
        onToggleSaved={jest.fn()}
      />,
    );

    expect(screen.getByText('It addresses action without attachment.')).toBeTruthy();
    expect(screen.queryByText('Retrieval Confidence high')).toBeNull();

    fireEvent.press(screen.getByText('Read Full Passage'));
    expect(screen.getByText('Retrieval Confidence high')).toBeTruthy();
    expect(screen.getByText(/कर्म/)).toBeTruthy();
    expect(screen.getByText('karmany evadhikaras te ma phalesu kadacana')).toBeTruthy();
  });
});
