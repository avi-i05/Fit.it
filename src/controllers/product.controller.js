import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { ProductVariant } from "../models/productVariants.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const productRegister = asyncHandler(async (req, res) => {
    const { productName, description, slug, productCategory} = req.body;

    let highlights = {};

    if (req.body.highlights) {
        try {
            highlights = JSON.parse(req.body.highlights);
        } catch (error) {
            throw new ApiError(400, "Invalid highlights format");
        }
}


    if(
        [productName, description, slug, highlights.sectionTitle, highlights.type, highlights.content, productCategory].some(field => !field)
    )
    {
        throw new ApiError(400, "All fields are required");
    }

    const sellerId = req.seller._id;

    if(!sellerId){
        throw new ApiError(400, "Seller not found");
    }

    // console.log("productImages", req.files?.productImages);

    const productImagesPath = req.files?.productImages?.map(file => file.path);


    if(!productImagesPath || productImagesPath.length === 0) {
        throw new ApiError(400, "Product images are required");
    }

    const uploadedImages = await Promise.all(
        productImagesPath.map(async (imagePath) => {
            const uploadResult = await uploadOnCloudinary(imagePath);
            if (!uploadResult) {
                throw new ApiError(400, "Failed to upload product image");
            }
            return uploadResult.url;
        })
    );

    

    const product = await Product.create({
        productName,
        description,
        slug,
        highlights,
        productSeller: sellerId,
        productImages: uploadedImages,
        productCategory: req.body.productCategory
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully" ));
});



const createProductVariant = asyncHandler( async(req, res) => {
    const { product, price, stock, size, color, sku, images, isActive } = req.body;

    if (
        [product, price, stock, size, color, sku, images].some(field => !field)
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const imagePaths = req.files?.images?.map(file => file.path);

    if (!imagePaths || imagePaths.length === 0) {
        throw new ApiError(400, "Product variant images are required");
    }

    const uploadedImages = await Promise.all(
        imagePaths.map(async (imagePath) => {
            const uploadResult = await uploadOnCloudinary(imagePath);
            if (!uploadResult) {
                throw new ApiError(400, "Failed to upload product variant image");
            }
            return uploadResult.url;
        })
    );

    const productVariant = await ProductVariant.create({
        product,
        price,
        stock,
        size,
        color,
        sku,
        images: uploadedImages,
        isActive
    });

    return res.status(201).json(new ApiResponse(201, productVariant, "Product variant created successfully"));
});

const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.aggregate([
        {
            $lookup: {
                from: "productcategory",
                localField: "productCategory",
                foreignField: "_id",
                as: "category"
            }
        }
    ]);

    if(!products || products.length === 0){
        throw new ApiError(404, "No products found");
    }

   return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"));
   
});

const getCurrentSellerProducts = asyncHandler(async(req, res) => {
    if(!req.seller || !req.seller._id){
        throw new ApiError(401, "Unauthorized");
    }
    const products = await Product.find({ productSeller: req.seller._id });
    if(!products || products.length === 0){
        throw new ApiError(404, "No products found for the current seller");
    }
    return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"));
});






export {
    productRegister,
    createProductVariant,
    getCurrentSellerProducts
};
