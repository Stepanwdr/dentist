import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./dentist-37300-firebase-adminsdk-fbsvc-c001320a70.json", import.meta.url))
);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export class PushService {
  static async send(token, payload) {
    if (!token) {
      console.error("Нет FCM токена");
      return;
    }

    const message = {
      token: token,

      notification: {
        title: payload?.title || "Уведомление",
        body: payload?.body || "Новое сообщение",
      },

      data: Object.entries(payload?.data || {}).reduce((acc, [k, v]) => {
        acc[k] = String(v); // FCM требует строки
        return acc;
      }, {}),

      android: {
        priority: "high",
        notification: {
          channelId: "default",
        },
      },

      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("✅ Push отправлен:", response);
    } catch (error) {
      console.error("❌ Ошибка отправки push:", error);
    }
  }
}