import { PropsWithChildren, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { navigate } from "@app/navigation/navigationRef";
import { useNotifications } from "../lib/useNotifications";

export const NotificationProvider = ({ children }: PropsWithChildren) => {

  useNotifications()
  useEffect(() => {
    // 🔔 когда приходит уведомление
    const receiveSub = Notifications.addNotificationReceivedListener(
      (notification) => {
      }
    );

    // 👆 когда нажали
    const responseSub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        console.log("CLICK DATA:", response.notification.request);

        handleNavigation(data);
      });

    // 🚀 если приложение было закрыто
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        console.log(data)
        handleNavigation(data);
      }
    });

    return () => {
      receiveSub.remove();
      responseSub.remove();
    };
  }, []);

  return children;
};

// 🔀 универсальный роутинг
function handleNavigation(data: any) {
  if (!data?.screen) return;

  switch (data.screen) {
    case "Booking":
      navigate("Booking", { id: data.bookingId });
      break;

    case "Profile":
      navigate("Profile");
      break;

    default:
      console.log("Unknown screen:", data.screen);
  }
}