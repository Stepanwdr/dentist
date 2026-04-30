import express from "express";
import ScheduleBlockController from "../controllers/ScheduleBlockController.js"

const router = express.Router();
router.post('/create',  ScheduleBlockController.create);
router.get('/list',  ScheduleBlockController.list);
router.patch('/:id', ScheduleBlockController.update);
router.delete('/:id', ScheduleBlockController.remove);

export default router;
