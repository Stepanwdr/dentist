import express from 'express';
import NotificationController from "../controllers/NotificationController.js";

const router = express.Router();
router.get('/getAll', NotificationController.getAll);
router.get('/getOne', NotificationController.getOne);
router.post('/create', NotificationController.create);
router.patch('/markAllAsRead', NotificationController.markAllAsRead);
router.patch('/markAsRead/:id', NotificationController.markAsRead);

export default router;