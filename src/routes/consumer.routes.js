import { Router } from "express";
import { 
    registerConsumer,
    loginConsumer,
    logoutConsumer,
    handleRefreshToken,
    getCurrentConsumerDetails,
    updateConsumerPassword,
    updateConsumerProfile,
    registerConsumerAddress,
    getConsumerAddresses,
    updateConsumerAddress,
    deleteConsumerAddress,
    deleteConsumerProfile
} from "../controllers/consumer.controller.js";

import { verifyConsumerJWT } from "../middlewares/consumerAuth.middleware.js";

const router = Router();

router.route("/register")
    .post(registerConsumer);

router.route("/login")
    .post(loginConsumer);

// secured routes

router.route("/logout")
    .post(verifyConsumerJWT, logoutConsumer);

router.route("/refresh-token")
    .put(verifyConsumerJWT, handleRefreshToken);

router.route("/me")
    .get(verifyConsumerJWT, getCurrentConsumerDetails);

router.route("/update-password")
    .patch(verifyConsumerJWT, updateConsumerPassword);

router.route("/update-profile")
    .patch(verifyConsumerJWT, updateConsumerProfile);

router.route("/add-address")
    .post(verifyConsumerJWT, registerConsumerAddress);

router.route("/get-addresses")
    .get(verifyConsumerJWT, getConsumerAddresses);

router.route("/update-address")
    .patch(verifyConsumerJWT, updateConsumerAddress);

router.route("/delete-address")
    .delete(verifyConsumerJWT, deleteConsumerAddress);

router.route("/delete-profile")
    .delete(verifyConsumerJWT, deleteConsumerProfile);

export { router as consumerRouter };
