// app/(tabs)/_layout.tsx
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';

export default function TabLayout() {
  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="ask-krishna" />
        <Tabs.Screen name="gurukul" />
        <Tabs.Screen name="muhurat" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
