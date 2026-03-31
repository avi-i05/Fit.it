import { Router } from "express";
import { verifyConsumerJWT } from "../middlewares/consumerAuth.middleware.js";
import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getAllOrdersForConsumer,
    getAllOrdersForSeller,
    getOrdersForPartner,
    createOrders
} from "../controllers/order.controller.js";


const router = Router();

router.route('/create-order')
    .post(createOrder)


router.route('/create-orders')
    .post(createOrders)

router.route('/order/:id')
    .get(getOrderById)
router.route('/update-status/:id')
    .patch(updateOrderStatus)
router.route('/order')
    .get(getAllOrders)
router.route('/order/:id')
    .delete(deleteOrder)
router.route('/consumer/:consumerId')
    .get(getAllOrdersForConsumer)
router.route('/seller/:sellerId')
    .get(getAllOrdersForSeller)
router.route('/partner/:partnerId')
    .get(getOrdersForPartner)

export { router as orderRouter }