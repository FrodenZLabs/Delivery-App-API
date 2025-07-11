import express from "express";
import { verifyToken } from "../middlewares/verifyUser.js";
import {
  createSchedule,
  getAllSchedules,
  getScheduleByUserID,
  updateScheduleByID,
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.post("/add", verifyToken, createSchedule);
router.put("/update/:id", verifyToken, updateScheduleByID);
router.get("/", verifyToken, getAllSchedules);
router.get("/user/:id", verifyToken, getScheduleByUserID);

export default router;
