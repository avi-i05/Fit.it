import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    consumer: {
      type: Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        variant: {
          type: Schema.Types.ObjectId,
          ref: "ProductVariant",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },


    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    orderType: {
      type: String,
      enum: ["express", "featured", "standard"],
      required: true,
    },

    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    OrderStatus: {
      type: String,
      enum: ["pending", "accepted", "ready_to_pickup", "picked_up", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },

    logisticPartner: {
      type: Schema.Types.ObjectId,
      ref: "LogisticPartner",
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ deliveryLocation: "2dsphere" });
orderSchema.index({ pickupLocation: "2dsphere" });

export const Order = mongoose.model("Order", orderSchema);