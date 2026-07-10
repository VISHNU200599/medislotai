// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { User } = require("../models");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "medislot_super_secret_jwt_key_change_in_production_2024"
    );

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User not found in MongoDB Atlas");
    }

    if (!user.is_active) {
      throw new ApiError(403, "Your account has been deactivated");
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    throw error;
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role: ${roles.join(" or ")}`)
      );
    }
    next();
  };
};

module.exports = { verifyJWT, authorizeRoles };
