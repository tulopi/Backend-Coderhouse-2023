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

// [GET] 🌐/change
router.get("/change", viewsController.renderChange);

// [GET] 🌐/restore
router.get("/restore", viewsController.renderRestore);

// [GET] 🌐/restart/:id
router.get("/restart/:id", viewsController.renderRestart);

// [GET] 🌐/error
router.get("/error", viewsController.renderError);

// [GET] 🌐/
router.get("/", viewsController.renderProducts)

export default router;
