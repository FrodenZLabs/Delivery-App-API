import mongoose, { Schema } from "mongoose";

const deliveryInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DeliveryInfo = mongoose.model("DeliveryInfo", deliveryInfoSchema);

export default DeliveryInfo;
