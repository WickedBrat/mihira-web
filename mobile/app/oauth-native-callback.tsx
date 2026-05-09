import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';

export default function OAuthNativeCallbackScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator />
    </View>
  );
}
