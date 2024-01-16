import { Router } from "express";
import viewsController from "../controllers/view.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



const router = Router();

// [GET] 🌐/products
router.get("/products", viewsController.renderProducts);

// [GET] 🌐/products/:pid
router.get("/products/:pid", viewsController.renderProductDetails);

// [GET] 🌐/chat
router.get("/chat", jwtValidation, authMiddleware("user"), viewsController.renderChat);

// [GET] 🌐/carts/:cid
router.get("/carts/:cid", viewsController.renderCart);

// [GET] 🌐/login
router.get("/login", viewsController.renderLogin);

// [GET] 🌐/signup
router.get("/signup", viewsController.renderSignup);

// [GET] 🌐/profile
router.get("/profile", viewsController.renderProfile);

// [GET] 🌐/restore
router.get("/restore", viewsController.renderRestore);

// [GET] 🌐/error
router.get("/error", viewsController.renderError);

export default router;
