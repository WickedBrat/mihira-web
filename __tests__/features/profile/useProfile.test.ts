import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfile } from '@/features/profile/useProfile';

// Mock Clerk
const mockGetToken = jest.fn().mockResolvedValue('test-jwt');
jest.mock('@clerk/expo', () => ({
  useAuth: jest.fn(),
  useSession: jest.fn(),
}));

// Mock Supabase client
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockUpdate = jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) }));
const mockUpsert = jest.fn().mockResolvedValue({ error: null });
const mockFrom = jest.fn(() => ({
  upsert: mockUpsert,
  select: mockSelect,
  update: mockUpdate,
}));
const mockClient = { from: mockFrom };

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(() => mockClient),
}));

jest.mock('@/components/ui/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const { useAuth, useSession } = require('@clerk/expo') as {
  useAuth: jest.Mock;
  useSession: jest.Mock;
};

describe('useProfile (signed out)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isLoaded: true, isSignedIn: false, userId: null, getToken: mockGetToken });
    useSession.mockReturnValue({ isLoaded: true, session: null });
  });

  it('returns initial empty profile when signed out', () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.profile.name).toBe('');
    expect(result.current.profile.language).toBe('English');
  });

  it('does not call Supabase when signed out', () => {
    renderHook(() => useProfile());
    expect(mockFrom).not.toHaveBeenCalled();
  });
});

describe('useProfile (signed in)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: 'user_123',
      getToken: mockGetToken,
    });
    useSession.mockReturnValue({
      isLoaded: true,
      session: { id: 'sess_123', getToken: mockGetToken },
    });
    mockSingle.mockResolvedValue({
      data: {
        id: 'user_123',
        name: 'Arjun',
        birth_dt: '01/01/2000, 9:00 AM',
        birth_place: 'Mumbai, India',
        language: 'Hindi',
        region: 'India',
        focus_area: 'purpose',
      },
      error: null,
    });
  });

  it('fetches and populates profile from Supabase on mount', async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.profile.name).toBe('Arjun'));
    expect(result.current.profile.language).toBe('Hindi');
    expect(result.current.profile.birth_place).toBe('Mumbai, India');
  });

  it('updateField updates local state immediately', async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.profile.name).toBe('Arjun'));
    act(() => {
      result.current.updateField('name', 'Krishna');
    });
    expect(result.current.profile.name).toBe('Krishna');
  });
});
