import { useEffect } from "react";
import * as Notifications from "expo-notifications";



async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  console.log("PERMISSION:", status);
}

async function setupChannel() {
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

export const useNotifications = () => {
  useEffect(() => {
    void requestPermissions();
    void setupChannel();
  }, []);
};

