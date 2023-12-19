import { productMongo } from "../DAL/dao/product.dao.js";
import { cartMongo } from "../DAL/dao/cart.dao.js";

export class ProductService {
    async findAll(obj) {
        return productMongo.findAll(obj);
    };
    async getSortedQuery(sortField) {
        return productMongo.getSortedQuery(sortField);
    };

    async createOne(product) {
        return productMongo.createOne(product);
    }

    async findAllLean() {
        return productMongo.findAllLean();
    };
    async findById(id) {
        return productMongo.getById(id);
    };

    async addProductToCart(cid, pid, quantity) {
        try {
            const cart = await cartMongo.getById(cid);
            const product = await productMongo.getById(pid);

            if (!cart || !product) {
                throw new Error("Cart or Product not found");
            }

            const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === pid);

            if (existingProductIndex === -1) {
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products.push({ productId: pid, quantity });
            } else {
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products[existingProductIndex].quantity += quantity;
            }

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartMongo.getById(cid);

            if (!cart) {
                throw new Error("Cart not found");
            }

            const productIndex = cart.products.findIndex(item => item.productId.toString() === pid);

            if (productIndex === -1) {
                throw new Error("Product not found in the cart");
            }

            cart.products.splice(productIndex, 1);
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async updateOne(id, product) {
        return productMongo.updateOne(id, product);
    };

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartMongo.findById(cid);

            if (!cart) {
                throw new Error("Cart not found");
            }

            const product = cart.products.find(item => item.productId.toString() === pid);

            if (!product) {
                throw new Error("Product not found in the cart");
            }

            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0");
            }

            product.quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    };

    async clearCartByCid(cid) {
        try {
            const cart = await cartMongo.getById(cid);

            if (!cart) {
                throw new Error("Cart not found");
            }

            cart.products = [];
            const clearedCart = await cart.save();
            return clearedCart;
        } catch (error) {
            throw error;
        }
    };

    async deleteCartByCid(cid) {
        try {
            const deletedCart = await cartMongo.delete(cid);
            if (!deletedCart) {
                throw new Error("Cart not found");
            }
            return deletedCart;
        } catch (error) {
            throw error;
        }
    };

    async updateOne(id, product) {
        try {
            const response = await productMongo.updateOne({ _id: id }, product);
            return response;
        } catch (error) {
            throw error;
        }
    };

    async deleteOne(id) {
        try {
            const response = await productMongo.delete({ _id: id });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const productService = new ProductService();