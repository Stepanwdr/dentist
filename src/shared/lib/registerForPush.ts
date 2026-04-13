import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPush() {

  // if (!Device.isDevice) {
  //   console.log("Must use real device");
  //   return;
  // }


  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission denied");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();

  console.log("PUSH TOKEN:", token.data);

  return token.data;
}