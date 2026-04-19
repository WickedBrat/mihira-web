import { NativeModules, Platform } from 'react-native';

type RevenueCatModules = {
  purchases: any | null;
  ui: any | null;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

export function getRevenueCatApiKey(): string | undefined {
  if (Platform.OS === 'ios') return readEnv('EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY');
  if (Platform.OS === 'android') return readEnv('EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY');
  return readEnv('EXPO_PUBLIC_REVENUECAT_WEB_API_KEY');
}

export function getRevenueCatEntitlementId(): string {
  return readEnv('EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID') ?? 'default';
}

export function getRevenueCatOfferingId(): string | undefined {
  return readEnv('EXPO_PUBLIC_REVENUECAT_OFFERING_ID');
}

export function loadRevenueCatModules(): RevenueCatModules {
  try {
    const purchasesModule = require('react-native-purchases');
    const purchases = purchasesModule?.default ?? purchasesModule;

    let ui: any | null = null;
    try {
      const uiModule = require('react-native-purchases-ui');
      ui = uiModule?.default ?? uiModule?.RevenueCatUI ?? uiModule;
    } catch {
      ui = null;
    }

    return { purchases, ui };
  } catch {
    return { purchases: null, ui: null };
  }
}

function isExpoGo(): boolean {
  return Boolean((globalThis as { expo?: { modules?: { ExpoGo?: unknown } } }).expo?.modules?.ExpoGo);
}

export function hasRevenueCatNativeUiModules(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(NativeModules.RNPaywalls && NativeModules.RNCustomerCenter);
}

export function getRevenueCatUiUnavailableMessage(): string {
  if (Platform.OS === 'web') {
    return 'Subscriptions are currently handled inside the iPhone and Android apps.';
  }

  if (isExpoGo()) {
    return 'RevenueCat paywalls require a development build or production app. Expo Go does not include the native billing UI.';
  }

  return 'This build does not include RevenueCat paywall UI. Rebuild the app after linking the RevenueCat native modules.';
}

export function isRevenueCatResultSuccessful(result: unknown): boolean {
  return result === 'PURCHASED' || result === 'RESTORED';
}

export function getPaywallResult(response: any): string | undefined {
  if (typeof response === 'string') return response;
  if (response && typeof response.result === 'string') return response.result;
  return undefined;
}

export function hasActiveEntitlement(customerInfo: any, entitlementId: string): boolean {
  if (!customerInfo) return false;

  if (entitlementId) {
    const direct = customerInfo?.entitlements?.[entitlementId];
    if (direct?.isActive === true) return true;

    const active = customerInfo?.entitlements?.active?.[entitlementId];
    if (active?.isActive === true) return true;

    const all = customerInfo?.entitlements?.all?.[entitlementId];
    if (all?.isActive === true) return true;
  }

  const activeEntitlements = customerInfo?.entitlements?.active;
  if (activeEntitlements && typeof activeEntitlements === 'object' && Object.keys(activeEntitlements).length > 0) {
    return true;
  }

  const activeSubscriptions = customerInfo?.activeSubscriptions;
  if (Array.isArray(activeSubscriptions) && activeSubscriptions.length > 0) {
    return true;
  }

  return false;
}
