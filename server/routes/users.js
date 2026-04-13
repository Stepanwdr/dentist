import express from 'express';
import UsersController from '../controllers/usersController.js';
// import UsersAppointment from '../controllers/UsersAppointment.js';
import permit from '../middlewares/permisssions.js';
import ClinicController from "../controllers/ClinicController.js";

const router = express.Router();
router.get('/account', UsersController.myAccount);

// router.post('/appointment', UsersAppointment.appointmentRegister);
router.get('/dentist-list', UsersController.getDentistByClinic);
router.post('/push-token', UsersController.pushToken);
router.get('/user-list', UsersController.getUserList);
router.get('/clinic-users-list', UsersController.getClinicUsers);
// router.get('/user-list-by-dentist', UsersAppointment.getUsersByDentist);
router.get('/all-user-list', UsersController.getAllUsers);
// router.get('/user-history', UsersAppointment.getUserHistory);
router.get('/single-user', UsersController.getSingleUser);
// router.put('/appointment-change', UsersAppointment.changeAppointment);

router.put('/users-update', UsersController.updateUsers);
router.delete('/delete-user', UsersController.userDelete);

// router.get('/expired-appointments', permit('admin', 'administrator', 'director', 'doctor'), UsersAppointment.getExpiredAppointments);
router.put('/users-update', permit('admin', 'administrator', 'director', 'doctor'), UsersController.updateUsers);
router.get('/all-images', ClinicController.getAllImages);
export default router;