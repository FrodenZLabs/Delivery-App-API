import jwt from "jsonwebtoken";
import { errorHandler } from "./error";

export const verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization;

  // ✅ Check if Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      errorHandler(401, "You are not logged in. Please login or register.")
    );
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(
          errorHandler(401, "Your session has expired. Please login again.")
        );
      }
      if (err.name === "JsonWebTokenError") {
        return next(errorHandler(401, "Invalid token. Please login again."));
      }
      return next(
        errorHandler(401, "An error occurred while verifying the token")
      );
    }

    request.user = user;
    next();
  });
};
