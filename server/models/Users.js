import { Model, DataTypes } from 'sequelize';
import md5 from 'md5';
import Clinic from './Clinic.js';
import sequelize from '../services/sequelize.js';

class Users extends Model {
  static passwordHash(string) {
    return md5(`${md5(string)}_safe`);
  }
}

Users.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',   // для Google-пользователей может не быть
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // ── Google Auth ─────────────────────────────────────────────────────────────
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // ────────────────────────────────────────────────────────────────────────────

  password: {
    type: DataTypes.CHAR(32),
    allowNull: true,          // ← было false, теперь null для Google-юзеров
    get() {
      return undefined;
    },
    set(val) {
      if (val === null || val === undefined) {
        this.setDataValue('password', null);
        return;
      }
      this.setDataValue('password', Users.passwordHash(val));
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,          // ← Google не даёт адрес, заполнит позже
  },
  phone: {
    type: DataTypes.STRING(32),
    allowNull: true,          // ← Google не даёт телефон
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,          // ← Google не даёт дату рождения
  },
  role: {
    type: DataTypes.ENUM('admin', 'administrator', 'director', 'doctor', 'patient'),
    allowNull: true,
    defaultValue: 'patient',  // ← по умолчанию пациент
  },
  speciality: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active','blocked','deleted'),
    defaultValue: 'active',
    allowNull: true,
  },
  pushToken: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'users',
  tableName: 'users',
});

Users.belongsTo(Clinic, {
  foreignKey: 'clinicId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
  as: 'clinic',
});

Clinic.hasMany(Users, {
  foreignKey: 'clinicId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
  as: 'users',
});

export default Users;