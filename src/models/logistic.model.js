import mongoose from "mongoose";


const logisticsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    serviceLevel: {
      type: String,
      enum: ["STANDARD", "EXPRESS", "FEATURED"],
      required: true,
    },

    deliveryType: {
      type: String,
      enum: ["THIRD_PARTY", "IN_HOUSE"],
      required: true,
    },

    thirdParty: {
      provider: String,
      trackingId: String,
      trackingUrl: String,
      webhookPayload: Object,
    },

    inHouse: {
      partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LogisticPartner",
      },
      status: {
        type: String,
        enum: [
          "ASSIGNED",
          "PICKED_UP",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ],
      },
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "ASSIGNED",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED",
        "CANCELLED",
      ],
      default: "CREATED",
    },

    estimatedDeliveryTime: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default Logistic = mongoose.model("Logistic", logisticsSchema);
