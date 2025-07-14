import mongoose, { Schema } from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    deliveryInfoId: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryInfo",
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
      default: null,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    scheduleDate: {
      type: Date,
      required: true,
    },
    scheduleTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
