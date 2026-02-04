import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const generateTokens = async (adminId) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if ([name, email, password, role].some((field) => field.trim() === "")) {
    return new ApiError(400, "All fields are required");
  }

  const existingAdmin = await Admin.findOne({ email: email });

  if (existingAdmin) {
    throw new ApiError(409, "Admin with given email already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role
  });

  if (!admin) {
    throw new ApiError(500, "Error creating admin");
  }
  // console.log("Admin created successfully:", admin);

  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  // console.log("Admin created successfully:", createdAdmin);

  if (!createdAdmin) {
    throw new ApiError(500, "Error creating admin");
  }

  return res.status(201).json(
    new ApiResponse(201, createdAdmin, "Admin registered successfully")
  );
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    return new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!admin.role || (admin.role !== "admin" && admin.role !== "super-admin")) {
    throw new ApiError(403, "Access denied. Not an admin.");
  }

  const isPasswordCorrect = await admin.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateTokens(admin?._id);

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!loggedInAdmin) {
    throw new ApiError(500, "Error logging in admin");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          accessToken: accessToken,
        },
        "Admin logged in successfully"
      )
    );
});

const adminLogout = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $set: {
        refreshToken: null,
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
    .json(new ApiResponse(200, null, "Admin logged out successfully"));
});

const adminRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return new ApiError(401, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    

    const admin = await Admin.findById(decodedToken?.id).select("-password -refreshToken");

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const { accessToken, newRefreshToken } = await generateTokens(admin._id);

    if (!newRefreshToken && !accessToken) {
      throw new ApiError(500, "Error generating tokens");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            admin: admin,
            accessToken: accessToken,
          },
          "Admin refresh token generated successfully"
        )
      );
  } catch (error) {
    throw error;
  }
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select(
    "-password -refreshToken"
  );

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if ([name, email].some((field) => field.trim() === "")) {
    return new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      name,
      email,
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin profile updated successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if ([oldPassword, newPassword].some((field) => field.trim() === "")) {
    return new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isOldPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  admin.password = newPassword;
  await admin.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});


const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.admin._id);

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    return res
        .status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json(new ApiResponse(200, null, "Admin deleted successfully"));
})


export {
    registerAdmin,
    adminLogin,
    adminLogout,
    adminRefreshToken,
    getAdminProfile,
    updateProfile,
    updatePassword,
    deleteAdmin
}