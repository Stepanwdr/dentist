import * as Notifications from "expo-notifications";

export async function registerForPush() {
  const token = await Notifications.getDevicePushTokenAsync();

  console.log("FCM TOKEN:", token.data);

  return token.data;
}