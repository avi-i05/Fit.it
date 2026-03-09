import { Router } from "express";

import {
    registerSeller,
    loginSeller,
    logoutSeller,
    updateSellerPassword,
    updateSellerProfile,
    getSellerProfile,
    refreshTokenHandler,
    removeSellerProfile,
    getSellers,
    getSellerById,
    updateVerified,
    blockSeller
} from "../controllers/seller.controller.js"

import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

import { verifySellerJWT } from "../middlewares/sellerAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router()


router.route('/register')
    .post(
        upload.fields([
  { name: "govtIDImage", maxCount: 1 },
  { name: "ownerImage", maxCount: 1 },
  { name: "storeImage", maxCount: 1 }
]), 
        registerSeller
    );

    


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
    .put(verifySellerJWT, refreshTokenHandler)

router.route('/remove-profile')
    .delete(verifySellerJWT, removeSellerProfile)

router.route('/all-sellers')
    .get(getSellers)

router.route('/seller/:id')
    .get(getSellerById)

router.route('/update-verified/:id')
    .patch(verifyAdminJWT, updateVerified)

router.route('/block-seller/:id')
    .patch(verifyAdminJWT, blockSeller)

export { router as sellerRouter }