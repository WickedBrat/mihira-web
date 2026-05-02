jest.mock('@/lib/analytics', () => ({
  analytics: {
    askSourceExpanded: jest.fn(),
    askPassageSaved: jest.fn(),
    askFollowUpPromptTapped: jest.fn(),
  },
}));

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ScriptureAnswerCard } from '@/features/ask/ScriptureAnswerCard';
import type { ScriptureGuideResponse } from '@/features/ask/types';

const response: ScriptureGuideResponse = {
  mode: 'quick',
  topic: 'career_dharma',
  answer: {
    title: 'Act Without Clinging',
    summary: 'You do not need total certainty before right action.',
    practical_guidance: 'Take the next honest step and loosen your grip on the outcome.',
  },
  sources: [
    {
      id: 'gita-2-47',
      scripture: 'Bhagavad Gita',
      citation_label: 'Bhagavad Gita 2.47',
      translation: 'You have a claim on action alone.',
      relevance_reason: 'It addresses action without attachment.',
      confidence: 'high',
      themes: ['duty'],
      life_topics: ['career'],
    },
  ],
  interpretation: {
    synthesis: 'The cited texts turn the focus from control to dharmic action.',
    alternate_view: 'A second reading emphasizes inward renunciation more than external change.',
  },
  action_steps: ['Finish one concrete task today.'],
  follow_up_prompts: ['What does the Gita say about fear?'],
  safety: {
    has_boundary: false,
  },
};

describe('ScriptureAnswerCard', () => {
  it('shows guidance, visible sources, and expandable interpretation', () => {
    const screen = render(
      <ScriptureAnswerCard
        response={response}
        savedSourceIds={new Set()}
        onToggleSavedPassage={jest.fn()}
        onUseFollowUpPrompt={jest.fn()}
      />,
    );

    expect(screen.getByText('Act Without Clinging')).toBeTruthy();
    expect(screen.getByText('Bhagavad Gita 2.47')).toBeTruthy();
    expect(screen.getByText(/Finish one concrete task today\./)).toBeTruthy();
    expect(screen.queryByText('The cited texts turn the focus from control to dharmic action.')).toBeNull();

    fireEvent.press(screen.getByText('Why these apply'));
    expect(screen.getByText('The cited texts turn the focus from control to dharmic action.')).toBeTruthy();

    expect(screen.getByText('What does the Gita say about fear?')).toBeTruthy();
  });
});
