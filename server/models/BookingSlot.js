import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Users from './Users.js';
import Clinic from './Clinic.js';

class BookingSlot extends Model {}

BookingSlot.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    createdById: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    confirmedById: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
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
    isBooked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 👇 НОВОЕ ПОЛЕ
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'canceled', 'finished'),
      allowNull: false,
      defaultValue: 'pending',
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
Users.hasMany(BookingSlot, {
  foreignKey: 'dentistId',
  onDelete: 'set null',
  onUpdate: 'cascade',
  as: 'timeSlots',
});

BookingSlot.belongsTo(Users, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'set null',
  as: 'dentist',
});

Clinic.hasMany(BookingSlot, {
  foreignKey: 'clinicId',
  onDelete: 'set null',
  onUpdate: 'cascade',
  as: 'timeSlots',
});

BookingSlot.belongsTo(Clinic, {
  foreignKey: 'clinicId',
  onDelete: 'set null',
  onUpdate: 'cascade',
  as: 'clinic',
});

Users.hasMany(BookingSlot, {
  foreignKey: 'patientId',
  as: 'patientBookings',
});

BookingSlot.belongsTo(Users, {
  foreignKey: 'patientId',
  as: 'patient',
});

export default BookingSlot;
