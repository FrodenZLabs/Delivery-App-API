import express from "express";
import {
  createDeliveryInfo,
  getAllDeliveryInfo,
  getDeliveryInfoByUserID,
  updateDeliveryInfo,
} from "../controllers/delivery_info.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, createDeliveryInfo);
router.put("/update/:id", verifyToken, updateDeliveryInfo);
router.get("/", verifyToken, getAllDeliveryInfo);
router.get("/user/:id", verifyToken, getDeliveryInfoByUserID);

export default router;
