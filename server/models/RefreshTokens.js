import { DataTypes } from 'sequelize';
import sequelize from '../services/sequelize.js';

 const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  token: {
    type: DataTypes.STRING(512),  // ← вместо TEXT
    allowNull: false,
    unique: true,
  },
   role: {
     type: DataTypes.ENUM('admin', 'administrator', 'director', 'dentist', 'patient'),
     allowNull: true,
     defaultValue: 'patient',  // ← по умолчанию пациент
   },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { unique: true, fields: ['token'] },
  ],
});

export default RefreshToken;