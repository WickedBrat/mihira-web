import { useState } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';
import { createSupabaseSessionFromUrl } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import { withTimeout } from '@/lib/withTimeout';

WebBrowser.maybeCompleteAuthSession();

type SignInProvider = 'google' | 'apple';

const OAUTH_TIMEOUT_MS = 60000;

const redirectUrl = makeRedirectUri({
  scheme: 'mihira',
  path: 'oauth-native-callback',
});

export function useSignIn(onSuccess?: () => void) {
  const { showToast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<SignInProvider | null>(null);

  const signInWithProvider = async (provider: SignInProvider) => {
    setLoadingProvider(provider);

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('Supabase did not return an OAuth URL.');

      const result = await withTimeout(
        WebBrowser.openAuthSessionAsync(data.url, redirectUrl),
        OAUTH_TIMEOUT_MS,
        `${provider === 'google' ? 'Google' : 'Apple'} sign-in timed out. Close the browser and try again.`
      );

      if (result.type !== 'success') {
        showToast({
          type: 'error',
          title: `${provider === 'google' ? 'Google' : 'Apple'} sign-in was cancelled`,
          message: 'No session was created. Please try again.',
        });
        return false;
      }

      const session = await createSupabaseSessionFromUrl(result.url);
      if (!session) {
        showToast({
          type: 'error',
          title: `${provider === 'google' ? 'Google' : 'Apple'} sign-in was cancelled`,
          message: 'No session was created. Please try again.',
        });
        return false;
      }

      analytics.userSignedIn({ method: provider });
      onSuccess?.();
      return true;
    } catch (err) {
      console.error(`[useSignIn] ${provider} OAuth error`, err);
      showToast({
        type: 'error',
        title: `${provider === 'google' ? 'Google' : 'Apple'} sign-in failed`,
        message: err instanceof Error ? err.message : 'Please try again.',
      });
      return false;
    } finally {
      setLoadingProvider(null);
    }
  };

  const signInWithGoogle = async () => signInWithProvider('google');
  const signInWithApple = async () => signInWithProvider('apple');

  return {
    signInWithGoogle,
    signInWithApple,
    isLoading: loadingProvider !== null,
    loadingProvider,
  };
}
