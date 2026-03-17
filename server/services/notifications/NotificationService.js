import Users from "../../models/Users.js";
import { PushService } from "./PushService.js";

export class NotificationService {
  static async send(userId, payload) {
    const user = await Users.findByPk(userId);
    const notification = await Notification.create({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      data: payload.data
    });

    if (user?.pushToken) {
      await PushService.send(user.pushToken, payload);
    }

    return notification;
  }
}