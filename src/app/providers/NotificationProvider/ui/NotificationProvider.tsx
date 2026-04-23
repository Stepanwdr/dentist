import {FC, useEffect} from "react";
import * as Notifications from "expo-notifications";
import { navigate } from "@app/navigation/navigationRef";
import { useNotifications } from "../lib/useNotifications";
import {setupNotifications} from "@app/providers/NotificationProvider/lib/setupNotifications";

interface Props {
  children: React.ReactNode;
}
export const NotificationProvider:FC<Props> = ({ children } ) => {
  function handleNavigation(data: any) {
    if (!data?.screen) return;

    switch (data.screen) {
      case "AppointmentsTab":
        navigate("AppointmentsTab");
        break;

      case "Profile":
       navigate("ProfileTab");
        break;

      default:
        console.log("Unknown screen:", data.screen);
    }
  }
  useNotifications()
  useEffect(() => {
    // 🔔 когда приходит уведомление
    const receiveSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log({notification})
      }
    );

    // 👆 когда нажали
    const responseSub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        console.log("CLICK DATA:", response.notification.request);

        handleNavigation(data);
      });

    // // 🚀 если приложение было закрыто
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        console.log(data)
        handleNavigation(data);
      }
    });

    setupNotifications();
    return () => {
      receiveSub.remove();
      responseSub.remove();
    };
  }, []);

  return children;
};

