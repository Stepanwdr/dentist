import {
  Users, Clinic, UserHistory
} from '../models/index.js';
import jwt from "jsonwebtoken";
import { NotificationService } from "../services/notifications/NotificationService.js";
const { JWT_SECRET  } = process.env;

class UsersController {

  static myAccount = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.replace(/^Bearer /, '');
      const data = await jwt.verify(token, JWT_SECRET);
      const user = await Users.findByPk(data.userId);
      if (user && user.status !== 'active') {
        res.status(403).json({
          errors: {
            status: 'You are deactivated',
          },
        });
        return;
      }
      await  NotificationService.send(user.id,{title:"Welcome to Dentist",body:"Welcome to Dentist",type:"welcome",data:{}});
      res.json({
        status: 'ok',
        result: user,
        loginService: req.loginService,
      });
    } catch (e) {
      next(e);
    }
  };

  static getDentistByClinic = async (req, res, next) => {
    try {
      const { clinicId } = req.body;
      console.log(clinicId);

      const list = await Users.findAll({
        where: {},
        include: [{
          model: Clinic,
          as: 'clinic',
          required: true,

          where: {
            id: clinicId,
          },

        }],
      });
      res.json({
        status: 'ok',
        list,
      });
    } catch (e) {
      next(e);
    }
  }

  static getSingleUser =async (req, res, next) => {
    try {
      const { uId } = req.body;
      const singleUser = await Users.findOne({
        where: { id: uId },
        include: [{
          model: Rating,
          through: {
            attributes: [],
          },
          as: 'user_rating',
          attributes: ['rating', 'userCount'],
        }],
        subQuery: true,
      });
      res.json({
        status: 'ok',
        singleUser,
      });
    } catch (e) {
      next(e);
    }
  };

  static getUserList = async (req, res, next) => {
    try {
      //  const { clinicId } = req.body;
      console.log({
        UserHistory, Clinic, Users,
      });
      const users = await Users.findAll({
        include: [{
          model: UserHistory,
          as: 'user_history',
          // limit: 1,
          include: [{
            model: Users,
            as: 'history_dentist',
            include: [{
              model: Clinic,
              as: 'clinic',

              where: {},

            }],
          }],
        }],
        subQuery: false,
      });

      res.json({
        status: 'ok',
        users,
      });
    } catch (e) {
      next(e);
    }
  };

  static getClinicUsers = async (req, res, next) => {
    try {
      const {
        clinicsId,
      } = req.body;
      const dentists = await Users.findAll({
        where: {
          clinicId: clinicsId,
        },
      });
      const dentId = dentists.map((d) => d.id);
      const users = await Userhistory.findAll({
        where: {
          dentistId: dentId,
        },
        attributes: ['usersId'],
        group: ['usersId'],
      });
      const userIds = users.map((u) => u.usersId);

      const appointUser = await Users.findAll({

        where: {
          id: userIds,
        },
        attributes: ['id', 'name', 'lname'],
      });
      res.json({
        status: 'ok',
        appointUser,
        // users
        // a,
      });
    } catch (e) {
      next(e);
    }
  };

  static updateUsers = async (req, res, next) => {
    const { id } = req.body;
    const {
      name,
      lname,
      fname,
      email,
      address,
      phone,
      birthDate,
      role,
      speciality,
      gender,
    } = req.body;
    try {
      const users = await Users.findByPk(id);
      users.name = name;
      users.lname = lname;
      users.fname = fname;
      users.email = email;
      users.address = address;
      users.phone = phone;
      users.birthDate = birthDate;
      users.role = role;
      users.speciality = speciality;
      users.gender = gender;

      await users.save();

      res.json({
        status: 'ok',
        users,
      });
    } catch (e) {
      next(e);
    }
  };

  static getAllUsers = async (req, res, next) => {
    try {
      const { name, lname, role } = req.body;
      const { cname } = req.body;
      const allclinics = await Clinic.findAll({
        where: {
          name: { $like: `${cname}%` },
        },
      });
      const clinicId = allclinics.map((c) => c.id);
      const allusers = await Users.findAll({
        where: {
          $or: [

            {
              $and: [
                { clinicId },
                { role }],
            },
            {
              $and: [
                { name: { $like: `%${name}%` } },
                { role }],
            },
            {
              $and: [
                { name: { $like: `%${name}%` } },
                { lname: { $like: `%${lname}%` } },
                { role }],
            },
          ],
        },

      });
      const clId = allusers.map((u) => u.clinicId);
      const clinics = await Clinic.findAll({
        where: {
          id: clId,
        },
      });
      res.json({
        status: 'ok',
        allusers,
        clinics,
      });
    } catch (e) {
      next(e);
    }
  };

  static userDelete = async (req, res, next) => {
    try {
      const { uId } = req.body;
      const deleteduser = await Users.findOne({
        where: { id: uId },
      });
      await deleteduser.destroy();

      res.json({
        status: 'ok',
        deleteduser,
      });
    } catch (e) {
      next(e);
    }
  }

  static pushToken = async (req, res, next) => {
    try {
      const { token, userId } = req.body;
      const user = await Users.findByPk(userId);
      user.pushToken = token;
      await user.save();
      res.json({
        status: 'ok',
        user,
      });
    }
    catch (e){
      next(e);
    }
  }
}
export default UsersController;