import { errorHandler } from "../middlewares/error.js";
import Driver from "../models/driver.model.js";
import Schedule from "../models/schedule.model.js";

export const addDriver = async (request, response, next) => {
  try {
    const serviceId = request.params.id;
    const { firstName, lastName, licensePlate, vehicleType, contactNumber } =
      request.body;

    if (!request.imageUrl) {
      return next(errorHandler(400, "Driver image is required"));
    }

    const driver = new Driver({
      serviceId,
      firstName,
      lastName,
      licensePlate,
      vehicleType,
      contactNumber,
      profilePictureUrl: request.imageUrl,
    });

    await driver.save();
    response
      .status(201)
      .json({ success: true, message: "Driver added successfully", driver });
  } catch (error) {
    next(errorHandler(500, "Error occurred while adding driver."));
  }
};

export const getAllDrivers = async (request, response, next) => {
  try {
    const drivers = await Driver.find();
    const total = await Driver.find().countDocuments();

    response.status(200).json({
      success: true,
      message: "Driver information retrieved successfully",
      data: drivers,
      total,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while fetching drivers."));
  }
};

export const assignDriver = async (request, response, next) => {
  try {
    const scheduleId = request.params.id;
    const { driverId } = request.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return next(errorHandler(404, "Schedule not found"));
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return next(errorHandler(404, "Driver not found"));
    }

    schedule.driverId = driver._id;
    schedule.status = "Driver Assigned";
    await schedule.save();

    // 4. Populate the updated schedule with driver data
    const updatedSchedule = await Schedule.findById(scheduleId).populate(
      "driverId",
      "firstName lastName licensePlate vehicleType contactNumber profilePictureUrl"
    );

    response.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: updatedSchedule,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while assigning drivers."));
  }
};

export const getDriversByServiceId = async (request, response, next) => {
  try {
    const serviceId = request.params.id;

    const drivers = await Driver.find({ serviceId });
    const total = await Driver.find({ serviceId }).countDocuments();

    response.status(200).json({
      success: true,
      message: "Drivers retrieved successfully",
      data: drivers,
      total,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while fetching services."));
  }
};
