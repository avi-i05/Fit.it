import { Order } from "../models/order.model.js";
import { Seller } from "../models/seller.model.js";
import { LogisticPartner } from "../models/logisticPatner.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getIO } from "../socket/socket.js";
import mongoose from "mongoose";


export const createOrders = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    throw new ApiError(400, "Orders array is required");
  }

  for (const order of orders) {
    const { consumer, seller, items, totalAmount, orderType, shippingAddress, deliveryLocation } = order;
    
    if ([consumer, seller, items, totalAmount, orderType, shippingAddress, deliveryLocation].some(
      (field) => field === ""
    )) {
      throw new ApiError(400, "All fields are required for each order");
    }
  }

  const sellerIds = [...new Set(orders.map(order => order.seller))];
  const sellers = await Seller.find({ _id: { $in: sellerIds } });
  
  if (sellers.length !== sellerIds.length) {
    throw new ApiError(404, "One or more sellers not found");
  }

  const createdOrders = [];
  const sellerMap = sellers.reduce((map, seller) => {
    map[seller._id.toString()] = seller;
    return map;
  }, {});

  for (const orderData of orders) {
    const sellerData = sellerMap[orderData.seller];
    
    const order = await Order.create({
      consumer: orderData.consumer,
      seller: orderData.seller,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      orderType: orderData.orderType,
      shippingAddress: orderData.shippingAddress,
      deliveryLocation: orderData.deliveryLocation,
      pickupLocation: sellerData.location,
    });

    // Notify the seller about the new order
    const io = getIO();
    io.to(`seller_${sellerData._id.toString()}`).emit("new-order", order);
    io.to("admin_room").emit("new-order", order); // Notify admin as well

    createdOrders.push(order);
  }

  if (createdOrders.length === 0) {
    throw new ApiError(400, "No orders were created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { 
      orders: createdOrders,
      totalOrders: createdOrders.length,
      message: `${createdOrders.length} orders created successfully from ${sellerIds.length} different stores`
    }, "Orders created successfully"));
});

export const createOrder = asyncHandler(async (req, res) => {
  const { consumer, seller, items, totalAmount, orderType, shippingAddress, deliveryLocation } = req.body;

  if (
    [consumer, seller, items, totalAmount, orderType, shippingAddress, deliveryLocation].some(
      (field) => field === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const sellerData = await Seller.findById(seller);
  if (!sellerData) {
    throw new ApiError(404, "Seller not found");
  }

  const order = await Order.create({
    consumer,
    seller,
    items,
    totalAmount,
    orderType,
    shippingAddress,
    deliveryLocation,
    pickupLocation: sellerData.location,
  });

  const io = getIO();
  io.to(`seller_${seller.toString()}`).emit("new-order", order);
  io.to("admin_room").emit("new-order", order); // Notify admin as well

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

  const updateData = { OrderStatus: status };

  // If a logistic partner is accepting the order, assign them to it and update partner status
  if (status === "accepted" && req.logisticPartner) {
    updateData.logisticPartner = req.logisticPartner._id;
    
    await LogisticPartner.findByIdAndUpdate(req.logisticPartner._id, {
      availabilityStatus: "DELIVERING",
      currentOrderId: id
    });
  }

  // If order is delivered, free up the partner
  if (status === "delivered" && req.logisticPartner) {
    await LogisticPartner.findByIdAndUpdate(req.logisticPartner._id, {
      availabilityStatus: "IDLE",
      currentOrderId: null
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    updateData,
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

export const getOrdersForPartner = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const orders = await Order.find({ logisticPartner: partnerId })
    .populate("consumer", "displayName email")
    .populate("seller", "brandName email storeName")
    .populate("items.product", "productName")
    .populate("shippingAddress", "street city state zipCode country")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Partner order history fetched successfully")
    );
});
