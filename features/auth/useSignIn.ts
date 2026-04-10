import { useState } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useToast } from '@/components/ui/ToastProvider';
import { analytics } from '@/lib/analytics';

WebBrowser.maybeCompleteAuthSession();

export function useSignIn(onSuccess?: () => void) {
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await googleOAuth.startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        analytics.userSignedIn({ method: 'google' });
        onSuccess?.();
      }
    } catch (err) {
      console.error('[useSignIn] Google OAuth error', err);
      showToast({
        type: 'error',
        title: 'Google sign-in failed',
        message: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await appleOAuth.startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        analytics.userSignedIn({ method: 'apple' });
        onSuccess?.();
      }
    } catch (err) {
      console.error('[useSignIn] Apple OAuth error', err);
      showToast({
        type: 'error',
        title: 'Apple sign-in failed',
        message: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle, signInWithApple, isLoading };
}
