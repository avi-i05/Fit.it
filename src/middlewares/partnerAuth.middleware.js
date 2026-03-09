import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { LogisticPartner } from "../models/logisticPatner.model.js";

export const verifyPartnerJWT = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", " ");
        
        if(!token){
            throw new ApiError(401, "Unauthorized access");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded){
            throw new ApiError(401, "Verification Failed");
        }

        const partner = await LogisticPartner.findById(decoded._id).select("-password -refreshToken");


        if (!partner) {
            throw new ApiError(401, "Unauthorized access");
        }

        req.partner = partner;

        next();

    } catch (error) {
        throw new ApiError(401, "Unauthorized access");
    }
});

