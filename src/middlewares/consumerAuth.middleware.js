import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Consumer} from "../models/consumer.model.js";


export const verifyConsumerJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized access");
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    
        if(!decoded){
            throw new ApiError(401, "verification failed");
        }
    
        const consumer = await Consumer.findById(decoded?._id).select("-password -refreshToken");
    
        if(!consumer){
            throw new ApiError(404, "User not found");
        }

        req.consumer = consumer;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Internal server error");
    }
})