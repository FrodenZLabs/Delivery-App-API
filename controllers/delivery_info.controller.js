import { errorHandler } from "../middlewares/error.js";
import DeliveryInfo from "../models/delivery_info.model.js";

export const createDeliveryInfo = async (request, response, next) => {
  try {
    const { address, city, contactNumber } = request.body;
    if (!address || !city || !contactNumber) {
      return next(errorHandler(400, "All fields are required"));
    }

    const userId = request.user.id;

    const deliveryInfo = new DeliveryInfo({
      userId,
      address,
      city,
      contactNumber,
    });

    await deliveryInfo.save();

    response.status(201).json({
      success: true,
      message: "Delivery Information added successfully",
      data: deliveryInfo,
    });
  } catch (error) {
    next(errorHandler(500, "Error creating delivery info", error));
  }
};

export const updateDeliveryInfo = async (request, response, next) => {
  try {
    const { address, city, contactNumber } = request.body;
    const userId = request.user.id;
    const deliveryInfoId = request.params.id;

    const deliveryInfoUpdateFields = {};
    if (address) {
      deliveryInfoUpdateFields.address = address;
    }
    if (city) {
      deliveryInfoUpdateFields.city = city;
    }
    if (contactNumber) {
      deliveryInfoUpdateFields.contactNumber = contactNumber;
    }

    const updatedDeliveryInfo = await DeliveryInfo.findByIdAndUpdate(
      { _id: deliveryInfoId, userId: userId },
      { $set: deliveryInfoUpdateFields },
      { new: true, runValidators: true }
    );

    if (!updatedDeliveryInfo) {
      return next(errorHandler(404, "User delivery information not found"));
    }

    response.status(200).json({
      success: true,
      message: "User Delivery information updated successfully",
      data: updatedDeliveryInfo,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while updating delivery info"));
  }
};

export const getAllDeliveryInfo = async (request, response, next) => {
  try {
    const deliveryInfo = await DeliveryInfo.find();

    response.status(200).json({
      success: true,
      message: "Delivery information retrieved successfully",
      data: deliveryInfo,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while fetching all deliveries."));
  }
};

export const getDeliveryInfoByUserID = async (request, response, next) => {
  try {
    const userId = request.params.id;

    // Find all delivery records that match the userId
    const userDeliveries = await DeliveryInfo.find({ userId });

    if (!userDeliveries) {
      return next(errorHandler(404, "User delivery information not found"));
    }

    response.status(200).json({
      success: true,
      message: "Delivery Information retrieved successfully",
      data: userDeliveries,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while fetching delivery info"));
  }
};
