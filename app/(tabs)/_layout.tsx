// app/(tabs)/_layout.tsx
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';
import { GuideProvider } from '@/lib/guideStore';

export default function TabLayout() {
  return (
    <GuideProvider>
      <View style={styles.root}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
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

const styles = StyleSheet.create({ root: { flex: 1 } });
