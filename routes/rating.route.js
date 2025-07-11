import express from "express";
import { verifyToken } from "../middlewares/verifyUser.js";
import {
  addRating,
  checkEligibility,
} from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/add", verifyToken, addRating);
router.get("/eligible/:id", verifyToken, checkEligibility);

export default router;
