import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Seller } from "../models/seller.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getIO } from "../socket/socket.js";


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

    const { fullName, email, sellerType, storeName, phoneNumber, password, brandName, govtID, gstNumber } = req.body;

    let address = {};
    if (!req.body.address) {
        throw new ApiError(400, "Address is required");
    } else {
        address = JSON.parse(req.body.address);
    }

    let location = {};
    if (!req.body.location) {
        throw new ApiError(400, "Location is required");
    } else {
        location = JSON.parse(req.body.location);
    }

    if (
        [fullName, email, sellerType, phoneNumber, storeName, password, brandName, govtID]
        .some(field => !field)
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const exitingSeller = await Seller.findOne({
        $or: [{ email }, { govtID }, { gstNumber }]
    });

    if (exitingSeller) {
        throw new ApiError(400, "Seller already exists");
    }

    const govtIDImagePath = req.files?.govtIDImage?.[0]?.path;
    const ownerImagePath = req.files?.ownerImage?.[0]?.path;
    const storeImagePath = req.files?.storeImage?.[0]?.path;

    if (!govtIDImagePath || !ownerImagePath || !storeImagePath) {
        throw new ApiError(400, "All images are required");
    }

    const uploadGovtIdImage = await uploadOnCloudinary(govtIDImagePath);
    const uploadOwnerImage = await uploadOnCloudinary(ownerImagePath);
    const uploadStoreImage = await uploadOnCloudinary(storeImagePath);

    if (!uploadGovtIdImage || !uploadOwnerImage || !uploadStoreImage) {
        throw new ApiError(400, "Failed to upload images");
    }

    const seller = await Seller.create({
        fullName,
        email,
        sellerType,
        phoneNumber,
        password,
        brandName,
        govtID,
        gstNumber,
        storeName,
        govtIDImage: uploadGovtIdImage.secure_url,
        ownerImage: uploadOwnerImage.secure_url,
        storeImage: uploadStoreImage.secure_url,
        address,
        location
    });



    const createdSeller = await Seller.findById(seller._id).select("-password");

    const io = getIO();
    io.to("admin_room").emit("new-seller", {
        seller: createdSeller,
        message: "New seller registered",
        timestamp: new Date()
    });

    res.status(201).json(
        new ApiResponse(201, { seller: createdSeller }, "Seller created successfully")
    );

});

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
    }).select("+password");

    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    if(!seller.isVerified){
        throw new ApiError(403, "Seller is not verified");
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
        secure: true,
<<<<<<< HEAD
        sameSite: "None"
=======
        sameSite: "none"
>>>>>>> 72852b9b68d734e00f737e3907d7e47e6e96874f
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
        secure: true,
<<<<<<< HEAD
        sameSite: "None"
=======
        sameSite: "none"
>>>>>>> 72852b9b68d734e00f737e3907d7e47e6e96874f
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "Logout Successful"));
})


const refreshTokenHandler = asyncHandler(async(req, res) => {
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

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

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

    if(req.body.address){
        address = JSON.parse(req.body.address);
    }

    if (
        [fullName, email, phoneNumber, brandName].some(field => field === "")
    ) {
        throw new ApiError(400, "field is required");
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

const removeSellerProfile = asyncHandler(async(req, res) => {
    const seller = await Seller.findByIdAndDelete(req.seller?._id);

    if(!seller){
        throw new ApiError(404, "Seller Profile Not Found");
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, null, "Seller Profile Deleted Successfully.")
        );

})

const getSellers = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sellers = await Seller.find().select("-password -refreshToken").skip(skip).limit(limit);

    if(!sellers){
        throw new ApiError(404, "Sellers Not Found");
    }
    const totalSellers = await Seller.countDocuments();
    res.status(200).json(new ApiResponse(200, {
        sellers,
        pagination: {
            totalSellers,
            totalPages: Math.ceil(totalSellers / limit),
        },
        currentPage: page
    }, "Sellers fetched successfully"));

})

const getSellerById = asyncHandler(async(req, res) => {
    const sellerId = req.params.id;

    const seller = await Seller.findById(sellerId).select("-password -refreshToken");
    if(!seller){
        throw new ApiError(404, "Seller Not Found");
    }
    res.status(200).json(new ApiResponse(200, seller, "Seller fetched successfully"));
})

const updateVerified = asyncHandler(async(req, res) => {
    const sellerId = req.params.id;

    const seller = await Seller.findByIdAndUpdate(sellerId, {
        $set: {
            isVerified: true
        }
    }, { new: true }).select("-password -refreshToken");

    if(!seller){
        throw new ApiError(404, "Seller Not Found");
    }

    res.status(200).json(new ApiResponse(200, seller, "Seller verified successfully"));
})

const blockSeller = asyncHandler(async(req, res) => {
    const sellerId = req.params.id;

    const seller = await Seller.findByIdAndUpdate(sellerId, {
        $set: {
            isVerified: false
        }
    }, { new: true }).select("-password -refreshToken");

    if(!seller){
        throw new ApiError(404, "Seller Not Found");
    }

    res.status(200).json(new ApiResponse(200, seller, "Seller blocked successfully"));
})

export {
    registerSeller,
    loginSeller,
    logoutSeller,
    updateSellerPassword,
    updateSellerProfile,
    getSellerProfile,
    refreshTokenHandler,
    removeSellerProfile,
    getSellers,
    getSellerById,
    updateVerified,
    blockSeller
}
