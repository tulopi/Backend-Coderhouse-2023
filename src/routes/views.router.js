import { Router } from "express";
import viewsController from "../controllers/db.controllers/view.controller.js";

const router = Router();

router.get("/products", viewsController.renderProducts);
router.get("/products/:pid", viewsController.renderProductDetails);
router.get("/chat", viewsController.renderChat);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/signup", viewsController.renderSignup);
router.get("/profile", viewsController.renderProfile);
router.get("/restore", viewsController.renderRestore);
router.get("/error", viewsController.renderError);

export default router;