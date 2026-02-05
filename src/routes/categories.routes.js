import { Router } from "express";

import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById
} from "../controllers/category.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route('/create')
    .post(verifyAdminJWT, createCategory);

router.route('/:id')
    .get(getCategoryById)
    .patch(verifyAdminJWT, updateCategory)
    .delete(verifyAdminJWT, deleteCategory);

router.route('/get/all')
    .get(getAllCategories);

router.route('/:id/subcategories')
    .get(getSubCategories); 

export { router as categoryRouter };
