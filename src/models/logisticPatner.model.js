import mongoose from "mongoose";
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
    partnerImage:{
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    govtId: {
      type: String,
      required: true,
    },
    govtIdImage: {
      type: String,
      required: true,
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
    vehicleImage: {
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
      default: "OFFLINE",
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

logisticPartnerSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

logisticPartnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

logisticPartnerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
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
