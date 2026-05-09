import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { getSupabaseClient } from '@/lib/supabase';

type EmailAddress = {
  emailAddress: string;
};

export type AppAuthUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  imageUrl: string | null;
  primaryEmailAddress: EmailAddress | null;
  emailAddresses: EmailAddress[];
};

type AuthContextValue = {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: AppAuthUser | null;
  session: Session | null;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue>({
  isLoaded: false,
  isSignedIn: false,
  userId: null,
  user: null,
  session: null,
  signOut: async () => {},
  deleteAccount: async () => {},
  getToken: async () => null,
});

function getStringMetadata(user: User, keys: string[]) {
  for (const key of keys) {
    const value = user.user_metadata?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return null;
}

function splitName(fullName: string | null) {
  if (!fullName) return { firstName: null, lastName: null };

  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
  return {
    firstName: firstName ?? null,
    lastName: rest.length > 0 ? rest.join(' ') : null,
  };
}

function mapSupabaseUser(user: User | null): AppAuthUser | null {
  if (!user) return null;

  const metadataFullName = getStringMetadata(user, ['full_name', 'name']);
  const firstName = getStringMetadata(user, ['first_name', 'given_name']);
  const lastName = getStringMetadata(user, ['last_name', 'family_name']);
  const split = splitName(metadataFullName);
  const email = user.email ?? getStringMetadata(user, ['email']);
  const gender = getStringMetadata(user, ['gender', 'sex']);
  const imageUrl = getStringMetadata(user, ['avatar_url', 'picture', 'image_url']);
  const emailAddresses = email ? [{ emailAddress: email }] : [];

  return {
    id: user.id,
    email,
    fullName: metadataFullName,
    firstName: firstName ?? split.firstName,
    lastName: lastName ?? split.lastName,
    gender,
    imageUrl,
    primaryEmailAddress: emailAddresses[0] ?? null,
    emailAddresses,
  };
}

export async function createSupabaseSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  if (params.error_description) throw new Error(params.error_description);
  if (params.error) throw new Error(params.error);

  if (params.code) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return data.session;
  }

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;

  const client = getSupabaseClient();
  const { data, error } = await client.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    async function loadSession() {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (isActive) setSession(data.session ?? null);
      } catch (error) {
        console.error('[auth] load session error', error);
        if (isActive) setSession(null);
      } finally {
        if (isActive) setIsLoaded(true);
      }
    }

    void loadSession();

    try {
      const client = getSupabaseClient();
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setIsLoaded(true);
      });
      authSubscription = subscription;
    } catch (error) {
      console.error('[auth] subscribe error', error);
      setIsLoaded(true);
    }

    return () => {
      isActive = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      void createSupabaseSessionFromUrl(url).catch((error) => {
        console.error('[auth] deep link session error', error);
      });
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    void Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
    setSession(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    const client = getSupabaseClient();
    const { error } = await client.rpc('delete_current_user');
    if (error) throw error;

    await client.auth.signOut().catch(() => {});
    setSession(null);
  }, []);

  const getToken = useCallback(async () => {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    return data.session?.access_token ?? null;
  }, []);

  const user = useMemo(() => mapSupabaseUser(session?.user ?? null), [session?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoaded,
      isSignedIn: Boolean(session?.user),
      userId: session?.user.id ?? null,
      user,
      session,
      signOut,
      deleteAccount,
      getToken,
    }),
    [deleteAccount, getToken, isLoaded, session, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const { user: _user, ...auth } = useContext(AuthContext);
  return auth;
}

export function useSession() {
  const { isLoaded, session } = useContext(AuthContext);
  return { isLoaded, session };
}

export function useUser() {
  const { isLoaded, user } = useContext(AuthContext);
  return { isLoaded, user };
}
