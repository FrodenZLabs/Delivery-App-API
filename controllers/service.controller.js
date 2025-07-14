import { errorHandler } from "../middlewares/error.js";
import Service from "../models/service.model.js";

export const createService = async (request, response, next) => {
  try {
    const {
      name,
      subname,
      description,
      baseFee,
      perKmFee,
      available,
      openDay,
      closeDay,
      openTime,
      closeTime,
    } = request.body;

    if (!request.imageUrl) {
      return next(errorHandler(400, "Service image is required"));
    }

    const service = new Service({
      name,
      subname,
      description,
      imageUrl: request.imageUrl,
      baseFee,
      perKmFee,
      available,
      openDay,
      closeDay,
      openTime,
      closeTime,
    });

    await service.save();

    response.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    next(errorHandler(500, "Error creating service"));
  }
};

export const getAllServices = async (request, response, next) => {
  try {
    const sort = request.query.sort; // price_high, price_low, a_z, z_a, all
    const search = request.query.search || "";
    const limit = parseInt(request.query.limit) || 10;
    const page = parseInt(request.query.page) || 1;
    const skip = (page - 1) * limit;

    const query = {};

    // ✅ Search filter (case-insensitive)
    if (search.trim() !== "") {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ Sorting logic
    let sortOptions = {};
    if (sort === "price_high") {
      sortOptions = { baseFee: -1 };
    } else if (sort === "price_low") {
      sortOptions = { baseFee: 1 };
    } else if (sort === "a_z") {
      sortOptions = { name: 1 };
    } else if (sort === "z_a") {
      sortOptions = { name: -1 };
    }

    // ✅ Count total results (before pagination)
    const total = await Service.countDocuments(query);

    // ✅ Fetch data with filters, sorting, and pagination
    const services = await Service.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // ✅ Send response
    response.status(200).json({
      success: true,
      data: services,
      meta: {
        limit,
        pageSize: services.length,
        total,
        currentPage: page,
      },
    });
  } catch (error) {
    next(errorHandler(500, "Failed to get all services", error));
  }
};
