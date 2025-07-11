import { errorHandler } from "../middlewares/error.js";
import Rating from "../models/rating.model.js";
import Schedule from "../models/schedule.model.js";
import Service from "../models/service.model.js";

export const addRating = async (request, response, next) => {
  try {
    const { scheduleId, rating, comment } = request.body;
    const userId = request.user.id;

    // 1. Validate rating input
    if (rating < 1 || rating > 5) {
      return next(errorHandler(400, "Rating must be between 1 and 5"));
    }

    // 2. Find the schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return next(errorHandler(404, "Schedule not found"));
    }

    // 3. Only allow rating if schedule is completed
    const validStatuses = ["Delivered", "Completed"];
    if (!validStatuses.includes(schedule.status)) {
      return next(
        errorHandler(
          400,
          `Rating only allowed for completed services. Current status: ${schedule.status}`
        )
      );
    }

    // 4. Prevent duplicate rating for the same schedule
    const existingRating = await Rating.findOne({ scheduleId });
    if (existingRating) {
      return next(errorHandler(400, "This schedule already has a rating"));
    }

    // 5. Create and save the rating
    const newRating = new Rating({
      scheduleId,
      userId,
      driverId: schedule.driverId,
      serviceId: schedule.serviceId,
      ratings: rating,
      comment,
    });

    const savedRating = await newRating.save();

    const allRatings = await Rating.find({ serviceId: schedule.serviceId });
    const avg =
      allRatings.reduce((acc, item) => acc + item.ratings, 0) /
      allRatings.length;

    await Service.findByIdAndUpdate(schedule.serviceId, {
      $set: { averageRating: avg },
    });

    response.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: savedRating,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while adding rating."));
  }
};

export const checkEligibility = async (request, response, next) => {
  try {
    const scheduleId = request.params.id;
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return next(errorHandler(404, "Schedule not found"));
    }

    const existingRating = await Rating.findOne({ scheduleId });

    const validStatuses = ["Delivered", "Completed"];
    const isEligible =
      validStatuses.includes(schedule.status) && !existingRating;

    if (existingRating) {
      return response.status(200).json({
        rating: existingRating,
        canRate: false,
        currentStatus: schedule.status,
        alreadyRated: true,
      });
    } else {
      return response.status(200).json({
        canRate: isEligible,
        currentStatus: schedule.status,
        alreadyRated: false,
      });
    }
  } catch (error) {
    next(errorHandler(500, "Error occurred while checking eligibility."));
  }
};
