jest.mock('@clerk/expo', () => ({
  useAuth: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock('@/components/ui/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@/lib/analytics', () => ({
  analytics: {
    subscriptionUpgraded: jest.fn(),
  },
}));

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/revenuecat', () => ({
  getRevenueCatUiUnavailableMessage: jest.fn(),
  getPaywallResult: jest.fn(),
  getRevenueCatApiKey: jest.fn(),
  getRevenueCatEntitlementId: jest.fn(),
  hasActiveEntitlement: jest.fn(),
  hasRevenueCatNativeUiModules: jest.fn(),
  isRevenueCatResultSuccessful: jest.fn(),
  loadRevenueCatModules: jest.fn(),
}));

import { getSubscriptionProfilePatch, isMirroredPlus } from '@/lib/subscription';
import { LIMITS } from '@/lib/usage';

describe('subscription helpers', () => {
  it('builds a Plus profile patch for Supabase mirroring', () => {
    expect(getSubscriptionProfilePatch('user_123', 'plus', 'revenuecat', '2026-04-19T08:00:00.000Z')).toEqual({
      id: 'user_123',
      subscription_plan: 'plus',
      subscription_status: 'active',
      subscription_source: 'revenuecat',
      subscription_updated_at: '2026-04-19T08:00:00.000Z',
      updated_at: '2026-04-19T08:00:00.000Z',
    });
  });

  it('builds a Free profile patch for Supabase mirroring', () => {
    expect(getSubscriptionProfilePatch('user_123', 'free', 'supabase', '2026-04-19T08:00:00.000Z')).toEqual({
      id: 'user_123',
      subscription_plan: 'free',
      subscription_status: 'inactive',
      subscription_source: 'supabase',
      subscription_updated_at: '2026-04-19T08:00:00.000Z',
      updated_at: '2026-04-19T08:00:00.000Z',
    });
  });

  it('detects a mirrored Plus subscription correctly', () => {
    expect(isMirroredPlus({ subscription_plan: 'plus', subscription_status: 'active' })).toBe(true);
    expect(isMirroredPlus({ subscription_plan: 'free', subscription_status: 'inactive' })).toBe(false);
    expect(isMirroredPlus(null)).toBe(false);
  });
});

describe('free-tier limits', () => {
  it('caps Muhurat to 3 free calls and Guidance to 5 free queries', () => {
    expect(LIMITS).toEqual({
      muhurat: 3,
      ask: 5,
    });
  });
});
