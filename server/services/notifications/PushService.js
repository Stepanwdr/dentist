import { Expo } from "expo-server-sdk";

const expo = new Expo();

export class PushService {
  static async send(token, payload) {
    const message = {
      to: token,
      sound: "default",
      title: payload.title,
      body: payload.message,
      data: payload.data,
    };

    await expo.sendPushNotificationsAsync([message]);
  }
}