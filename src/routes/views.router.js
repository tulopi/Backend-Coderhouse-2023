import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import viewsController from "../controllers/view.controller.js";

const router = Router();

router.get("/products", viewsController.renderProducts);
router.get("/products/:pid", viewsController.renderProductDetails);
router.get("/chat", jwtValidation, authMiddleware("user"), viewsController.renderChat);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/signup", viewsController.renderSignup);
router.get("/profile", viewsController.renderProfile);
router.get("/restore", viewsController.renderRestore);
router.get("/error", viewsController.renderError);

export default router;