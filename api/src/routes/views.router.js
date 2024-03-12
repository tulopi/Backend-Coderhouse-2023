import { Router } from "express";
import viewsController from "../controllers/view.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";



const router = Router();

// [GET] 🌐/products
router.get("/products", viewsController.renderProducts);

// [GET] 🌐/products/:pid
router.get("/products/:pid", viewsController.renderProductDetails);

// [GET] 🌐/chat
router.get("/chat", jwtValidation, AuthMiddleware.authorize("user"), viewsController.renderChat);

// [GET] 🌐/carts/:cid
router.get("/carts/:cid",  AuthMiddleware.authorize("admin"), viewsController.renderCart);

// [GET] 🌐/users
router.get("/users",  jwtValidation, AuthMiddleware.authorize("admin"), viewsController.renderUsers);

// [GET] 🌐/profile
router.get("/profile", viewsController.renderProfile);

// [GET] 🌐/carts/:cid
router.get("/carts", viewsController.renderCart);

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

// [GET] 🌐/ticket/:id
router.get("/ticket/:id", viewsController.renderTicket);

// [GET] 🌐/
router.get("/", viewsController.renderProducts)

export default router;
