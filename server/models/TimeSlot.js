import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Users from './Users.js';
import Clinic from './Clinic.js';

class TimeSlot extends Model {}

TimeSlot.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      // Дата слота (без времени)
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      // Время начала (локальное время клиники/врача)
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      // Время окончания
      type: DataTypes.TIME,
      allowNull: false,
    },
    isBooked: {
      // Пометка, что слот уже занят (бронь/запись)
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'time_slot',
    tableName: 'time_slot',
    indexes: [
      {
        // частый поиск по врачу и дате
        name: 'idx_time_slot_dentist_date',
        fields: ['dentistId', 'date'],
      },
      {
        name: 'idx_time_slot_clinic_date',
        fields: ['clinicId', 'date'],
      },
    ],
  }
);

// Associations
Users.hasMany(TimeSlot, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'timeSlots',
});

TimeSlot.belongsTo(Users, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'dentist',
});

Clinic.hasMany(TimeSlot, {
  foreignKey: 'clinicId',
  onDelete: 'set null',
  onUpdate: 'cascade',
  as: 'timeSlots',
});

TimeSlot.belongsTo(Clinic, {
  foreignKey: 'clinicId',
  onDelete: 'set null',
  onUpdate: 'cascade',
  as: 'clinic',
});

export default TimeSlot;
