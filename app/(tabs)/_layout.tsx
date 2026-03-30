import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="horoscope" />
      <Tabs.Screen name="gurukul" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
