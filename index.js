import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} from "./config/config.js";
dotenv.config({ quiet: true });

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

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

app.get("/api/v1", (req, res) => {
  res.send("<h1>Hello world<h1/>");
  console.log("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Listening on port: ${port}`);
});
