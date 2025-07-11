import express from "express";
import {
  addDriver,
  assignDriver,
  getAllDrivers,
  getDriversByServiceId,
} from "../controllers/driver.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";
import { uploadSingle } from "../middlewares/uploadImage.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("imageUrl"),
  uploadSingle,
  verifyToken,
  addDriver
);
router.post("/assign-driver/:id", verifyToken, assignDriver);
router.get("/", verifyToken, getAllDrivers);
router.get("/service/:id", verifyToken, getDriversByServiceId);

export default router;
