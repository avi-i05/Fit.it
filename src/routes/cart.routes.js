import { Router } from "express";
import {
    createCart,
    getCart,
    handleQuantity,
    removeItem
} from "../controllers/cart.controller.js";

import { verifyConsumerJWT } from "../middlewares/consumerAuth.middleware.js";

const router = Router();

router.route('/add-to-cart')
    .post(verifyConsumerJWT, createCart);

router.route('/get-cart')
    .get(verifyConsumerJWT, getCart);

router.route('/update-cart')
    .patch(verifyConsumerJWT, handleQuantity);

router.route('/remove-item')
    .delete(verifyConsumerJWT, removeItem);

export { router as cartRouter };
