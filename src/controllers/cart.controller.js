import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";

const createCart = asyncHandler(async (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        throw new ApiError(400, "Products are required");
    }



    const consumerId = req.consumer?.id;
    if (!consumerId) {
        throw new ApiError(401, "Consumer not authenticated");
    }

    const existingCart = await Cart.findOne({ consumerId });

    if (existingCart) {
        for (const item of products) {
            const existingProduct = existingCart.products.find(
                p => p.product.toString() === item.productId
            );

            if (existingProduct) {
                existingProduct.quantity += Number(item.quantity);
            } else {
                existingCart.products.push({
                    product: item.productId,
                    quantity: Number(item.quantity)
                });
            }
        }

        await existingCart.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(200, existingCart, "Cart updated successfully")
        );
    }

    const newCart = await Cart.create({
        consumerId,
        products: products.map(item => ({
            product: item.productId,
            quantity: Number(item.quantity)
        }))
    });

    return res.status(201).json(
        new ApiResponse(201, newCart, "Cart created successfully")
    );
});

const getCart = asyncHandler(async (req, res) => {
    const consumerId = req.consumer?.id;
    if(!consumerId){
        throw new ApiError(401, "Consumer not authenticated");
    }

    const cart = await Cart.findOne({ consumerId });
    if (!cart) {
        return res.status(404).json(
            new ApiResponse(404, null, "Cart not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart retrieved successfully")
    );
})

const handleQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        throw new ApiError(400, "Product ID and quantity are required");
    }

    const consumerId = req.consumer?.id;
    if (!consumerId) {
        throw new ApiError(401, "Consumer not authenticated");
    }

    const cart = await Cart.findOne({ consumerId });
    if (!cart) {
        return res.status(404).json(
            new ApiResponse(404, null, "Cart not found")
        );
    }

    const cartItem = cart.products.find(item => item.product.toString() === productId);
    if (!cartItem) {
        return res.status(404).json(
            new ApiResponse(404, null, "Product not found in cart")
        );
    }

    cartItem.quantity = quantity;
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart updated successfully")
    );
})

const removeItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const consumerId = req.consumer?.id;
    if (!consumerId) {
        throw new ApiError(401, "Consumer not authenticated");
    }

    const cart = await Cart.findOne({ consumerId });
    if (!cart) {
        return res.status(404).json(
            new ApiResponse(404, null, "Cart not found")
        );
    }

    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart updated successfully")
    );
});


export {
    createCart,
    getCart,
    handleQuantity,
    removeItem
}

