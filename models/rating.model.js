import mongoose, { Schema } from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
