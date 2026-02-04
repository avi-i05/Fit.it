import jwt from "jsonwebtoken";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifySellerJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized access");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded){
            throw new ApiError(401, "verification failed");
        }

        const seller = await Seller.findById(decoded?._id).select("-password -refreshToken");

        if(!seller){
            throw new ApiError(404, "User not found");
        }

        req.seller = seller;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Internal server error");
    }
})