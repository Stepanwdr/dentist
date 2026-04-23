import { DataTypes } from 'sequelize';
import sequelize from '../services/sequelize.js';

export const ScheduleBlock = sequelize.define('ScheduleBlock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  dentistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM('break', 'dayoff', 'manual'),
    defaultValue: 'manual',
  },

  reason: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'schedule_blocks',
  timestamps: true,
  indexes: [
    { fields: ['dentistId'] },
    { fields: ['date'] },
    { fields: ['dentistId', 'date'] },
  ],
});

export default ScheduleBlock;