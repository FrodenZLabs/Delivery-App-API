import mongoose, { Schema } from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/gV6Xy99WsNTWpgT2KUNxopKhP45u8QMrrL2DGi5HYxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
