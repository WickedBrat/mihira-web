import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

export default function PricingPage() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-3 text-center font-headline text-2xl text-[#222]">
          In-app subscriptions are now handled inside Mihira.
        </Text>
        <Text className="max-w-[340px] text-center font-body text-sm leading-6 text-[#666]">
          Open Mihira on iPhone or Android to upgrade to Plus once RevenueCat and store products are configured.
        </Text>
      </View>
    </View>
  );
}
