// app/(tabs)/_layout.tsx
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { TabBar } from '@/components/ui/TabBar';
import { GuideProvider } from '@/lib/guideStore';

export default function TabLayout() {
  return (
    <GuideProvider>
      <View className="flex-1 bg-surface">
        <PageAmbientBlobs />
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: 'transparent' },
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="muhurat" />
          <Tabs.Screen name="ask" />
          <Tabs.Screen name="gurukul" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </GuideProvider>
  );
}
