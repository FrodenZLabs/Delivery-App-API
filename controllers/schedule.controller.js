import { errorHandler } from "../middlewares/error.js";
import Schedule from "../models/schedule.model.js";

export const createSchedule = async (request, response, next) => {
  try {
    const { serviceId, deliveryInfoId, scheduleDate, scheduleTime } =
      request.body;
    const userId = request.user.id;

    if (
      !userId ||
      !serviceId ||
      !deliveryInfoId ||
      !scheduleDate ||
      !scheduleTime
    ) {
      return next(errorHandler(400, "All fields are required."));
    }

    const newSchedule = new Schedule({
      userId,
      serviceId,
      deliveryInfoId,
      scheduleDate,
      scheduleTime,
      status: "Pending",
    });

    await newSchedule.save();
    response.status(201).json({
      success: true,
      message: "Schedule added successfully.",
      newSchedule,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while creating schedule."));
  }
};

export const updateScheduleByID = async (request, response, next) => {
  try {
    const scheduleId = request.params.id;
    const { status } = request.body;

    if (!status) {
      return next(errorHandler(400, "Status is required."));
    }

    const allowedStatuses = [
      "Pending",
      "Order Placed",
      "Driver Assigned",
      "In Transit",
      "Completed",
      "Canceled",
    ];

    if (!allowedStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid status value."));
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("driverId")
      .populate("serviceId")
      .populate("deliveryInfoId");

    if (!updatedSchedule) {
      return next(errorHandler(404, "Schedule not found."));
    }

    response.status(200).json({
      success: true,
      message: "Schedule status updated successfully.",
      data: updatedSchedule,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while updating schedule status."));
  }
};

export const getScheduleByUserID = async (request, response, next) => {
  try {
    const userId = request.params.id;
    const statusFilter = request.query.status;

    // 1. Fetch all schedules for the user
    let schedules = await Schedule.find({ userId })
      .populate("driverId")
      .populate("serviceId")
      .populate("deliveryInfoId");

    // 2. If a status filter is provided, filter the results
    if (statusFilter) {
      schedules = schedules.filter((schedule) => {
        if (statusFilter === "Pending") {
          return [
            "Pending",
            "Order Placed",
            "Driver Assigned",
            "In Transit",
          ].includes(schedule.status);
        } else if (statusFilter === "Completed") {
          return schedule.status === "Completed";
        } else if (statusFilter === "Canceled") {
          return schedule.status === "Canceled";
        }
        return false;
      });
    }

    if (schedules.length === 0) {
      return response.status(404).json({
        success: false,
        message: statusFilter
          ? `No ${statusFilter} schedules found for this user.`
          : "No schedules found for this user.",
      });
    }

    // 3. Respond with data
    response.status(200).json({
      success: true,
      message: "Schedules retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    next(
      errorHandler(500, "Error occurred while fetching schedule by user id.")
    );
  }
};

export const getAllSchedules = async (request, response, next) => {
  try {
    const schedules = await Schedule.find();

    response.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while fetching schedules"));
  }
};
