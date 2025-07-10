import express from "express";
import upload from "../middlewares/multer.js";
import { uploadSingle } from "../middlewares/uploadImage.js";
import {
  createService,
  getAllServices,
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/add", upload.single("imageUrl"), uploadSingle, createService);
router.get("/", getAllServices);

export default router;
