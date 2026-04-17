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
  translation: 'You have a claim on action alone.',
  relevance_reason: 'It addresses action without attachment.',
  confidence: 'high' as const,
  themes: ['duty'],
  life_topics: ['career'],
};

describe('SourceCard', () => {
  it('expands to reveal relevance details', () => {
    const screen = render(
      <SourceCard
        source={source}
        isSaved={false}
        onToggleSaved={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Bhagavad Gita 2.47'));
    expect(screen.getByText('It addresses action without attachment.')).toBeTruthy();
  });
});
