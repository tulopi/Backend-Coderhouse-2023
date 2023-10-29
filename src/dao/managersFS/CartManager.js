import { existsSync, promises } from "fs";
import { manager as productManager } from "./ProductManager.js";
import crypto from "crypto";
const cartPath = "CartFile.json";

class CartManager {
    carts = [];

    async getCarts() {
        try {
            if (existsSync(cartPath)) {
                const cartsFile = await promises.readFile(cartPath, "utf-8");
                this.carts = JSON.parse(cartsFile);
            }
            return this.carts;
        } catch (error) {
            throw error;
        }
    }

    async createCart() {
        try {
            await this.getCarts();
            const cartId = crypto.randomBytes(16).toString("hex");
            const newCart = {
                id: cartId,
                products: [],
            };
            this.carts.push(newCart);
            await promises.writeFile(cartPath, JSON.stringify(this.carts));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            await this.getCarts();
            return this.carts.find((cart) => cart.id === cartId);
        } catch (error) {
            throw error;
        }
    }

    async clearCartByCid(cartId) {
        try {
            await this.getCarts();
            const cart = this.carts.find((cart) => cart.id === cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = [];
            await promises.writeFile(cartPath, JSON.stringify(this.carts));
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async deleteCartByCid(cartId) {
        try {
            await this.getCarts();
            const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
            if (cartIndex === -1) {
                throw new Error("Cart not found");
            }
            const deletedCart = this.carts.splice(cartIndex, 1)[0];
            await promises.writeFile(cartPath, JSON.stringify(this.carts));
            return deletedCart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            await this.getCarts();
            const cart = this.carts.find((cart) => cart.id === cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            const product = await productManager.getProductById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            const productIndex = cart.products.findIndex((item) => item.productId === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            if (product.stock >= quantity) {
                product.stock -= quantity;
                await productManager.updateProduct(productId, product);
            } else {
                throw new Error(`Not enough stock for product with ID ${productId}`);
            }
            await promises.writeFile(cartPath, JSON.stringify(this.carts));
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export const cartManager = new CartManager();