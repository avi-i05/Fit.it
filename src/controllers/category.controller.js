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

    const existingCategory = await ProductCategory.findOne({ categorySlug });

    if (existingCategory) {
        throw new ApiError(400, "Category with this slug already exists");
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
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryName, categorySlug, parentCategory, isActive } = req.body;

    if (
        [categoryName, categorySlug, parentCategory].some(field => field === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCategory = await ProductCategory.findOne({ categorySlug });

    if (existingCategory && existingCategory.id !== req.params.id) {
        throw new ApiError(400, "Category with this slug already exists");
    }

    const category = await ProductCategory.findByIdAndUpdate(req.params.id, {
        categoryName,
        categorySlug,
        parentCategory,
        isActive
    }, { new: true });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await ProductCategory.findByIdAndDelete(req.params.id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Category deleted successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await ProductCategory.find({
    });
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories retrieved successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category retrieved successfully"));
});

const getSubCategories = asyncHandler(async (req, res) => {
    const subCategories = await ProductCategory.find({ parentCategory: req.params.id });
    return res
        .status(200)
        .json(new ApiResponse(200, subCategories, "Subcategories retrieved successfully"));
})

export {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    getSubCategories
};