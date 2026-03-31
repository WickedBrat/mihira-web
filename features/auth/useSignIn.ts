import { useState } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export function useSignIn(onSuccess?: () => void) {
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await googleOAuth.startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        onSuccess?.();
      }
    } catch (err) {
      console.error('[useSignIn] Google OAuth error', err);
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
        onSuccess?.();
      }
    } catch (err) {
      console.error('[useSignIn] Apple OAuth error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle, signInWithApple, isLoading };
}
