import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { UserProfile } from '@clerk/expo/web';
import { useUser, useAuth } from '@clerk/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { scaleFont } from '@/lib/typography';
import { fonts } from '@/lib/theme';
import { SacredButton } from '@/components/ui/SacredButton';
import { useThemedStyles } from '@/lib/theme-context';

function NativeManageAccount() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const styles = useThemedStyles((c, _glass, gradients) =>
    StyleSheet.create({
      container: {
        flex: 1,
        padding: 24,
      },
      section: {
        backgroundColor: c.surfaceContainerLow,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
      },
      label: {
        fontFamily: fonts.label,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 8,
      },
      value: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(16),
        color: c.onSurface,
        marginBottom: 16,
      },
      dangerSection: {
        marginTop: 32,
      },
      dangerTitle: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(18),
        color: c.error,
        marginBottom: 8,
      },
      dangerText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.onSurfaceVariant,
        marginBottom: 16,
        lineHeight: 20,
      },
      deleteButton: {
        borderColor: c.error,
        backgroundColor: `${c.error}14`,
      },
      deleteButtonText: {
        color: c.error,
      }
    })
  );

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await user?.delete();
              await signOut();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? 'No email';
  const name = user?.fullName ?? 'No name provided';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerText}>Once you delete your account, there is no going back. Please be certain.</Text>
        <SacredButton 
          label={isDeleting ? "Deleting..." : "Delete Account"} 
          onPress={handleDeleteAccount} 
          variant="secondary"
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />
      </View>
    </View>
  );
}

export default function UserProfilePage() {
  const { user } = useUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ?? '';

  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      page: {
        flex: 1,
        backgroundColor: c.background,
      },
      header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: c.surface,
        borderBottomWidth: 1,
        borderBottomColor: `${c.outlineVariant}33`,
      },
      headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: c.surfaceContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(24),
        color: c.onSurface,
      },
      email: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.onSurfaceVariant,
      },
      headerTextContainer: {
        flex: 1,
      },
      content: {
        flex: 1,
        backgroundColor: c.background,
      },
      webContent: {
        alignItems: 'center',
        paddingTop: 24,
      }
    })
  );

  return (
    <SafeAreaView style={styles.page} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={styles.title.color} />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Account</Text>
            {email ? <Text style={styles.email}>{email}</Text> : null}
          </View>
        </View>
      </View>
      <View style={Platform.OS === 'web' ? [styles.content, styles.webContent] : styles.content}>
        {Platform.OS === 'web' ? (
          <UserProfile routing="hash" />
        ) : (
          <NativeManageAccount />
        )}
      </View>
    </SafeAreaView>
  );
}
