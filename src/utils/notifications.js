import * as Notifications from 'expo-notifications';
import { getVillainById } from '../data/villains';np

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

export async function scheduleDailyReminder(hour = 21, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const selectedIds = await getSelectedVillains();
  const villainStates = await getVillainStates();
  const streak = await getStreak();

  if (selectedIds.length === 0) return;

  const villainId = selectedIds[Math.floor(Math.random() * selectedIds.length)];
  const villain = getVillainById(villainId);
  if (!villain) return;

  const state = villainStates[villainId] || { hp: villain.defaultHP };
  const missedDays = streak.count === 0 ? 2 : 0;

  let taunt;
  if (missedDays >= 2) {
    taunt = villain.taunts[Math.min(missedDays - 1, villain.taunts.length - 1)];
  } else if (streak.count >= 3) {
    taunt = `${streak.count} days in a row. Getting annoying. — ${villain.name}`;
  } else {
    taunt = villain.taunts[0];
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: villain.name,
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
