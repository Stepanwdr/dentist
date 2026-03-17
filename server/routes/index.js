import express from "express";
import users from "./users.js";
import clinic from "./clinic.js";
import timeSlots from "./time-slots.js";
import auth from "./auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ title: "Dentist API" });
});
router.use("/auth", auth);
router.use("/users", users);
router.use("/clinic", clinic);
router.use("/time-slots", timeSlots);

export default router;