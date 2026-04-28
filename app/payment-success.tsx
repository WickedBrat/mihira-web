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

const DEEP_LINK = 'mihira://';
const SURFACE = '#faf7f2';
const CARD = '#ffffff';
const TEXT = '#1a1410';
const MUTED = '#6b5e4e';
const ACCENT = '#9a6500';
const ACCENT_SOFT = 'rgba(154,101,0,0.10)';
const ACCENT_BORDER = 'rgba(154,101,0,0.24)';

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
    <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: SURFACE }}>
      <View
        className="w-full max-w-[420px] items-center rounded-3xl p-10"
        style={{
          backgroundColor: CARD,
          shadowColor: ACCENT,
          shadowOpacity: 0.08,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        {/* Success icon */}
        <View className="mb-5 h-[72px] w-[72px] items-center justify-center rounded-full" style={{ backgroundColor: ACCENT_SOFT }}>
          <CheckCircle size={36} color={ACCENT} strokeWidth={1.8} />
        </View>

        <Text className="mb-1 font-headline text-2xl" style={{ color: TEXT }}>You’re all set</Text>
        <Text className="mb-8 font-body text-sm" style={{ color: MUTED }}>Mihira Plus is now active</Text>

        {/* User identity */}
        <View className="mb-8 w-full items-center">
          <View className="relative mb-3.5">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="h-20 w-20 rounded-full border-[3px]" style={{ borderColor: ACCENT_BORDER }} />
            ) : (
              <View className="h-20 w-20 items-center justify-center rounded-full border-[3px]" style={{ backgroundColor: ACCENT_SOFT, borderColor: ACCENT_BORDER }}>
                <Text className="font-headline text-[28px]" style={{ color: ACCENT }}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {/* Plus badge dot */}
            <View className="absolute bottom-0.5 right-0.5 h-[18px] w-[18px] rounded-full border-2 border-white" style={{ backgroundColor: ACCENT }} />
          </View>

          <Text className="mb-1 font-label text-lg" style={{ color: TEXT }}>{name}</Text>
          <Text className="mb-3 font-body text-sm" style={{ color: MUTED }}>{email}</Text>

          {/* Mihira Plus badge */}
          <View className="flex-row items-center gap-[5px] rounded-[20px] border px-3 py-[5px]" style={{ backgroundColor: ACCENT_SOFT, borderColor: ACCENT_BORDER }}>
            <Sparkles size={12} color={ACCENT} strokeWidth={2} />
            <Text className="font-label text-[11px] tracking-[0.5px]" style={{ color: ACCENT }}>Mihira Plus</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          className="mb-4 w-full items-center rounded-[14px] px-10 py-[15px]"
          style={{
            backgroundColor: ACCENT,
            shadowColor: ACCENT,
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
          onPress={handleOpenApp}
          activeOpacity={0.85}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Open Mihira</Text>
        </TouchableOpacity>

        <Text className="text-center font-body text-[11px] leading-[17px]" style={{ color: MUTED }}>
          If the app doesn’t open automatically,{'\n'}make sure Mihira is installed on this device.
        </Text>
      </View>
    </View>
  );
}
