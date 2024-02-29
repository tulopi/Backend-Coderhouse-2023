import { Router } from "express";
import { cookieController } from "../controllers/cookie.controller";

const router = Router();

// [POST] 🌐/
router.post("/", cookieController.session);
// [GET] 🌐/view
router.get("/view", cookieController.view);

export default router;