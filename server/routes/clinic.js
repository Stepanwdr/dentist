import express from 'express';
import multer from 'multer';

import ClinicController from '../controllers/ClinicController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.post('/clinic-register', upload.single('file'), ClinicController.clinicRegister);
router.get('/clinics', ClinicController.getAllClinics);
router.put('/clinic-update', upload.single('file'), ClinicController.updateClinic);
router.get('/single-clinic', ClinicController.getSingleClinic);
router.delete('/clinic-delete', ClinicController.clinicDelete);
// router.post('/clinic_register', upload.array('files[]', 5), ClinicController.clinicRegister);

export default router;