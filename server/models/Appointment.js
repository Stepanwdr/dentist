import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Users from './Users.js';

class Appointment extends Model {

}
Appointment.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'appointment',
    tableName: 'appointment',
  });

Users.hasMany(Appointment, {
  foreignKey: 'usersId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'u_id',
});

Appointment.belongsTo(Users, {
  foreignKey: 'usersId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'app',
});

Users.hasMany(Appointment, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'us_dentist_id',
});

Appointment.belongsTo(Users, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'd_id',

});

export default Appointment;

