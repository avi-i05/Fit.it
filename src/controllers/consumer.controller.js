import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Consumer } from "../models/consumer.model.js";
import jwt from "jsonwebtoken";
import { Address } from "../models/address.model.js";

const generateTokens = async (consumerId) => {
  const consumer = await Consumer.findById(consumerId);
  if (!consumer) {
    throw new ApiError(404, "Consumer not found when generating tokens");
  }
  const accessToken = consumer.generateAccessToken();
  const refreshToken = consumer.generateRefreshToken();
  consumer.refreshToken = refreshToken;
  await consumer.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerConsumer = asyncHandler(async (req, res) => {
  // console.log(req.body);

  // get user details from frontend
  const { displayName, email, password, phoneNumber, gender } = req.body;

  // validate - not empty
  if (
    [displayName, email, password, phoneNumber, gender].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required", 400);
  }
  // check if already exist: email, phoneNumber
  const consumerExist = await Consumer.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  if (consumerExist) {
    throw new ApiError(
      409,
      "Consumer with given email or phone number already exists"
    );
  }
  // create consumer object - register consumer in db
  const consumer = await Consumer.create({
    displayName,
    email,
    password,
    phoneNumber,
    gender,
  });
  // remove password and refreshtoken from the response

  const createdConsumer = await Consumer.findById(consumer._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdConsumer) {
    throw new ApiError(500, "Error creating consumer");
  }
  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Consumer created successfully", createdConsumer)
    );
});

const loginConsumer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required to login");
  }

  const consumer = await Consumer.findOne({
    email: email,
  });
  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  const verifyPassword = await consumer.isPasswordCorrect(password);

  if (!verifyPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateTokens(consumer?._id);

  const loggedInConsumer = await Consumer.findById(consumer?._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        consumer: loggedInConsumer,
      }),
      "Login Successful"
    );
});

const logoutConsumer = asyncHandler(async (req, res) => {
  await Consumer.findByIdAndUpdate(
    req.consumer?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "Logout successful"));
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token not found");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    // console.log("Decoded refresh token: ", decodedToken);

    const consumer = await Consumer.findById(decodedToken?._id);
    // console.log("Consumer found: ", consumer);

    if (consumer.refreshToken !== incomingRefreshToken) {
      throw new ApiError(404, "Consumer not found");
    }

    const { accessToken, newRefreshToken } = await generateTokens(consumer?.id);

    // console.log("Generated tokens: ", { accessToken, newRefreshToken });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, {
          accessToken,
        }),
        "New token generated Successfully"
      );
  } catch (error) {
    throw new ApiError(500, "Error in generating refresh token");
  }
});

// fetching current consumer details

const getCurrentConsumerDetails = asyncHandler(async (req, res) => {
  const consumer = await Consumer.findById(req.consumer?._id).select(
    "-password -refreshToken"
  );

  // console.log("Current consumer: ", consumer);

  if (!consumer) {
    throw new ApiError(404, "Consumer not Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, consumer, "Consumer details fetched successfully")
    );
});


const updateConsumerPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const consumer = await Consumer.findById(req.consumer?._id);

  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  const isPasswordCorrect = await consumer.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  consumer.password = newPassword;

  await consumer.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully"));
});

const updateConsumerProfile = asyncHandler(async (req, res) => {
  const { displayName, email, phoneNumber, gender } = req.body;
  console.log("Update profile req.body: ", req.body);

  if ([displayName, email, phoneNumber, gender].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const consumer = await Consumer.findByIdAndUpdate(
    req.consumer?._id,
    {
      $set: {
        displayName,
        email,
        phoneNumber,
        gender,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, consumer, "Profile updated successfully"));
});

const registerConsumerAddress = asyncHandler(async (req, res) => {
  const { addressLine1, addressLine2, city, state, postalCode, country } =
    req.body;

  if (
    [addressLine1, city, state, postalCode, country].some((field) => !field)
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const address = await Address.create({
    consumer: req.consumer?._id,
    fullName: req.consumer?.displayName,
    phoneNumber: req.consumer?.phoneNumber,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  });

  await Consumer.findByIdAndUpdate(req.consumer?._id, {
    $push: {
      address: address._id,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, address, "Address registered successfully"));
});

const getConsumerAddresses = asyncHandler(async (req, res) => {
  const consumer = await Consumer.findById(req.consumer?._id).populate(
    "address"
  );

  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consumer.address,
        "Consumer addresses fetched successfully"
      )
    );
});

const updateConsumerAddress = asyncHandler(async (req, res) => {
  const { addressId, ...updatedAddress } = req.body;

  const address = await Address.findByIdAndUpdate(addressId, updatedAddress, {
    new: true,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});

const deleteConsumerAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  console.log("Deleting address with ID:", addressId);

  const address = await Address.findByIdAndDelete(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Address deleted successfully"));
});

const deleteConsumerProfile = asyncHandler(async (req, res) => {
  const consumer = await Consumer.findByIdAndDelete(req.consumer?._id);

  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Consumer deleted successfully"));
});

const getAllConsumers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit


  const consumers = await Consumer.find()
    .select("-password -refreshToken")
    .skip(skip)
    .limit(limit);
  
  const totalConsumers = await Consumer.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: consumers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalConsumers / parseInt(limit)),
          totalConsumers,
        },
      },
      "All consumers fetched successfully"
    )
  );
});
const getConsumerById = asyncHandler(async (req, res) => {
  const consumer = await Consumer.findById(req.params.id).select(
    "-password -refreshToken"
  );
  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, consumer, "Consumer details fetched successfully")
    );
});

export {
  registerConsumer,
  loginConsumer,
  logoutConsumer,
  handleRefreshToken,
  getCurrentConsumerDetails,
  updateConsumerPassword,
  updateConsumerProfile,
  registerConsumerAddress,
  getConsumerAddresses,
  updateConsumerAddress,
  deleteConsumerAddress,
  deleteConsumerProfile,
  getAllConsumers,
  getConsumerById
};
