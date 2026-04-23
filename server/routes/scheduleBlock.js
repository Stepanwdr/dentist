import express from "express";
import ScheduleBlockController from "../controllers/ScheduleBlockController.js"

const router = express.Router();
router.post('/create',  ScheduleBlockController.create);

export default router;