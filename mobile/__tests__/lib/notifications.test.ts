type PlatformOS = 'ios' | 'android' | 'web';

type LoadOptions = {
  platform?: PlatformOS;
  currentPermissionGranted?: boolean;
  requestedPermissionGranted?: boolean;
};

function loadNotificationsModule({
  platform = 'ios',
  currentPermissionGranted = true,
  requestedPermissionGranted = true,
}: LoadOptions = {}) {
  jest.resetModules();

  const notificationApi = {
    AndroidImportance: { DEFAULT: 'default' },
    SchedulableTriggerInputTypes: { DAILY: 'daily' },
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
    getPermissionsAsync: jest.fn().mockResolvedValue({ granted: currentPermissionGranted }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: requestedPermissionGranted }),
    cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
    scheduleNotificationAsync: jest.fn().mockResolvedValue('daily-notification-id'),
  };

  jest.doMock('react-native', () => ({
    Platform: { OS: platform },
  }));
  jest.doMock('expo-notifications', () => notificationApi);

  const module = require('@/lib/notifications') as typeof import('@/lib/notifications');
  return { module, notificationApi };
}

describe('scheduleDailyDayPreviewNotificationAsync', () => {
  afterEach(() => {
    jest.dontMock('react-native');
    jest.dontMock('expo-notifications');
    jest.resetModules();
  });

  it('skips scheduling on web', async () => {
    const { module, notificationApi } = loadNotificationsModule({ platform: 'web' });

    await expect(module.scheduleDailyDayPreviewNotificationAsync()).resolves.toEqual({
      status: 'skipped',
      reason: 'web',
    });
    expect(notificationApi.getPermissionsAsync).not.toHaveBeenCalled();
    expect(notificationApi.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('skips scheduling when notification permission is denied', async () => {
    const { module, notificationApi } = loadNotificationsModule({
      currentPermissionGranted: false,
      requestedPermissionGranted: false,
    });

    await expect(module.scheduleDailyDayPreviewNotificationAsync()).resolves.toEqual({
      status: 'skipped',
      reason: 'permission-denied',
    });
    expect(notificationApi.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(notificationApi.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules the daily day preview notification for 9 AM', async () => {
    const { module, notificationApi } = loadNotificationsModule();

    await expect(module.scheduleDailyDayPreviewNotificationAsync()).resolves.toEqual({
      status: 'scheduled',
      identifier: 'daily-notification-id',
    });

    expect(notificationApi.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      module.DAILY_DAY_PREVIEW_NOTIFICATION_ID
    );
    expect(notificationApi.scheduleNotificationAsync).toHaveBeenCalledWith({
      identifier: module.DAILY_DAY_PREVIEW_NOTIFICATION_ID,
      content: {
        title: 'Check what your day looks like today',
        body: 'Open Mihira for your daily alignment.',
        data: {
          route: module.DAILY_DAY_PREVIEW_ROUTE,
          notificationType: module.DAILY_DAY_PREVIEW_NOTIFICATION_ID,
        },
      },
      trigger: {
        type: 'daily',
        hour: 9,
        minute: 0,
        channelId: module.DAILY_DAY_PREVIEW_CHANNEL_ID,
      },
    });
  });

  it('creates the Android daily alignment channel before scheduling', async () => {
    const { module, notificationApi } = loadNotificationsModule({ platform: 'android' });

    await module.scheduleDailyDayPreviewNotificationAsync();

    expect(notificationApi.setNotificationChannelAsync).toHaveBeenCalledWith(
      module.DAILY_DAY_PREVIEW_CHANNEL_ID,
      expect.objectContaining({
        name: 'Daily alignment',
        importance: 'default',
      })
    );
  });
});
