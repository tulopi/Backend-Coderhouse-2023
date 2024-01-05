import { productService } from "../services/product.services.js";
import { StatusError } from "../utils/statusError.js";

export class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await productService.findAllLean();
            res.status(200).json({ message: "Products found", products });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await productService.create(req.body);
            res.status(200).json({ message: "Product created", product: newProduct });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await productService.findById(productId);
            const deletedProduct = await productService.deleteOne(product);
            res.status(200).json({ message: "Product deleted", deletedProduct });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.findById(id);
            res.status(200).json({ message: "Product found", product });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const user = req.user;
        const userFromDB = await userServices.findById(user);
        const { pid } = req.params;
        const cid = userFromDB.cart;
        const { quantity } = req.body;
        try {
            const updatedCart = await productService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: "Product added to cart", cart: updatedCart });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        const user = req.user;
        const userFromDB = await userServices.findById(user);
        const { pid } = req.params;
        const cid = userFromDB.cart;
        try {
            const updatedCart = await productService.removeProductFromCart(cid, pid);
            res.status(200).json({ message: "Product removed from cart", cart: updatedCart });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await productService.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ message: "Product quantity updated in cart", cart: updatedCart });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async clearCart(req, res) {
        const { cid } = req.params;
        try {
            const clearedCart = await productService.clearCartByCid(cid);
            res.status(200).json({ message: "Cart cleared", cart: clearedCart });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async deleteCart(req, res) {
        const { cid } = req.params;
        try {
            const deletedCart = await productService.deleteCartByCid(cid);
            res.status(200).json({ message: "Cart deleted", cart: deletedCart });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async mockingProducts(req, res, next) {
        try {
            const amount = 100;
            const mocking = productService.mocking(amount);
            res.status(200).json({ message: `${amount} Products mocked successfully!`, mocking });
        } catch (error) {
            const status = error instanceof StatusError ? error.status : 500;
            res.status(status).json({ message: error.message });
        }
    }
}

export const productController = new ProductController();