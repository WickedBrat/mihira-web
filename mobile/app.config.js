export default {
  expo: {
    name: 'Mihira',
    slug: 'mihira',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'mihira',
    userInterfaceStyle: 'dark',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#191C20',
    },
    ios: {
      bundleIdentifier: 'com.mihira.app',
      buildNumber: '1',
      supportsTablet: false,
    },
    android: {
      package: 'com.mihiralabs.app',
      versionCode: 1,
      permissions: [
        'com.google.android.gms.permission.AD_ID',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#191C20',
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
      'expo-secure-store',
      'expo-web-browser',
      './plugins/withAndroidPackagingOptions',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
      enableDevButtons: process.env.ENABLE_DEV_BUTTONS === 'true',
      eas: {
        projectId: '6facd4de-331a-4c16-86c4-7ff3d5778d84',
      },
    },
  },
};
