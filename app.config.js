export default {
  expo: {
    name: 'Aksha',
    slug: 'aksha',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'aksha',
    userInterfaceStyle: 'dark',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0e0e0e',
    },
    ios: {
      supportsTablet: false,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0e0e0e',
      },
    },
    web: {
      bundler: 'metro',
      output: 'server',
    },
    plugins: [
      'expo-router',
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: 'merchant.com.aksha',
          enableGooglePay: false,
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './node_modules/@expo-google-fonts/lexend/Lexend_300Light.ttf',
            './node_modules/@expo-google-fonts/lexend/Lexend_400Regular.ttf',
            './node_modules/@expo-google-fonts/lexend/Lexend_500Medium.ttf',
            './node_modules/@expo-google-fonts/lexend/Lexend_600SemiBold.ttf',
            './node_modules/@expo-google-fonts/lexend/Lexend_700Bold.ttf',
            './node_modules/@expo-google-fonts/lexend/Lexend_800ExtraBold.ttf',
          ],
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-secure-store',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
};
