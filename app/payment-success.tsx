import { useUser } from '@clerk/expo';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { CheckCircle, Sparkles } from 'lucide-react-native';
import { scaleFont } from '@/lib/typography';
import { fonts } from '@/lib/theme';

const DEEP_LINK = 'aksha://';

export default function PaymentSuccessPage() {
  const { user } = useUser();

  const name = user?.fullName ?? user?.firstName ?? 'Seeker';
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ?? '';
  const avatarUrl = user?.imageUrl;

  const handleOpenApp = () => {
    if (Platform.OS === 'web') {
      window.location.href = DEEP_LINK;
    } else {
      Linking.openURL(DEEP_LINK);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        {/* Success icon */}
        <View style={styles.successRing}>
          <CheckCircle size={36} color="#7c3aed" strokeWidth={1.8} />
        </View>

        <Text style={styles.heading}>Payment Successful</Text>
        <Text style={styles.subheading}>Welcome to Aksha Pro</Text>

        {/* User identity */}
        <View style={styles.userBlock}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {/* Pro badge dot */}
            <View style={styles.badgeDot} />
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          {/* Aksha Pro badge */}
          <View style={styles.proBadge}>
            <Sparkles size={12} color="#7c3aed" strokeWidth={2} />
            <Text style={styles.proBadgeText}>Aksha Pro</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleOpenApp} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Head to the App</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          If the app doesn't open automatically,{'\n'}make sure Aksha is installed on your device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f9f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.08,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  // Success icon
  successRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f3eeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(22),
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subheading: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: '#888',
    marginBottom: 32,
  },

  // User block
  userBlock: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#e9d5ff',
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e9d5ff',
  },
  avatarInitial: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(28),
    color: '#7c3aed',
  },
  badgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7c3aed',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  name: {
    fontFamily: fonts.label,
    fontSize: scaleFont(17),
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: '#888',
    marginBottom: 12,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f3eeff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  proBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(11),
    color: '#7c3aed',
    letterSpacing: 0.5,
  },

  // CTA
  ctaButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(15),
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: '#bbb',
    textAlign: 'center',
    lineHeight: scaleFont(17),
  },
});
