import express from 'express';
import AuthController from "../controllers/AuthController.js";

const router = express.Router();
router.post('/register', AuthController.register);
router.post('/register-doctor', AuthController.registerDentist);
router.post('/login', AuthController.login);
router.post('/google', AuthController.loginWithGoogle);
router.post('/refresh', AuthController.refresh);

export default router;