import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();


// [GET] 🌐/api/cart/
router.get("/", cartController.getAllCarts);
// [POST] 🌐/api/cart/
router.post("/", cartController.createCart);
// [GET] 🌐/api/cart/:id
router.get("/:id", cartController.getCartById);
// [POST] 🌐/api/cart/:cid/products/:pid
router.post("/:cid/products/:pid", jwtValidation, passport.authenticate("jwt", { session: false }), authMiddleware(["user"]), cartController.addProductToCart);
// [DELETE] 🌐/api/cart/:cid/products/:pid
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);
// [PUT] 🌐/api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
// [DELETE] 🌐/api/carts/:cid/empty
router.delete("/:cid/empty", cartController.clearCart);
// [DELETE] 🌐/api/carts/:cid
router.delete("/:cid", cartController.deleteCart);
// [GET] 🌐/api/carts/:cid/purchase
router.get("/:cid/purchase", jwtValidation, passport.authenticate("jwt", { session: false }), authMiddleware(["user"]), cartController.purchase);

export default router;