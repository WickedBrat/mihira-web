import React, { useState } from 'react';
import {
  Platform,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { UserProfile } from '@clerk/expo/web';
import { useUser, useAuth } from '@clerk/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { SacredButton } from '@/components/ui/SacredButton';
import { useTheme } from '@/lib/theme-context';

function NativeManageAccount() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

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
    <View className="flex-1 p-6">
      <View className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5">
        <Text className="mb-2 font-label text-xs uppercase tracking-[1.2px] text-on-surface-variant">Name</Text>
        <Text className="mb-4 font-body-medium text-base text-on-surface">{name}</Text>

        <Text className="mb-2 font-label text-xs uppercase tracking-[1.2px] text-on-surface-variant">Email Address</Text>
        <Text className="mb-4 font-body-medium text-base text-on-surface">{email}</Text>
      </View>

      <View className="mt-8">
        <Text className="mb-2 font-headline text-lg text-error">Danger Zone</Text>
        <Text className="mb-4 font-body text-sm leading-5 text-on-surface-variant">Once you delete your account, there is no going back. Please be certain.</Text>
        <SacredButton 
          label={isDeleting ? "Deleting..." : "Delete Account"} 
          onPress={handleDeleteAccount} 
          variant="secondary"
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
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="border-b border-outline-variant/20 bg-surface px-6 pb-5 pt-4">
        <View className="mb-1 flex-row items-center">
          <Pressable className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-surface-container" onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.onSurface} />
          </Pressable>
          <View className="flex-1">
            <Text className="font-headline text-2xl text-on-surface">Account</Text>
            {email ? <Text className="font-body text-sm text-on-surface-variant">{email}</Text> : null}
          </View>
        </View>
      </View>
      <View className={`flex-1 bg-background ${Platform.OS === 'web' ? 'items-center pt-6' : ''}`}>
        {Platform.OS === 'web' ? (
          <UserProfile routing="hash" />
        ) : (
          <NativeManageAccount />
        )}
      </View>
    </SafeAreaView>
  );
}
