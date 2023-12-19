import { productService } from "../services/product.services.js";

export class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await productService.findAll();
            res.status(200).json({ message: "Products found", products });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await productService.create(req.body);
            res.status(200).json({ message: "Product created", product: newProduct });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await productService.findById(id);
            res.status(200).json({ message: "Product found", product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await productService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: "Product added to cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        const { cid, pid } = req.params;
        try {
            const updatedCart = await productService.removeProductFromCart(cid, pid);
            res.status(200).json({ message: "Product removed from cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await productService.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ message: "Product quantity updated in cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async clearCart(req, res) {
        const { cid } = req.params;
        try {
            const clearedCart = await productService.clearCartByCid(cid);
            res.status(200).json({ message: "Cart cleared", cart: clearedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCart(req, res) {
        const { cid } = req.params;
        try {
            const deletedCart = await productService.deleteCartByCid(cid);
            res.status(200).json({ message: "Cart deleted", cart: deletedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const productController = new ProductController();