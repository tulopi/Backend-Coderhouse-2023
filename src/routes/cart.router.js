import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.get("/:id", cartController.getCartById);
router.post("/:cid/products/:pid", jwtValidation, passport.authenticate("jwt", { session: false }), authMiddleware(["user"]), cartController.addProductToCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid/empty", cartController.clearCart);
router.delete("/:cid", cartController.deleteCart);
router.get("/:cid/purchase", jwtValidation, passport.authenticate("jwt", { session: false }), authMiddleware(["user"]), cartController.purchase);

export default router;