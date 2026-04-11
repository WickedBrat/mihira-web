import { UserProfile } from '@clerk/expo/web';
import { useUser } from '@clerk/expo';
import { View, Text, StyleSheet } from 'react-native';
import { scaleFont } from '@/lib/typography';
import { fonts } from '@/lib/theme';

export default function UserProfilePage() {
  const { user } = useUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ?? '';

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
      </View>
      <View style={styles.content}>
        <UserProfile />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(22),
    color: '#1a1a1a',
    marginBottom: 2,
  },
  email: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: '#888',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
});
