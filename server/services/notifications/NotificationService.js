import Users from "../../models/Users.js";
import { PushService } from "./PushService.js";
import {Notifications} from "../../models/index.js";
export class NotificationService {
  static async send(userId, payload) {
    const user = await Users.findByPk(userId);
    const notification = await Notifications.create({
      userId,
      title: payload.title,
      message: payload.body,
      type: payload.type,
      data: payload.data
    });

    if (user?.pushToken) {
      await PushService.send(user.pushToken, payload);
    }

    return notification;
  }
}