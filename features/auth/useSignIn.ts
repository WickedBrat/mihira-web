import { useState } from 'react';
import { useOAuth } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';

WebBrowser.maybeCompleteAuthSession();

type SignInProvider = 'google' | 'apple';

export function useSignIn(onSuccess?: () => void) {
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
  const { showToast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<SignInProvider | null>(null);

  const signInWithGoogle = async () => {
    setLoadingProvider('google');
    try {
      const { createdSessionId, setActive } = await googleOAuth.startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        analytics.userSignedIn({ method: 'google' });
        onSuccess?.();
        return true;
      }

      return false;
    } catch (err) {
      console.error('[useSignIn] Google OAuth error', err);
      showToast({
        type: 'error',
        title: 'Google sign-in failed',
        message: 'Please try again.',
      });
      return false;
    } finally {
      setLoadingProvider(null);
    }
  };

  const signInWithApple = async () => {
    setLoadingProvider('apple');
    try {
      const { createdSessionId, setActive } = await appleOAuth.startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        analytics.userSignedIn({ method: 'apple' });
        onSuccess?.();
        return true;
      }

      return false;
    } catch (err) {
      console.error('[useSignIn] Apple OAuth error', err);
      showToast({
        type: 'error',
        title: 'Apple sign-in failed',
        message: 'Please try again.',
      });
      return false;
    } finally {
      setLoadingProvider(null);
    }
  };

  return { signInWithGoogle, signInWithApple, isLoading: loadingProvider !== null, loadingProvider };
}
