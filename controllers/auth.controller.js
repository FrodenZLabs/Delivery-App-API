import { errorHandler } from "../middlewares/error.js";
import Auth from "../models/auth.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (request, response, next) => {
  try {
    const { firstName, lastName, email, password } = request.body;

    const existingUserByEmail = await Auth.findOne({ email });
    if (existingUserByEmail) {
      return next(errorHandler(400, "Email already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new Auth({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    response.status(201).json({
      success: true,
      message: "User registered successfully",
      savedUser,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred sign up", error));
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const validUser = await Auth.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    // 🔐 Set token in header
    response.setHeader("Authorization", `Bearer ${token}`);

    response.status(200).json({
      success: true,
      message: "User has logged in successfully",
      token: token,
      user: rest,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred signing in", error));
  }
};
