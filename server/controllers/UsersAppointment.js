// import {
//   Clinic, UserHistory, Users,
// } from '../models/index.js';
//
// class UsersAppointment {
//   static appointmentRegister = async (req, res, next) => {
//     try {
//       const {
//         title,
//         tooth,
//         date,
//         note,
//         usersId,
//         dentistId,
//         clinicId,
//         // service,
//       } = req.body;
//
//       const appointment = await Appointment.create({
//         date,
//         note,
//         usersId,
//         dentistId,
//       });
//
//       const userhistory = await Userhistory.create({
//         title,
//         tooth,
//         usersId,
//         dentistId,
//       });
//
//       res.json({
//         status: 'ok',
//         appointment,
//         userhistory,
//         payment,
//       });
//     } catch (e) {
//       next(e);
//     }
//   };
//
//   static userPayment = async (req, res, next) => {
//     try {
//       const {
//         price, usersId, dentistId,
//       } = req.body;
//       // const pay = await Payment.create({
//       //   clinicId,
//       //   usersId,
//       //   dentistId,
//       // });
//       const payment = await Payment.findOne({
//         where: {
//           $and: [
//             { usersId },
//             { dentistId },
//           ],
//         },
//       });
//       payment.amount += +price;
//       payment.save();
//       res.json({
//         status: 'ok',
//         payment,
//       });
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   static getExpiredAppointments = async (req, res, next) => {
//     try {
//       const expiredAppointments = await Appointment.findAll({
//         where: { date: { $lt: Date.now() } },
//       });
//       res.json({
//         status: 'ok',
//         expiredAppointments,
//       });
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   static getUsersByDentist = async (req, res, next) => {
//     try {
//       const { dentistId } = req.body;
//       const allUsers = await Userhistory.findAll({
//         where: {
//           dentistId: { $eq: dentistId },
//         },
//         attributes: ['usersId'],
//         group: ['usersId'],
//       });
//       const userIds = allUsers.map((u) => u.usersId);
//
//       const appointUser = await Users.findAll({
//
//         where: {
//           id: userIds,
//         },
//         attributes: ['id', 'name', 'lname'],
//       });
//       res.json({
//         status: 'ok',
//         // userIds,
//         appointUser,
//       });
//     } catch (e) {
//       next(e);
//     }
//   };
//
//   static changeAppointment = async (req, res, next) => {
//     try {
//       // const {usersId}=req;
//       const {
//         usersId, dentistId, date, notes,
//       } = req.body;
//       const appointment = await Appointment.findOne({
//         where: {
//           $and: { usersId, dentistId },
//         },
//       });
//
//       appointment.date = date;
//       appointment.notes = notes;
//
//       await appointment.save();
//       res.json({
//         status: 'ok',
//         appointment,
//       });
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   static getUserHistory= async (req, res, next) => {
//     try {
//       // const { usersId, dentistId } = req;
//       const { usersId, dentistId } = req.body;
//       const usershistory = await UserHistory.findOne({
//         where: {
//           $and: [
//             { usersId },
//             { dentistId },
//           ],
//         },
//       });
//       const dent = await Users.findAll({
//         where: {
//           id: dentistId,
//         },
//       });
//       const clinicid = dent.map((d) => d.clinicId);
//       const clinic = await Clinic.findOne({
//         attributes: ['name'],
//         where: {
//           id: clinicid,
//         },
//
//       });
//       res.json({
//         usershistory,
//         clinic,
//         status: 'ok',
//       });
//     } catch (e) {
//       next(e);
//     }
//   }
// }
//
// export default UsersAppointment;