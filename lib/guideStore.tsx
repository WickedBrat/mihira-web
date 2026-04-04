import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUIDE_STORAGE_KEY = '@aksha/guide';

export async function readGuide(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(GUIDE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveGuide(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(GUIDE_STORAGE_KEY, name);
  } catch (err) {
    console.error('[guideStore] save error', err);
  }
}

interface GuideContextValue {
  guide: string | null;
  isLoading: boolean;
  commitToGuide: (name: string) => Promise<void>;
}

const GuideContext = createContext<GuideContextValue>({
  guide: null,
  isLoading: true,
  commitToGuide: async () => {},
});

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [guide, setGuide] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readGuide().then(value => {
      setGuide(value);
      setIsLoading(false);
    });
  }, []);

  const commitToGuide = async (name: string) => {
    await saveGuide(name);
    setGuide(name);
  };

  return (
    <GuideContext.Provider value={{ guide, isLoading, commitToGuide }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide(): GuideContextValue {
  return useContext(GuideContext);
}
