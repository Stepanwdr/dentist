import Notification from "../models/Notification.js";

class NotificationController {
  // Получить список уведомлений пользователя
  static async getAll(req, res, next) {
    try {
      const userId = req.userId; // предполагаем что есть middleware auth
      const { page = 1, limit = 10, isRead, type } = req.query;
      const where = { userId };
      if (isRead !== undefined) {
        where.isRead = isRead === "true";
      }

      if (type) {
        where.type = type;
      }
      const offset = Number(page - 1) * limit;

      const { rows, count } = await Notification.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: Number(offset),
      });
      return res.json({
        data: rows,
        pagination: {
          total: count,
          page: Number(page),
          lastPage: Math.ceil(count / limit),
        },
      });
    } catch (e) {
      next(e);
    }
  }

  // Получить одно уведомление
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      return res.json(notification);
    } catch (e) {
      next(e);
    }
  }

  // Создать уведомление
  static async create(req, res, next) {
    try {
      const { userId, title, message, type, data } = req.body;

      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        data,
      });

      return res.status(201).json(notification);
    } catch (e) {
      next(e);
    }
  }

  // Отметить как прочитанное
  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.isRead = true;
      await notification.save();

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  // Отметить все как прочитанные
  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.userId;

      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  // Удалить уведомление
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      await notification.destroy();

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
}

export default NotificationController;