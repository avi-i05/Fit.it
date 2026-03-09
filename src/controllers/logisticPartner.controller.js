import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { LogisticPartner } from "../models/logisticPatner.model.js";

const generateAuthToken = async (partnerId) => {
  const partner = await LogisticPartner.findById(partnerId);
  if (!partner) throw new ApiError(404, "Partner not found");
  const accessToken = LogisticPartner.generateAccessToken(partner);
  const refreshToken = LogisticPartner.generateRefreshToken(partner);
  partner.refreshToken = refreshToken;
  await partner.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerLogisticPartner = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    password,
    address,
    vehicleType,
    vehicleNumber,
    serviceTypes,
  } = req.body;

  if (
    [
      fullName,
      phone,
      email,
      address,
      password,
      vehicleType,
      vehicleNumber,
      serviceTypes,
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingPartner = await LogisticPartner.findOne({ email, phone });
  if (existingPartner) {
    throw new ApiError(400, "Partner already exists");
  }

  const partner = await LogisticPartner.create({
    fullName,
    phone,
    email,
    address,
    password,
    vehicleType,
    vehicleNumber,
    serviceTypes,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, partner, "Logistic partner created successfully")
    );
});

const getAllLogisticPartner = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = (page - 1) * limit;

  const partners = await LogisticPartner.find().skip(skip).limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: partners,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(partners.length / parseInt(limit)),
          totalPartners: partners.length,
        },
      },
      "Logistic partners retrieved successfully"
    )
  );
});

const getLogisticPartnerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Partner ID is required");
  }

  const partner = await LogisticPartner.findById(id);
  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, partner, "Partner retrieved successfully"));
});

const updateLogisticPartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    phone,
    email,
    address,
    vehicleType,
    vehicleNumber,
    serviceTypes,
    availabilityStatus,
  } = req.body;

  if (!id) {
    throw new ApiError(400, "Partner ID is required");
  }

  if (
    [
      fullName,
      phone,
      email,
      address,
      vehicleType,
      vehicleNumber,
      serviceTypes,
      availabilityStatus,
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const partner = await LogisticPartner.findByIdAndUpdate(
    id,
    {
      fullName,
      phone,
      email,
      address,
      vehicleType,
      vehicleNumber,
      serviceTypes,
      availabilityStatus,
    },
    { new: true }
  );

  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, partner, "Partner updated successfully"));
});

const deleteLogisticPartner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Partner ID is required");
  }

  const partner = await LogisticPartner.findByIdAndDelete(id);
  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Partner deleted successfully"));
});

const updateLogisticPartnerLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;

  if (!id) {
    throw new ApiError(400, "Partner ID is required");
  }

  if (lat === undefined || lng === undefined) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const partner = await LogisticPartner.findByIdAndUpdate(
    id,
    {
      currentLocation: {
        lat,
        lng,
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, partner, "Partner location updated successfully")
    );
});

const partnerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field === ""))
    throw new ApiError(400, "All fields are required");

  const partner = await LogisticPartner.findOne({ email });

  if (!partner) throw new ApiError(404, "Partner not found");

  const isPasswordCorrect = await partner.isPasswordCorrect(password);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAuthToken(partner?._id);

  if (!accessToken || !refreshToken)
    throw new ApiError(500, "Failed to generate authentication tokens");

  const loggedInPartner = await LogisticPartner.findById(partner._id).select(
    "-password -refreshToken"
  );

  if (!loggedInPartner)
    throw new ApiError(404, "Partner not found after login");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInPartner, "Login successful"));
});

const partnerLogout = asyncHandler(async (req, res) => {
  const partnerId = req.partner._id;

  if (!partnerId) throw new ApiError(400, "Partner ID is required for logout");

  const partner = await LogisticPartner.findById(partnerId);

  if (!partner) throw new ApiError(404, "Partner not found");

  partner.refreshToken = null;

  await partner.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logout successful"));
});

export {
  registerLogisticPartner,
  getAllLogisticPartner,
  getLogisticPartnerById,
  updateLogisticPartner,
  deleteLogisticPartner,
  updateLogisticPartnerLocation,
  partnerLogin,
  partnerLogout,
};
