import { renderHook, act, waitFor } from '@testing-library/react-native';
import type { ScriptureGuideResponse } from '@/features/ask/types';

jest.mock('@/lib/auth', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/lib/analytics', () => ({
  analytics: {
    askSubmitted: jest.fn(),
    askPassageSaved: jest.fn(),
    askFollowUpPromptTapped: jest.fn(),
  },
}));

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/askStorage', () => ({
  DEFAULT_ASK_CONTEXT: {
    userName: 'Seeker',
    interactionCount: 0,
    lastMode: 'quick',
    lastTopic: null,
    lastQuestion: null,
  },
  clearAskConversation: jest.fn(),
  loadAskContext: jest.fn(),
  loadAskHistory: jest.fn(),
  loadAskMessages: jest.fn(),
  loadSavedPassages: jest.fn(),
  saveAskContext: jest.fn(),
  saveAskHistory: jest.fn(),
  saveAskMessages: jest.fn(),
  saveSavedPassages: jest.fn(),
}));

import { useUser } from '@/lib/auth';
import { apiFetch } from '@/lib/apiFetch';
import { getSupabaseClient } from '@/lib/supabase';
import {
  loadAskContext,
  loadAskHistory,
  loadAskMessages,
  loadSavedPassages,
  saveAskHistory,
  saveAskMessages,
  DEFAULT_ASK_CONTEXT,
} from '@/lib/askStorage';
import { useAskState } from '@/features/ask/useAskState';

const mockResponse: ScriptureGuideResponse = {
  mode: 'quick',
  topic: 'career_dharma',
  answer: { title: 'Test', summary: 'summary', practical_guidance: 'guidance' },
  sources: [],
  interpretation: { synthesis: 'synthesis' },
  action_steps: [],
  follow_up_prompts: [],
  safety: { has_boundary: false },
};

describe('useAskState bearer token attachment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: { id: 'user_123', firstName: null } });
    (loadAskContext as jest.Mock).mockResolvedValue({ ...DEFAULT_ASK_CONTEXT });
    (loadAskMessages as jest.Mock).mockResolvedValue([]);
    (loadSavedPassages as jest.Mock).mockResolvedValue([]);
    (loadAskHistory as jest.Mock).mockResolvedValue([]);
    (saveAskMessages as jest.Mock).mockResolvedValue(undefined);
    (saveAskHistory as jest.Mock).mockResolvedValue(undefined);
    (apiFetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
  });

  it('attaches the Supabase access token as a Bearer header when a session exists', async () => {
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'token-abc' } } }),
      },
    });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/ask',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-abc' }),
      }),
    );
  });

  it('omits the Authorization header when there is no session', async () => {
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    const [, options] = (apiFetch as jest.Mock).mock.calls[0];
    expect(options.headers).not.toHaveProperty('Authorization');
  });
});
