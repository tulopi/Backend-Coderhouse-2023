import { cartMongo } from "../DAL/dao/cart.dao.js";
import { productMongo } from "../DAL/dao/product.dao.js";
import { StatusError } from "../utils/statusError.js";
import { ticketMongo } from "../DAL/dao/tickets.dao.js";
import { v4 as uuidv4 } from "uuid";

class CartService {
    async updateCart(id, products) {
        return cartMongo.update({ _id: id }, { products }, { new: true })
    };

    async updateProductQuantity(id, productId, quantity) {
        return cartMongo.updateProductQuantity(id, productId, quantity);
    };

    async getCart(id) {
        const cart = await cartMongo.getById(id).populate("products.product");
        return cart;
    };

    async purchase(id, user) {
        try {
            const cart = await cartMongo.getById(id);
            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }

            const cartProducts = cart.products;

            let availableProducts = [];
            let unavailableProducts = [];
            let totalAmount = 0;

            for (let item of cartProducts) {
                const product = await productMongo.getById(item.productId);

                if (!product) {
                    unavailableProducts.push(item);
                    continue;
                }

                if (product.stock >= item.quantity) {
                    availableProducts.push(item);
                    product.stock -= item.quantity;
                    await product.save();
                    totalAmount += item.quantity * product.price;
                } else {
                    unavailableProducts.push(item);
                }
            }

            cart.products = unavailableProducts;
            await cart.save();

            if (availableProducts.length > 0) {
                if (user.role === 'user') {
                    const ticket = {
                        code: uuidv4(),
                        purchase_datetime: new Date(),
                        amount: totalAmount,
                        purchaser: user
                    };
                    await ticketMongo.createTicket(ticket);
                    return { availableProducts, totalAmount };
                } else {
                    throw new StatusError('Unauthorized: Only users can purchase.', 401);
                }
            }
            return { unavailableProducts };
        } catch (error) {
            if (error instanceof StatusError) {
                throw error;
            } else {
                throw new StatusError(error.message, 500);
            }
        }
    };

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartMongo.getById(cartId);
            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }

            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

            if (productIndex === -1) {
                const product = await productMongo.getById(productId);
                if (!product) {
                    throw new StatusError("Product not found", 404);
                }
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                cart.products.push({ productId, quantity });
            } else {
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                cart.products[productIndex].quantity += quantity;
            }

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            if (error instanceof StatusError) {
                throw error;
            } else {
                throw new StatusError(error.message, 500);
            }
        }
    };

    async createCart(body) {
        return cartMongo.createCart(body);
    };

    async createSocketCart(req) {
        return cartMongo.createSocketCart(req);
    };

    async findAll() {
        return cartMongo.findAll();
    };

    async findCartById(id) {
        return cartMongo.findCartById(id);
    };

    async updateOne(id, product) {
        return cartMongo.update({ _id: id }, product);
    };

    async deleteOne(id) {
        return cartMongo.delete({ _id: id });
    };
    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartMongo.getById({ _id: cid });
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
    };

    async clearCartByCid(id) {
        try {
            const cart = await cartMongo.getById({ _id: id });
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
};

export const cartService = new CartService();