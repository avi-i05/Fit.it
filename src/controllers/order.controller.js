import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getIO } from "../socket/socket.js";
import mongoose from "mongoose";


export const createOrder = asyncHandler(async (req, res) => {
  const { consumer, seller, items, totalAmount, orderType, shippingAddress } = req.body;

  if (
    [consumer, seller, items, totalAmount, orderType, shippingAddress].some(
      (field) => field === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const order = await Order.create({
    consumer,
    seller,
    items,
    totalAmount,
    orderType,
    shippingAddress,
  });

   const io = getIO();

  // notify seller
  io.emit("new-order", order);

  if (!order) {
    throw new ApiError(400, "Order not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const type = req.query.type;
  const status = req.query.status;
  if (type) {
    if(status) {
      const orders = await Order.find({ orderType: type, OrderStatus: status })
      .populate("consumer", "displayName email")
      .populate("seller", "brandName email")
      .populate("items.product", "productName slug")
      .populate("shippingAddress", "street city state zipCode country")
      .skip(skip)
      .limit(limit);
      if (!orders) {
        throw new ApiError(404, "No orders found");
      }
      console.log(orders);
      
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            data: orders,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: Math.ceil(orders.length / parseInt(limit)),
              totalOrders: orders.length,
            },
          },
          "Orders fetched successfully"
        )
      );
    }
    const orders = await Order.find({ orderType: type })
      .populate("consumer", "displayName email")
      .populate("seller", "brandName email")
      .populate("items.product", "productName slug")
      .populate("shippingAddress", "street city state zipCode country")
      .skip(skip)
      .limit(limit);
    if (!orders) {
      throw new ApiError(404, "No orders found");
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          data: orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(orders.length / parseInt(limit)),
            totalOrders: orders.length,
          },
        },
        "Orders fetched successfully"
      )
    );
  }

  const orders = await Order.find()
    .populate("consumer", "displayName email")
    .populate("seller", "brandName email")
    .populate("items.product", "productName slug")
    .populate("shippingAddress", "street city state zipCode country")
    .skip(skip)
    .limit(limit);
  if (!orders) {
    throw new ApiError(404, "No orders found");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(orders.length / parseInt(limit)),
          totalOrders: orders.length,
        },
      },
      "Orders fetched successfully"
    )
  );
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID");
  }

  const order = await Order.findById(id)
    .select("-__v")
    .populate({
      path: "consumer",
      select: "displayName email",
    })
    .populate({
      path: "seller",
      select: "fullName email",
    })
    .populate({
      path: "items.product",
      select: "productName",
    })
    .populate({
      path: "items.variant",
      select: "price size color images",
    })
    .populate({
      path: "shippingAddress",
      select: "street city state zipCode country",
    })
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status == " ") {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { OrderStatus: status },
    { new: true }
  )
    .populate("consumer", "displayName email")
    .populate("seller", "fullName email")
    .populate("items.product", "name price")
    .populate("shippingAddress", "street city state zipCode country");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const io = getIO();

  io.emit("order-status-updated", order);

  
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

export const getAllOrdersForConsumer = asyncHandler(async (req, res) => {
  const { consumerId } = req.params;
  const orders = await Order.find({ consumer: consumerId })
    .populate("consumer", "displayName email")
    .populate("seller", "fullName email")
    .populate("items.product", "name price")
    .populate("shippingAddress", "street city state zipCode country");
  if (!orders) {
    throw new ApiError(404, "No orders found for this consumer");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Orders for consumer fetched successfully")
    );
});

export const getAllOrdersForSeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const orders = await Order.find({ seller: sellerId })
    .populate("consumer", "displayName email")
    .populate("seller", "fullName email")
    .populate("items.product", "name price")
    .populate("shippingAddress", "street city state zipCode country");
  if (!orders) {
    throw new ApiError(404, "No orders found for this seller");
  }
  console.log('order', orders);
  
  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Orders for seller fetched successfully")
    );
});
