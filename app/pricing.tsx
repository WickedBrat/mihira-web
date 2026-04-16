import { PricingTable } from '@clerk/expo/web';
import { useUser, useClerk } from '@clerk/expo';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, LogOut } from 'lucide-react-native';

export default function PricingPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-[#f0f0f0] bg-white px-5 py-3">
        <View className="mr-4 flex-1 flex-row items-center gap-2.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f0f0f0]">
            <User size={16} color="#555" />
          </View>
          <Text className="shrink font-body text-sm text-[#444]" numberOfLines={1}>{email}</Text>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1.5 rounded-lg bg-[#f5f5f5] px-3 py-1.5" onPress={() => signOut()} activeOpacity={0.7}>
          <LogOut size={16} color="#888" />
          <Text className="font-body text-sm text-[#888]">Sign out</Text>
        </TouchableOpacity>
      </View>
      <PricingTable />
    </View>
  );
}
