import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const DAILY_DAY_PREVIEW_NOTIFICATION_ID = 'daily-day-preview';
export const DAILY_DAY_PREVIEW_CHANNEL_ID = 'daily-alignment';
export const DAILY_DAY_PREVIEW_ROUTE = '/(tabs)';

const DAILY_DAY_PREVIEW_TITLE = 'Check what your day looks like today';
const DAILY_DAY_PREVIEW_BODY = 'Open Mihira for your daily alignment.';
const DAILY_DAY_PREVIEW_HOUR = 9;
const DAILY_DAY_PREVIEW_MINUTE = 0;

export type NotificationScheduleResult =
  | { status: 'scheduled'; identifier: string }
  | { status: 'skipped'; reason: 'web' | 'permission-denied' };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(DAILY_DAY_PREVIEW_CHANNEL_ID, {
    name: 'Daily alignment',
    description: 'Daily reminders to review your day in Mihira.',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#D6A84A',
  });
}

async function requestNotificationPermission() {
  const currentPermission = await Notifications.getPermissionsAsync();
  if (currentPermission.granted) return true;

  const nextPermission = await Notifications.requestPermissionsAsync();
  return nextPermission.granted;
}

export async function scheduleDailyDayPreviewNotificationAsync(
  hour: number = DAILY_DAY_PREVIEW_HOUR,
  minute: number = DAILY_DAY_PREVIEW_MINUTE
): Promise<NotificationScheduleResult> {
  if (Platform.OS === 'web') {
    return { status: 'skipped', reason: 'web' };
  }

  await ensureAndroidNotificationChannel();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return { status: 'skipped', reason: 'permission-denied' };
  }

  await Notifications.cancelScheduledNotificationAsync(DAILY_DAY_PREVIEW_NOTIFICATION_ID).catch(() => {});

  const identifier = await Notifications.scheduleNotificationAsync({
    identifier: DAILY_DAY_PREVIEW_NOTIFICATION_ID,
    content: {
      title: DAILY_DAY_PREVIEW_TITLE,
      body: DAILY_DAY_PREVIEW_BODY,
      data: {
        route: DAILY_DAY_PREVIEW_ROUTE,
        notificationType: DAILY_DAY_PREVIEW_NOTIFICATION_ID,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: DAILY_DAY_PREVIEW_CHANNEL_ID,
    },
  });

  return { status: 'scheduled', identifier };
}

export function getNotificationResponseRoute(
  response: Notifications.NotificationResponse | null | undefined
) {
  const route = response?.notification.request.content.data?.route;
  return typeof route === 'string' && route.startsWith('/') ? route : null;
}
