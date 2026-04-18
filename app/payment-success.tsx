import {
  useUser } from '@clerk/expo';
import { View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { CheckCircle, Sparkles } from 'lucide-react-native';

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
    <View className="flex-1 items-center justify-center bg-[#f9f7ff] p-6">
      <View
        className="w-full max-w-[420px] items-center rounded-3xl bg-white p-10"
        style={{
          shadowColor: '#7c3aed',
          shadowOpacity: 0.08,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        {/* Success icon */}
        <View className="mb-5 h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f3eeff]">
          <CheckCircle size={36} color="#7c3aed" strokeWidth={1.8} />
        </View>

        <Text className="mb-1 font-headline text-2xl text-[#1a1a1a]">You’re all set</Text>
        <Text className="mb-8 font-body text-sm text-[#888]">Aksha Pro is now active</Text>

        {/* User identity */}
        <View className="mb-8 w-full items-center">
          <View className="relative mb-3.5">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="h-20 w-20 rounded-full border-[3px] border-[#e9d5ff]" />
            ) : (
              <View className="h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#e9d5ff] bg-[#ede9fe]">
                <Text className="font-headline text-[28px] text-[#7c3aed]">
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {/* Pro badge dot */}
            <View className="absolute bottom-0.5 right-0.5 h-[18px] w-[18px] rounded-full border-2 border-white bg-[#7c3aed]" />
          </View>

          <Text className="mb-1 font-label text-lg text-[#1a1a1a]">{name}</Text>
          <Text className="mb-3 font-body text-sm text-[#888]">{email}</Text>

          {/* Aksha Pro badge */}
          <View className="flex-row items-center gap-[5px] rounded-[20px] border border-[#e9d5ff] bg-[#f3eeff] px-3 py-[5px]">
            <Sparkles size={12} color="#7c3aed" strokeWidth={2} />
            <Text className="font-label text-[11px] tracking-[0.5px] text-[#7c3aed]">Aksha Pro</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          className="mb-4 w-full items-center rounded-[14px] bg-[#7c3aed] px-10 py-[15px]"
          style={{
            shadowColor: '#7c3aed',
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
          onPress={handleOpenApp}
          activeOpacity={0.85}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Open Aksha</Text>
        </TouchableOpacity>

        <Text className="text-center font-body text-[11px] leading-[17px] text-[#bbb]">
          If the app doesn’t open automatically,{'\n'}make sure Aksha is installed on this device.
        </Text>
      </View>
    </View>
  );
}
