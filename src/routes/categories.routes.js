import { Router } from "express";

import {
    createCategory
} from "../controllers/category.controller.js";

const router = Router();

router.route('/create')
    .post(createCategory);

export { router as categoryRouter };
