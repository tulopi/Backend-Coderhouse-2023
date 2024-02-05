import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// [GET] 🌐/api/products/
router.get("/", productController.getAllProducts); 
// [GET] 🌐/api/products/:id
router.get("/:id", productController.getProductById); 
// [GET] 🌐/api/products/faker/mockingproducts
router.get("/faker/mockingproducts", jwtValidation, productController.mockingProducts); 
// [POST] 🌐/api/products/
router.post("/", jwtValidation, AuthMiddleware.authorize(["admin", "premium"]), productController.createProduct); 
// [POST] 🌐/api/products/:cid/products/:pid
router.post("/:cid/products/:pid", jwtValidation, jwtValidation, AuthMiddleware.authorize(["user"]), productController.addProductToCart); 
// [DELETE] 🌐/api/products/:pid
router.delete("/:id", jwtValidation, AuthMiddleware.authorize(["admin", "premium"]), productController.deleteProduct);
// [DELETE] 🌐/api/products/:cid/products/:pid
router.delete("/:cid/products/:pid", jwtValidation, productController.removeProductFromCart); 
// [DELETE] 🌐/api/products/:cid/empty
router.delete("/:cid/empty", jwtValidation, productController.clearCart);
// [DELETE] 🌐/api/products/:cid
router.delete("/:cid", jwtValidation, productController.deleteCart);  
// [PUT] 🌐/api/products/:cid/products/:pid
router.put("/:cid/products/:pid", jwtValidation, productController.updateProductQuantity); 

export default router;