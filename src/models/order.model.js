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
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
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
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);