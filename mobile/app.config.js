function readConfigValue(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.startsWith('${')) return undefined;
  return trimmed;
}

const appEnvironment =
  readConfigValue(process.env.APP_ENV) ??
  readConfigValue(process.env.EAS_BUILD_PROFILE) ??
  readConfigValue(process.env.NODE_ENV);
const supabaseUrl = readConfigValue(process.env.EXPO_PUBLIC_SUPABASE_URL);
const supabasePublishableKey =
  readConfigValue(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
  readConfigValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
const isProductionBuild = appEnvironment === 'production';
const enableDevButtons =
  !isProductionBuild && readConfigValue(process.env.ENABLE_DEV_BUTTONS) === 'true';

export default {
  expo: {
    name: 'Mihira',
    slug: 'mihira',
    version: '1.0.0',
    scheme: 'mihira',
    userInterfaceStyle: 'dark',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#191C20',
      dark: {
        image: './assets/splash-logo.png',
        resizeMode: 'contain',
        backgroundColor: '#191C20',
      },
    },
    ios: {
      bundleIdentifier: 'com.mihira.app',
      buildNumber: '1',
      supportsTablet: false,
    },
    android: {
      package: 'com.mihiralabs.app',
      versionCode: 2,
      permissions: [
        'com.google.android.gms.permission.AD_ID',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon-foreground.png',
        backgroundColor: '#191C20',
      },
      splash: {
        image: './assets/splash-logo.png',
        resizeMode: 'contain',
        backgroundColor: '#191C20',
        dark: {
          image: './assets/splash-logo.png',
          resizeMode: 'contain',
          backgroundColor: '#191C20',
        },
      },
    },
    web: {
      bundler: 'metro',
      output: 'server',
    },
    plugins: [
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            './node_modules/@expo-google-fonts/google-sans/400Regular/GoogleSans_400Regular.ttf',
            './node_modules/@expo-google-fonts/google-sans/500Medium/GoogleSans_500Medium.ttf',
            './node_modules/@expo-google-fonts/google-sans/600SemiBold/GoogleSans_600SemiBold.ttf',
            './node_modules/@expo-google-fonts/google-sans/700Bold/GoogleSans_700Bold.ttf',
          ],
        },
      ],
      '@react-native-community/datetimepicker',
      [
        'expo-audio',
        {
          microphonePermission: false,
          recordAudioAndroid: false,
          enableBackgroundPlayback: false,
        },
      ],
      [
        'expo-calendar',
        {
          calendarPermission: 'Allow Mihira to open calendar entries for focus reminders.',
          remindersPermission: 'Allow Mihira to save your daily focus tasks as reminders.',
        },
      ],
      "expo-asset",
      'expo-secure-store',
      'expo-web-browser',
      [
        'react-native-edge-to-edge',
        {
          android: {
            parentTheme: 'Default',
            enforceNavigationBarContrast: false,
          },
        },
      ],
      './plugins/withAndroidPackagingOptions',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiBaseUrl: readConfigValue(process.env.EXPO_PUBLIC_API_BASE_URL),
      supabaseUrl,
      supabasePublishableKey,
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
      enableDevButtons,
      eas: {
        projectId: '6facd4de-331a-4c16-86c4-7ff3d5778d84',
      },
    },
  },
};
