import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  MONGO_DB,
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} from "./config/config.js";
import authRoutes from "./routes/auth.route.js";
import driverRoutes from "./routes/driver.route.js";
import serviceRoutes from "./routes/service.route.js";
import deliveryInfoRoutes from "./routes/delivery_info.route.js";
import ratingRoutes from "./routes/rating.route.js";
import scheduleRoutes from "./routes/schedule.route.js";
dotenv.config({ quiet: true });

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("✅ Successfully connected to database");
    })
    .catch((err) => {
      console.log("❌ Database error: ", err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/delivery-info", deliveryInfoRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/rating", ratingRoutes);

app.get("/api/v1", (req, res) => {
  res.send("<h1>Hello world<h1/>");
  console.log("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Listening on port: ${port}`);
});

// Middleware for handling errors
app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  response.status(statusCode).json({
    success: true,
    statusCode,
    message,
  });
});
