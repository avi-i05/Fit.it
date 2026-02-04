import { Router } from "express";

import {
    registerSeller,
    loginSeller,
    logoutSeller,
    updateSellerPassword,
    updateSellerProfile,
    getSellerProfile,
    refreshTokenHnadler
} from "../controllers/seller.controller.js"

import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router()


router.route('/register')
    .post(
        upload.fields([
            {
                name: "govtIDImage",
                maxCount: 1
            }
        ]), registerSeller);

router.route('/login')
    .post(loginSeller)

//secured routes 

router.route('/logout')
    .post(verifySellerJWT, logoutSeller);

router.route('/update-password')
    .patch(verifySellerJWT, updateSellerPassword);

router.route('/update-profile')
    .patch(verifySellerJWT, updateSellerProfile);

router.route('/me')
    .get(verifySellerJWT, getSellerProfile);

router.route('/refresh-token')
    .put(verifySellerJWT, refreshTokenHnadler)



export { router as sellerRouter }