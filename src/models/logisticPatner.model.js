import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const logisticPartnerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["BIKE", "SCOOTER"],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },

    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
    },

    serviceTypes: {
      type: [String],
      enum: ["EXPRESS", "FEATURED", "BOTH"],
    },

    availabilityStatus: {
      type: String,
      enum: ["IDLE", "DELIVERING", "OFFLINE"],
      default: "IDLE",
    },

    currentLocation: locationSchema,

    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

logisticPartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

logisticPartnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

logisticPartnerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

logisticPartnerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
        id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const LogisticPartner = mongoose.model(
  "LogisticPartner",
  logisticPartnerSchema
);
