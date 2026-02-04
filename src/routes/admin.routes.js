import { Router } from "express";
import {
    registerAdmin,
    adminLogin,
    adminLogout,
    adminRefreshToken,
    getAdminProfile,
    updateProfile,
    updatePassword,
    deleteAdmin
} from "../controllers/admin.controller.js";

import { verifyAdminJWT} from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route('/register')
    .post(registerAdmin);

router.route('/login')
    .post(adminLogin);

router.route('/logout')
    .post(verifyAdminJWT, adminLogout);

router.route('/refresh-token')
    .post(adminRefreshToken);

router.route('/profile')
    .get(verifyAdminJWT, getAdminProfile);

router.route('/profile/update')
    .put(verifyAdminJWT, updateProfile);

router.route('/profile/update-password')
    .put(verifyAdminJWT, updatePassword);

router.route('/delete')
    .delete(verifyAdminJWT, deleteAdmin);

export { router as adminRouter };