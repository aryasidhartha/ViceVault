import * as Notifications from 'expo-notifications';
import { getVillainById } from '../data/villains';
import { getProfile, getVillainStates } from './db';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Register interactive notification categories
Notifications.setNotificationCategoryAsync('daily_checkin', [
  {
    identifier: 'action_win',
    buttonTitle: 'I Survived! 🛡️',
    options: { opensAppToForeground: true },
  },
  {
    identifier: 'action_lose',
    buttonTitle: 'I Gave In 😔',
    options: { opensAppToForeground: true, isDestructive: true },
  },
]);

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(userId, hour = 21, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!userId) return;

  const [{ data: activeVillains }, { data: profile }] = await Promise.all([
    getVillainStates(userId),
    getProfile(userId),
  ]);

  const selectedIds = (activeVillains || []).map(state => state.villain_id);
  const streak = { count: profile?.streak_count || 0 };

  if (selectedIds.length === 0) return;

  const villainId = selectedIds[Math.floor(Math.random() * selectedIds.length)];
  const villain = getVillainById(villainId);
  if (!villain) return;

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
      categoryIdentifier: 'daily_checkin',
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
