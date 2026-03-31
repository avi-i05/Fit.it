import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LogisticPartner } from "../models/logisticPatner.model.js";
export const logisticPartnerAuth = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized access");
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        if(!decoded){
            throw new ApiError(401, "verification failed");
        }
    
        const logisticPartner = await LogisticPartner.findById(decoded?._id).select("-password -refreshToken");
    
        if(!logisticPartner){
            throw new ApiError(404, "Logistic Partner not found");
        }
    
        req.logisticPartner = logisticPartner;
        next();
    }catch(error){
        next(error);
    
    }
});