import { Router } from "express";
import { cartController } from "../controllers/db.controllers/cart.controller.js";

const router = Router();

router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.get("/:id", cartController.getCartById);
router.post("/:cid/products/:pid", cartController.addProductToCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid/empty", cartController.clearCart);
router.delete("/:cid", cartController.deleteCart);

export default router;