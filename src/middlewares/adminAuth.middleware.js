import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("token: ",token)


    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("decoded: ", decoded)

    const admin = await Admin.findById(decoded._id).select(
      "-password -refreshToken"
    );

    console.log("admin: ", admin)
    
    if (!admin) {
      throw new ApiError(401, "Unauthorized access");
    }

    req.admin = admin;

    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized access");
  }
});
