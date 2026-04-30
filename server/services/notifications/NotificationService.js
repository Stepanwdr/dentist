import Users from "../../models/Users.js";
import { PushService } from "./PushService.js";
import {Notifications} from "../../models/index.js";
export class NotificationService {
  static async send(fromId, toId, payload) {
    const [fromUser, toUser] = await Promise.all([
      Users.findByPk(fromId),
      Users.findByPk(toId),
    ]);

    if (!toUser) {
      throw new Error('Recipient not found');
    }

    const notification = await Notifications.create({
      userId:fromUser.id,
      title: payload.title,
      message: payload.body,
      type: payload.type,
      data: payload.data
    });

    if (toUser.pushToken) {
      await PushService.send(toUser.pushToken, payload);
    }

    return notification;
  }
}