import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { LogisticPartner } from "../models/logisticPatner.model.js";
import { Order } from "../models/order.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getIO } from "../socket/socket.js";

const generateAuthToken = async (partnerId) => {
  const partner = await LogisticPartner.findById(partnerId);
  if (!partner) throw new ApiError(404, "Partner not found");
  const accessToken = partner.generateAccessToken();
  const refreshToken = partner.generateRefreshToken();
  partner.refreshToken = refreshToken;
  await partner.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerLogisticPartner = asyncHandler(async (req, res) => {
  const {
    fullName,
    gender,
    dob,
    age,
    govtId,
    phone,
    email,
    password,
    vehicleType,
    vehicleNumber,
    serviceTypes,
  } = req.body;

  let address = {};
  if (req.body.address) {
    try {
      address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
    } catch (error) {
      throw new ApiError(400, "Invalid address format");
    }
  }

  if (
    [
      fullName,
      gender,
      dob,
      age,
      govtId,
      phone,
      email,
      password,
      vehicleType,
      vehicleNumber,
      serviceTypes,
    ].some((field) => !field || field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const partnerImagePath = req.files?.partnerImage?.[0]?.path;
  const govtIdImagePath = req.files?.govtIdImage?.[0]?.path;
  const vehicleImagePath = req.files?.vehicleImage?.[0]?.path;

  if (!partnerImagePath) {
    throw new ApiError(400, "Partner profile image is required");
  }
  if (!govtIdImagePath) {
    throw new ApiError(400, "Government ID image is required");
  }
  if (!vehicleImagePath) {
    throw new ApiError(400, "Vehicle image is required");
  }

  const existingPartner = await LogisticPartner.findOne({ 
    $or: [{ email }, { phone }, { govtId }] 
  });
  
  if (existingPartner) {
    throw new ApiError(400, "Partner already exists with this email, phone, or government ID");
  }

  const uploadPartnerImage = await uploadOnCloudinary(partnerImagePath);
  const uploadGovtIdImage = await uploadOnCloudinary(govtIdImagePath);
  const uploadVehicleImage = await uploadOnCloudinary(vehicleImagePath);

  if (!uploadPartnerImage || !uploadGovtIdImage || !uploadVehicleImage) {
    throw new ApiError(500, "Failed to upload one or more images. Please try again.");
  }

  const partner = await LogisticPartner.create({
    fullName: fullName.trim(),
    gender: gender.toUpperCase(),
    dob: new Date(dob),
    age: parseInt(age),
    govtId: govtId.trim(),
    phone: phone.trim(),
    email: email.toLowerCase().trim(),
    password,
    vehicleType: vehicleType.toUpperCase(),
    vehicleNumber: vehicleNumber.trim(),
    vehicleImage: uploadVehicleImage.secure_url,
    partnerImage: uploadPartnerImage.secure_url,
    govtIdImage: uploadGovtIdImage.secure_url,
    address,
    serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes],
  });

  const createdPartner = await LogisticPartner.findById(partner._id).select("-password -refreshToken");

  if (!createdPartner) {
    throw new ApiError(500, "Something went wrong while registering the partner");
  }

  const io = getIO();
  io.to("admin_room").emit("new-logistic-partner", {
    partner: createdPartner,
    message: "New logistic partner registered",
    timestamp: new Date()
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { partner: createdPartner }, "Logistic partner registered successfully! Welcome to the Fit.It delivery network.")
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
    vehicleType,
    vehicleNumber,
    serviceTypes,
    availabilityStatus,
    gender,
    dob,
    age,
    govtId,
  } = req.body;

  if (!id) {
    throw new ApiError(400, "Partner ID is required");
  }

  const partner = await LogisticPartner.findById(id);
  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  let address = partner.address;
  if (req.body.address) {
    try {
      address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
    } catch (error) {
      throw new ApiError(400, "Invalid address format");
    }
  }

  if (email && email !== partner.email) {
    const existingEmail = await LogisticPartner.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      throw new ApiError(400, "Email already in use by another partner");
    }
  }

  if (phone && phone !== partner.phone) {
    const existingPhone = await LogisticPartner.findOne({ phone, _id: { $ne: id } });
    if (existingPhone) {
      throw new ApiError(400, "Phone number already in use by another partner");
    }
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName.trim();
  if (phone) updateData.phone = phone.trim();
  if (email) updateData.email = email.toLowerCase().trim();
  if (vehicleType) updateData.vehicleType = vehicleType.toUpperCase();
  if (vehicleNumber) updateData.vehicleNumber = vehicleNumber.trim();
  if (serviceTypes) updateData.serviceTypes = Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes];
  if (availabilityStatus) updateData.availabilityStatus = availabilityStatus;
  if (address) updateData.address = address;
  if (gender) updateData.gender = gender.toUpperCase();
  if (dob) updateData.dob = dob;
  if (age) updateData.age = age;
  if (govtId) updateData.govtId = govtId.trim();

  if (req.files) {
    if (req.files.partnerImage) {
      const partnerImagePath = req.files.partnerImage[0].path;
      const uploadedPartnerImage = await uploadOnCloudinary(partnerImagePath);
      if (uploadedPartnerImage) {
        updateData.partnerImage = uploadedPartnerImage.secure_url;
      }
    }

    if (req.files.govtIdImage) {
      const govtIdImagePath = req.files.govtIdImage[0].path;
      const uploadedGovtIdImage = await uploadOnCloudinary(govtIdImagePath);
      if (uploadedGovtIdImage) {
        updateData.govtIdImage = uploadedGovtIdImage.secure_url;
      }
    }

    if (req.files.vehicleImage) {
      const vehicleImagePath = req.files.vehicleImage[0].path;
      const uploadedVehicleImage = await uploadOnCloudinary(vehicleImagePath);
      if (uploadedVehicleImage) {
        updateData.vehicleImage = uploadedVehicleImage.secure_url;
      }
    }
  }

  const updatedPartner = await LogisticPartner.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPartner, "Partner updated successfully"));
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
    sameSite: "None"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInPartner, "Login successful"));
});

const partnerLogout = asyncHandler(async (req, res) => {
  const partnerId = req.logisticPartner?._id;

  if (!partnerId) throw new ApiError(400, "Partner ID is required for logout");

  const partner = await LogisticPartner.findById(partnerId);

  if (!partner) throw new ApiError(404, "Partner not found");

  partner.refreshToken = null;

  await partner.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Logout successful"));
});

const getMe = asyncHandler(async (req, res) => {
  const partner = await LogisticPartner.findById(req.logisticPartner._id)
    .populate({
      path: "currentOrderId",
      populate: [
        { path: "consumer", select: "displayName email phone" },
        { path: "seller", select: "fullName brandName location address storeName" },
        { path: "shippingAddress" },
        { path: "items.product", select: "productName" }
      ]
    });

  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, partner, "Partner profile retrieved successfully"));
});

const getNearbyOrders = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  // Find orders within 7km radius of pickup location (Seller's location)
  const orders = await Order.find({
    $or: [
      { OrderStatus: "pending" },
      { 
        OrderStatus: { $in: ["accepted", "ready_to_pickup", "picked_up", "out_for_delivery"] },
        logisticPartner: req.logisticPartner._id 
      }
    ],
    pickupLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: 7000, // 7km in meters
      },
    },
    orderType: { $in: ["express", "featured"] }, // Only express and featured
  })
  .populate("consumer", "displayName email phoneNumber")
  .populate("seller", "fullName brandName location address storeName")
  .populate("shippingAddress")
  .populate("items.product", "productName")
  .limit(20);

  const io = getIO();
  io.emit("nearby-orders", orders);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Nearby orders (by pickup location) retrieved successfully"));
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
  getMe,
  getNearbyOrders,
};
