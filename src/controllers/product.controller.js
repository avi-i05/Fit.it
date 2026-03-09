import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { ProductVariant } from "../models/productVariants.model.js";
import mongoose from "mongoose";
import { Seller } from "../models/seller.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createSingleProduct = asyncHandler(async (req, res) => {

  const { product, productVariants } = req.body;

  if (!product || !productVariants) {
    throw new ApiError(400, "Product and variants required");
  }

  const parsedProduct = JSON.parse(product);
  const parsedVariants = JSON.parse(productVariants);

  if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
    throw new ApiError(400, "Product variants required");
  }

  const sellerId = req.seller?._id;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  let createdProduct;

  try {

    // ================= CREATE PRODUCT =================
    createdProduct = await Product.create({
      ...parsedProduct,
      productSeller: sellerId
    });

    const variantsWithImages = [];

    // ================= HANDLE VARIANTS =================
    for (let i = 0; i < parsedVariants.length; i++) {

      const variant = parsedVariants[i];

      let uploadedImages = [];

      // find files for this variant
      const variantFiles = req.files.filter(
        (file) => file.fieldname === `variantImages_${i}`
      );

      for (const file of variantFiles) {

        const uploadResult = await uploadOnCloudinary(file.path);

        if (uploadResult) {
          uploadedImages.push(uploadResult.secure_url);
        }
      }

      variantsWithImages.push({
        ...variant,
        images: uploadedImages,
        product: createdProduct._id
      });
    }

    // ================= INSERT VARIANTS =================
    await ProductVariant.insertMany(variantsWithImages);

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          productId: createdProduct._id,
          variantsCount: variantsWithImages.length
        },
        "Product and variants created successfully"
      )
    );

  } catch (error) {

    // rollback if something fails
    if (createdProduct?._id) {
      await ProductVariant.deleteMany({ product: createdProduct._id });
      await Product.deleteOne({ _id: createdProduct._id });
    }

    throw new ApiError(500, error.message);
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

const updateProduct = asyncHandler(async (req, res) => {
  const { productId, updates } = req.body;

  if (!productId || !updates) {
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

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
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

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVariant, "Variant updated successfully"));
});

const updateFullProduct = asyncHandler(async (req, res) => {

  const { productId } = req.params;

  const productData = req.body.productData
    ? JSON.parse(req.body.productData)
    : null;

  const variants = req.body.variants
    ? JSON.parse(req.body.variants)
    : [];

  const files = req.files || [];

  const sellerId = req.seller?._id;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!productId) {
    throw new ApiError(400, "Product ID required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  /* ================= PRODUCT UPDATE ================= */

  if (productData) {

    if (productData.productName)
      product.productName = productData.productName;

    if (productData.description)
      product.description = productData.description;

    if (productData.highlights)
      product.highlights = productData.highlights;

    if (productData.category)
      product.category = productData.category;

    if (productData.brand)
      product.brand = productData.brand;

    await product.save();
  }

  /* ================= VARIANT UPDATE ================= */

  const existingVariants = await ProductVariant.find({ product: productId });

  const incomingVariantIds = [];

  for (let index = 0; index < variants.length; index++) {

    const variantData = variants[index];

    let variant = null;

    if (variantData._id) {
      variant = await ProductVariant.findById(variantData._id);
      incomingVariantIds.push(variantData._id.toString());
    }

    /* -------- UPDATE EXISTING VARIANT -------- */

    if (variant) {

      variant.price = variantData.price ?? variant.price;
      variant.stock = variantData.stock ?? variant.stock;
      variant.size = variantData.size ?? variant.size;
      variant.color = variantData.color ?? variant.color;
      variant.audience = variantData.audience ?? variant.audience;

      /* ---------- IMAGE HANDLING ---------- */

      const variantFiles = files.filter(
        (file) => file.fieldname === `variantImages_${index}`
      );

      const existingImages = variantData.existingImages || [];

      /* DELETE REMOVED IMAGES */

      const removedImages = variant.images.filter(
        (img) => !existingImages.includes(img)
      );

      for (const img of removedImages) {
        await deleteFromCloudinary(img);
      }

      /* UPLOAD NEW IMAGES */

      const uploadedImages = [];

      for (const file of variantFiles) {
        const uploaded = await uploadOnCloudinary(file.path);
        uploadedImages.push(uploaded.secure_url);
      }

      /* FINAL IMAGE ARRAY */

      variant.images = [...existingImages, ...uploadedImages];

      await variant.save();
    }

    /* -------- CREATE NEW VARIANT -------- */

    else {

      const variantFiles = files.filter(
        (file) => file.fieldname === `variantImages_${index}`
      );

      const uploadedImages = [];

      for (const file of variantFiles) {
        const uploaded = await uploadOnCloudinary(file.path);
        uploadedImages.push(uploaded.secure_url);
      }

      const newVariant = await ProductVariant.create({
        product: productId,
        price: variantData.price,
        stock: variantData.stock,
        size: variantData.size,
        color: variantData.color,
        audience: variantData.audience,
        images: uploadedImages
      });

      incomingVariantIds.push(newVariant._id.toString());
    }
  }

  /* ================= DELETE REMOVED VARIANTS ================= */

  for (const variant of existingVariants) {

    if (!incomingVariantIds.includes(variant._id.toString())) {

      for (const img of variant.images) {
        await deleteFromCloudinary(img);
      }

      await variant.deleteOne();
    }
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Product updated successfully")
  );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        items: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  const products = result[0].items;
  const totalItems = result[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: products,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      },
      "Products fetched successfully"
    )
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
              isActive: true,
            },
          },
        ],
        as: "variants",
      },
    },
    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        totalStock: { $sum: "$variants.stock" },
      },
    },
    { $match: { "variants.0": { $exists: true } } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"));
});

const getProductsByFilters = asyncHandler(async (req, res) => {
  const { search, size, color, category } = req.query;

  const productMatch = {};

  if (search) {
    productMatch.productName = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    productMatch.productCategory = category;
  }

  const variantMatch = {
    isActive: true,
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
              ...variantMatch,
            },
          },
        ],
        as: "variants",
      },
    },

    {
      $match: {
        "variants.0": { $exists: true },
      },
    },

    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        totalStock: { $sum: "$variants.stock" },
      },
    },

    { $sort: { createdAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getSellerProducts = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  const totalProducts = await Product.countDocuments({
    productSeller: sellerId,
  });

  const products = await Product.aggregate([
    {
      $match: {
        productSeller: new mongoose.Types.ObjectId(sellerId),
      },
    },


    { $sort: { _id: -1 } },

    { $skip: skip },
    { $limit: limit },

    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total: totalProducts,
          page,
          limit,
          totalPages: Math.ceil(totalProducts / limit),
        },
      },
      "Products fetched successfully"
    )
  );
});



const getNearbyProducts = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, "Latitude and Longitude are required");
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    throw new ApiError(400, "Invalid latitude or longitude");
  }

  const nearbySellers = await Seller.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "distance",
        maxDistance: 7000,
        spherical: true,
      },
    },
    {
      $project: {
        _id: 1,
        distance: 1,
      },
    },
  ]);

  if (!nearbySellers.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No nearby sellers found"));
  }

  const sellerIds = nearbySellers.map((s) => s._id);

  const products = await Product.aggregate([
    {
      $match: {
        productSeller: { $in: sellerIds },
      },
    },
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
    {
      $lookup: {
        from: "sellers",
        localField: "productSeller",
        foreignField: "_id",
        as: "seller",
      },
    },
    {
      $unwind: "$seller",
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Nearby products fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const variants = await ProductVariant.find({
    product: id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product,
        variants,
      },
      "Product fetched successfully"
    )
  );
});

export {
  createSingleProduct,
  createMultipleProducts,
  updateProduct,
  updateVariant,
  updateFullProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsByFilters,
  getSellerProducts,
  getNearbyProducts,
  getProductById,
};
