import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function registerForPush() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  // 2. Получаем токен (в Expo 54 проект ID берется из конфига)
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const data =await Notifications.getExpoPushTokenAsync({ projectId })
  return data.data;
}