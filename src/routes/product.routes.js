import { Router } from "express";

import{
    productRegister,
    getCurrentSellerProducts
} from "../controllers/product.controller.js";
import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.route('/register')
    .post(verifySellerJWT, upload.fields([{ name: 'productImages', maxCount: 5 }]), productRegister);

router.route('/my-products')
    .get(verifySellerJWT, getCurrentSellerProducts);

export { router as productRouter };
