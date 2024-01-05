import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.post("/", jwtValidation, adminMiddleware("admin"), productController.createProduct);
router.delete("/:pid", jwtValidation, adminMiddleware("admin"), productController.deleteProduct);
router.get("/:id", productController.getProductById);
router.post("/:cid/products/:pid", jwtValidation, productController.addProductToCart);
router.delete("/:cid/products/:pid", jwtValidation, productController.removeProductFromCart);
router.put("/:cid/products/:pid", jwtValidation, productController.updateProductQuantity);
router.delete("/:cid/empty", productController.clearCart);
router.delete("/:cid", productController.deleteCart);
router.get("/faker/mockingproducts", productController.mockingProducts);

export default router;