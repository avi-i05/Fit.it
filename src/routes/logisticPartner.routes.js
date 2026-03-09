import { Router } from "express";

import {
    registerLogisticPartner,
    getAllLogisticPartner,
    getLogisticPartnerById,
    updateLogisticPartner,
    deleteLogisticPartner
} from "../controllers/logisticPartner.controller.js";

const router = Router();

router.route('/register')
    .post(registerLogisticPartner);
router.route('/logistic-partners')
    .get(getAllLogisticPartner);

router.route('/logistic-partner/:id')
    .get(getLogisticPartnerById)
    .patch(updateLogisticPartner)
    .delete(deleteLogisticPartner);

export { router as logisticPartnerRouter };