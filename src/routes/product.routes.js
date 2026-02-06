import { Router } from "express";

import{

    createSingleProduct,
    createMultipleProducts,
    updateProduct,
    updateVariant,
    getAllProducts,
    getProductsByCategory,
    getProductsByFilters
} from "../controllers/product.controller.js";
import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.route('/register/single')
    .post(verifySellerJWT, createSingleProduct)

router.route('/register/multiple')
    .post(verifySellerJWT, createMultipleProducts);

router.route('/all')
    .get(getAllProducts);

router.route('/category')
    .get(getProductsByCategory);

router.route('/filters')
    .get(getProductsByFilters);

export { router as productRouter };
