// app/(tabs)/_layout.tsx
import { View, StyleSheet } from 'react-native';
import { Tabs, useSegments } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';
import { AppHeader } from '@/components/ui/AppHeader';

export default function TabLayout() {
  const segments = useSegments();
  const hideAppHeader = (segments as readonly string[]).includes('profile');

  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="horoscope" />
        <Tabs.Screen name="gurukul" />
        <Tabs.Screen name="muhurat" />
        <Tabs.Screen name="profile" />
      </Tabs>
      {!hideAppHeader && <AppHeader />}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
