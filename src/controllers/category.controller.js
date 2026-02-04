import { ProductCategory } from "../models/productCategory.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCategory = asyncHandler(async(req, res) => {

    const { categoryName, categorySlug, parentCategory, isActive } = req.body;

    if(
        [categoryName, categorySlug, parentCategory].some(field => field === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const category = await ProductCategory.create({
        categoryName,
        categorySlug,
        parentCategory,
        isActive
    });

    return res
            .status(201)
            .json(new ApiResponse(201, category, "Category created successfully"));
});


export {
    createCategory
};