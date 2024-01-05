import { productMongo } from "../DAL/dao/product.dao.js";
import { cartMongo } from "../DAL/dao/cart.dao.js";
import { MockingProducts } from "../mocks/products.mocks.js";
import { StatusError } from "../utils/statusError.js";

export class ProductService {
    async findAll(obj) {
        const products = await productMongo.findAll(obj);
        if (!products) {
            throw new StatusError("Products not found", 404);
        }
        return products;
    }

    async getSortedQuery(sortField) {
        return productMongo.getSortedQuery(sortField);
    }

    async createOne(product) {
        return productMongo.createOne(product);
    }

    async findAllLean() {
        try {
            const products = await productMongo.findAllLean();
            return products;
        } catch (error) {
            throw new StatusError("Error finding products", 500);
        }
    }

    async findById(id) {
        try {
            const product = await productMongo.getById(id);
            if (!product) {
                throw new StatusError("Product not found", 404);
            }
            return product;
        } catch (error) {
            throw new StatusError("Error finding product", 500);
        }
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await cartMongo.getById(cid);
        const product = await productMongo.getById(pid);

        if (!cart || !product) {
            throw new StatusError("Cart or Product not found", 404);
        }

        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === pid);

        if (existingProductIndex === -1) {
            if (quantity <= 0) {
                throw new StatusError("Quantity must be greater than 0", 400);
            }
            cart.products.push({ productId: pid, quantity });
        } else {
            if (quantity <= 0) {
                throw new StatusError("Quantity must be greater than 0", 400);
            }
            cart.products[existingProductIndex].quantity += quantity;
        }

        const updatedCart = await cart.save();
        return updatedCart;
    }

    async removeProductFromCart(cid, pid) {
        const cart = await cartMongo.getById(cid);

        if (!cart) {
            throw new StatusError("Cart not found", 404);
        }

        const productIndex = cart.products.findIndex(item => item.productId.toString() === pid);

        if (productIndex === -1) {
            throw new StatusError("Product not found in the cart", 404);
        }

        cart.products.splice(productIndex, 1);
        const updatedCart = await cart.save();
        return updatedCart;
    }

    async updateOne(id, product) {
        return productMongo.updateOne(id, product);
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartMongo.findById(cid);

            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }

            const product = cart.products.find(item => item.productId.toString() === pid);

            if (!product) {
                throw new StatusError("Product not found in the cart", 404);
            }

            if (quantity <= 0) {
                throw new StatusError("Quantity must be greater than 0", 400);
            }

            product.quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async clearCartByCid(cid) {
        try {
            const cart = await cartMongo.getById(cid);

            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }

            cart.products = [];
            const clearedCart = await cart.save();
            return clearedCart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async deleteCartByCid(cid) {
        try {
            const deletedCart = await cartMongo.delete(cid);
            if (!deletedCart) {
                throw new StatusError("Cart not found", 404);
            }
            return deletedCart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    mocking(amount) {
        return MockingProducts.randomProducts(amount);
    }
}

export const productService = new ProductService();