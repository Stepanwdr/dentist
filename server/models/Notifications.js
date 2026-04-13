import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize.js";

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
  },

  message: {
    type: DataTypes.TEXT,
  },

  type: {
    type: DataTypes.STRING,
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  data: {
    type: DataTypes.JSON,
  }

}, {
  sequelize,
  tableName: "notifications",
});

export default Notification;