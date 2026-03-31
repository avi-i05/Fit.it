import { Router } from "express";

import {
    registerLogisticPartner,
    getAllLogisticPartner,
    getLogisticPartnerById,
    updateLogisticPartner,
    deleteLogisticPartner,
    partnerLogin,
    partnerLogout,
    getMe,
    getNearbyOrders
} from "../controllers/logisticPartner.controller.js";

import { updateOrderStatus, getOrdersForPartner } from "../controllers/order.controller.js";

import {
    logisticPartnerAuth
} from "../middlewares/logisticAuth.middleware.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

const partnerUpload = upload.fields([
    { name: "partnerImage", maxCount: 1 },
    { name: "govtIdImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 }
]);

router.route('/register')
    .post(partnerUpload, registerLogisticPartner);
router.route('/logistic-partners')
    .get(getAllLogisticPartner);

router.route('/me')
    .get(logisticPartnerAuth, getMe);

router.route('/nearby-orders')
    .get(logisticPartnerAuth, getNearbyOrders);

router.route('/update-order-status/:id')
    .patch(logisticPartnerAuth, updateOrderStatus);

router.route('/order-history/:partnerId')
    .get(logisticPartnerAuth, getOrdersForPartner);

router.route('/logistic-partner/:id')
    .get(getLogisticPartnerById)
    .patch(logisticPartnerAuth, partnerUpload, updateLogisticPartner)
    .delete(logisticPartnerAuth, deleteLogisticPartner);

router.route('/login')
    .post(partnerLogin);

router.route('/logout')
    .post(logisticPartnerAuth, partnerLogout);

export { router as logisticPartnerRouter };