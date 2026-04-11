import { PricingTable } from '@clerk/expo/web';
import { useUser, useClerk } from '@clerk/expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, LogOut } from 'lucide-react-native';
import { scaleFont } from '@/lib/typography';
import { fonts } from '@/lib/theme';

export default function PricingPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarCircle}>
            <User size={16} color="#555" />
          </View>
          <Text style={styles.email} numberOfLines={1}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()} activeOpacity={0.7}>
          <LogOut size={16} color="#888" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <PricingTable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: '#444',
    flexShrink: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  logoutText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: '#888',
  },
});
