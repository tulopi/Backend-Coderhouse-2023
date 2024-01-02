import { cartMongo } from "../DAL/dao/cart.dao.js";
import { productMongo } from "../DAL/dao/product.dao.js";
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
    };

    async purchase(id, user) {
        const cart = await cartMongo.getById(id);
        console.log(cart);
        const cartProducts = cart.products;
        console.log(cartProducts);

        let availableProducts = [];
        let unavailableProducts = [];
        let totalAmount = 0;

        for (let item of cartProducts) {
            const product = await productMongo.findById(item.productId);

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
                throw new Error('Unauthorized: Only users can purchase.');
            }
        }
        return { unavailableProducts };
    };

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartMongo.getById(cartId);
            if (!cart) throw new Error("Cart not found")
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (productIndex === -1) {
                const product = await productMongo.getById(productId);
                if (!product) throw new Error("Product not found");
                if (quantity <= 0) throw new Error("Quantity must be greater than 0");
                cart.products.push({ productId, quantity });
            } else {
                if (quantity <= 0) throw new Error("Quantity must be greater than 0");
                cart.products[productIndex].quantity += quantity;
            }
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
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