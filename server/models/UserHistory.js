import { DataTypes, Model } from 'sequelize';
import Users from './Users.js';
import sequelize from '../services/sequelize.js';

class UserHistory extends Model {

}
UserHistory.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tooth: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'userhistory',
    tableName: 'history',
  });

Users.hasMany(UserHistory, {
  foreignKey: 'usersId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'user_history',
});

UserHistory.belongsTo(Users, {
  foreignKey: 'usersId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'history_user',
});

Users.hasMany(UserHistory, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'dentist_history',
});

UserHistory.belongsTo(Users, {
  foreignKey: 'dentistId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'history_dentist',
});


export default UserHistory;


// Userhistory.hasOne(Userhistory, {
//   foreignKey: 'hId',
//   onDelete: 'cascade',
//   onUpdate: 'cascade',
//   as: 'parent_history',
// });


/* CREATE TABLE `history` (
  `id` bigint(20) NOT NULL,
  `users_id` bigint(20) DEFAULT NULL,
  `dentist_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `registration` date DEFAULT NULL,
  `tooth` int(11) DEFAULT NULL */