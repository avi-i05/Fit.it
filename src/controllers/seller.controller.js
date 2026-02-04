import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Seller } from "../models/seller.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateTokens = async(sellerId) => {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }
    
    const accessToken = seller.generateAccessToken();
    const refreshToken = seller.generateRefreshToken();
    seller.refreshToken = refreshToken;
    await seller.save();
    return { accessToken, refreshToken };

}

const registerSeller = asyncHandler(async (req, res) => {
    const { fullName, email, sellerType, phoneNumber, password, brandName, govtID, gstNumber } = req.body;

    let address = {};

    
    if(!req.body.address){
        throw new ApiError(400, "Address is required");
    } else {
        address = JSON.parse(req.body.address);
    }

    if (
        [fullName, email, sellerType, phoneNumber, password, brandName, govtID, gstNumber].some(field => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const exitingSeller = await Seller.findOne({
        $or: [
            {email},
            {govtID},
            {gstNumber}
        ]
    })

    // console.log(exitingSeller)

    if(exitingSeller){
        throw new ApiError(400, "Seller already exists");
    }

    // console.log("req.files", req.files);

    const govtIDImagePath = req.files?.govtIDImage[0]?.path;
    if(!govtIDImagePath){
        throw new ApiError(400, "Government ID image is required");
    }

    const uploadGovtIdImage = await uploadOnCloudinary(govtIDImagePath);
    if(!uploadGovtIdImage){
        throw new ApiError(400, "Failed to upload Government ID image");
    }  

    const seller = await Seller.create({

            fullName: fullName,
            email: email,
            sellerType: sellerType,
            phoneNumber: phoneNumber,
            password: password,
            brandName: brandName,
            govtID: govtID,
            gstNumber: gstNumber,
            govtIDImage: uploadGovtIdImage?.url,
            address: address
    })
    
    const createdSeller = await Seller.findById(seller._id).select("-password");

    res.status(201)
        .json(new ApiResponse(201, { seller: createdSeller }, "Seller created successfully"))

})

const loginSeller = asyncHandler(async(req, res) => {
    const {email, password, phoneNumber} = req.body;

    if(!(email || phoneNumber)){
        throw new ApiError(400, "Email or Phone Number is required");
    }

    const seller = await Seller.findOne({
        $or: [
            { email },
            { phoneNumber }
        ]
    });

    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    const isPasswordValid = await seller.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateTokens(seller._id);

    const loggedInSeller = await Seller.findById(seller._id).select('-password -refreshToken');

    if(!loggedInSeller){
        throw new ApiError(404, "Seller not found");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                seller: loggedInSeller,
                accessToken,
                refreshToken
            }, "Login Successful")
        );
})


const logoutSeller = asyncHandler(async(req, res) =>{
    await Seller.findByIdAndUpdate(
        req.seller?._id,{
            $set: {
                refreshToken: null
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "Logout Successful"));
})


const refreshTokenHnadler = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token not found");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
    if(!decodedToken){
        throw new ApiError(401, "Invalid refresh token");
    }

    const seller = await Seller.findById(decodedToken.id).select('-password -refreshToken');
    if(!seller){
        throw new ApiError(404, "Seller not found");
    }

    if(seller.refreshToken !== incomingRefreshToken){
        throw new ApiError(403, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(seller._id);

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            seller: loggedInSeller,
            accessToken,
            refreshToken
        }, "Login Successful"));
})


const updateSellerProfile = asyncHandler(async(req, res) => {
    const { fullName, email, phoneNumber, brandName} = req.body;

    let address = {};

    if (!req.body.address) {
        throw new ApiError(400, "Address is required");
    } else {
        address = JSON.parse(req.body.address);
    }

    if (
        [fullName, email, phoneNumber, brandName].some(field => field === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const seller = await Seller.findByIdAndUpdate(req.seller?._id, {
        $set: {
            fullName,
            email,
            phoneNumber,
            brandName,
            address
        }
    }, { new: true }).select('-password -refreshToken');

    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    res.status(200).json(new ApiResponse(200, seller, "Profile updated successfully"));
})

const updateSellerPassword = asyncHandler(async(req, res) =>{
    const { currentPassword, newPassword } = req.body;

    const seller = await Seller.findById(req.seller?._id);

    if(!seller){
        throw new ApiError(400, "Seller Not Found");
    }

    const validatingPassword = await seller.isPasswordCorrect(currentPassword);

    if(!validatingPassword){
        throw new ApiError(401, "Incorrect Password");
    }

    seller.password = newPassword;

    await seller.save({ validateBeforeSave: false })

    res.status(200)
        .json(new ApiResponse(200, {
            seller: {
                fullName: seller.fullName,
                email: seller.email,
                phoneNumber: seller.phoneNumber,
                brandName: seller.brandName
            }
        }, "Password Updated Successfully"))
})

const getSellerProfile = asyncHandler(async(req, res) => {
    const seller = await Seller.findById(req.seller?._id).select("-password -refreshToken");

    if(!seller){
        throw new ApiError(404, "Seller Profile Not Found")
    }

    res.status(200)
        .json(
            new ApiResponse(200, {
                seller
            }, "Seller Profile Fetched Successfully.")
        )

})





export {
    registerSeller,
    loginSeller,
    logoutSeller,
    updateSellerPassword,
    updateSellerProfile,
    getSellerProfile,
    refreshTokenHnadler
}