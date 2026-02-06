import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { ProductVariant } from "../models/productVariants.model.js";
import mongoose from "mongoose";

const createSingleProduct = asyncHandler(async (req, res) => {
  const { product, productVariants } = req.body;

  if (
    !product ||
    !Array.isArray(productVariants) ||
    productVariants.length === 0
  ) {
    throw new ApiError(400, "Product and product variants are required");
  }

  const sellerId = req.seller?._id;
  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (product.length > 50) {
    throw new ApiError(400, "Max 50 products per request");
  }

  let createdProduct;

  try {
    createdProduct = await Product.create({
      ...product,
      productSeller: sellerId,
    });

    const variantsWithProduct = productVariants.map((v) => ({
      ...v,
      product: createdProduct._id,
    }));

    await ProductVariant.insertMany(variantsWithProduct);

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          productId: createdProduct._id,
          variantsCount: variantsWithProduct.length,
        },
        "Product and variants created successfully"
      )
    );
  } catch (error) {
    if (createdProduct?._id) {
      await ProductVariant.deleteMany({ product: createdProduct._id });
      await Product.deleteOne({ _id: createdProduct._id });
    }

    throw error;
  }
});

const createMultipleProducts = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Products array is required");
  }

  const sellerId = req.seller?._id;
  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const results = [];

  for (let i = 0; i < products.length; i++) {
    const { product, variants } = products[i];

    if (!product || !Array.isArray(variants) || variants.length === 0) {
      results.push({
        index: i,
        status: "failed",
        reason: "Product or variants missing",
      });
      continue;
    }

    let createdProduct = null;

    try {
      createdProduct = await Product.create({
        ...product,
        productSeller: sellerId,
      });

      const variantsWithProduct = variants.map((v) => ({
        ...v,
        product: createdProduct._id,
      }));

      await ProductVariant.insertMany(variantsWithProduct);

      results.push({
        index: i,
        status: "success",
        productId: createdProduct._id,
        variantsCount: variantsWithProduct.length,
      });
    } catch (error) {
      if (createdProduct?._id) {
        await ProductVariant.deleteMany({ product: createdProduct._id });
        await Product.deleteOne({ _id: createdProduct._id });
      }

      results.push({
        index: i,
        status: "failed",
        reason: error.message,
      });
    }
  }

  return res
    .status(207)
    .json(new ApiResponse(207, results, "Bulk product creation completed"));
});

const updateProduct = asyncHandler(async(req, res) =>{
    const { productId, updates } = req.body;

    if(!productId || !updates) {
        throw new ApiError(400, "Product ID and updates are required");
    }

    const sellerId = req.seller?._id;
    if (!sellerId) {
        throw new ApiError(401, "Unauthorized");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updates },
        { new: true }
    );
});

const updateVariant = asyncHandler(async (req, res) => {
    const { variantId, updates } = req.body;

    if (!variantId || !updates) {
        throw new ApiError(400, "Variant ID and updates are required");
    }

    const sellerId = req.seller?._id;
    if (!sellerId) {
        throw new ApiError(401, "Unauthorized");
    }

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
        variantId,
        { $set: updates },
        { new: true }
    );

    if (!updatedVariant) {
        throw new ApiError(404, "Variant not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVariant, "Variant updated successfully")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "variants"
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const matchStage = {};
  if (category) {
    matchStage.productCategory = new mongoose.Types.ObjectId(category);
  }

  const products = await Product.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "productvariants",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$product", "$$productId"] },
              isActive: true
            }
          }
        ],
        as: "variants"
      }
    },
    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        totalStock: { $sum: "$variants.stock" }
      }
    },
    { $match: { "variants.0": { $exists: true } } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched")
  );
});


const getProductsByFilters = asyncHandler(async (req, res) => {
  const {
    search,
    size,
    color,
    category,
  } = req.query;



  const productMatch = {};

  if (search) {
    productMatch.productName = {
      $regex: search,
      $options: "i"
    };
  }

  if (category) {
    productMatch.productCategory = category;
  }

  const variantMatch = {
    isActive: true
  };

  if (size) {
    variantMatch.size = size;
  }

  if (color) {
    variantMatch.color = color;
  }

  const products = await Product.aggregate([
    { $match: productMatch },

    {
      $lookup: {
        from: "productvariants",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$product", "$$productId"] },
              ...variantMatch
            }
          }
        ],
        as: "variants"
      }
    },

    {
      $match: {
        "variants.0": { $exists: true }
      }
    },

    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        totalStock: { $sum: "$variants.stock" }
      }
    },

    { $sort: { createdAt: -1 } },


  ]);

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});


export { createSingleProduct, createMultipleProducts, updateProduct, updateVariant, getAllProducts, getProductsByCategory, getProductsByFilters };
