import * as Notifications from 'expo-notifications';
import { getVillainById } from '../data/villains';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour = 21, minute = 0, villainId = 'scroller') {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const villain = getVillainById(villainId) || getVillainById('scroller');
  const taunt = villain?.taunts?.[0] || "You know where to find me.";

  await Notifications.scheduleNotificationAsync({
    content: {
      title: villain?.name || 'ViceVault',
      body: taunt,
      data: { villainId },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
