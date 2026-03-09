import { Router } from "express";

import{

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
    getProductById
} from "../controllers/product.controller.js";
import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.route('/register/single')
    .post(verifySellerJWT,upload.any(), createSingleProduct)

router.route('/register/multiple')
    .post(verifySellerJWT, createMultipleProducts);

router.route('/all')
    .get(getAllProducts);

router.route('/category')
    .get(getProductsByCategory);

router.route('/filters')
    .get(getProductsByFilters);

router.route('/update/product/:productId')
    .patch(verifySellerJWT, updateProduct);

router.route('/update/variant/:variantId')
    .patch(verifySellerJWT, updateVariant);

router.route('/update/full-product/:productId')
    .patch(verifySellerJWT, upload.any(), updateFullProduct);


router.route('/seller-products/:sellerId')
    .get(getSellerProducts);



router.route('/nearby')
    .get(getNearbyProducts);

router.route('/product/:id')
    .get(getProductById);
export { router as productRouter };
