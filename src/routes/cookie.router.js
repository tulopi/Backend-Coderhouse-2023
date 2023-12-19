import { Router } from "express";
import { cookieController } from "../controllers/cookie.controller";

const router = Router();

router.post("/", cookieController.session);
router.get("/view", cookieController.view);

export default router;