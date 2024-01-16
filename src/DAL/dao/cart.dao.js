import { cartModel } from "../../models/cart.model.js";
import BasicMongo from "./basic.dao.js";
import { productMongo } from "./product.dao.js";
import { StatusError } from "../../utils/statusError.js";

class CartMongo extends BasicMongo {
    constructor() {
        super(cartModel);
    }

    async updateProductQuantity(id, productId, quantity) {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (productIndex === -1) {
                throw new StatusError("Product not found in the cart", 404);
            }
            cart.products[productIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async createNewCart() {
        try {
            const cart = await cartModel.create();
            console.log(cart);
            return cart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async createCart(body) {
        try {
            const product = body.product;
            const id = body.id;
            const quantity = body.quantity || 1;
            if (!id || id === undefined) {
                const newCart = new cartModel({ products: [{ productId: product, quantity }] });
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                await newCart.save();
                return { status: 200, newCart };
            } else {
                const cart = await cartModel.findOne({ _id: id });
                if (!cart) {
                    throw new StatusError("Cart not found", 404);
                }
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                cart.products.push({ product, quantity });
                await cart.save();
                return { status: 200, cart };
            }
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async createSocketCart(req) {
        try {
            const product = await productMongo.findById(req.product);
            const cartId = req.cid;
            const cart = await cartModel.findById(cartId);
            const quantity = req.quantity || 1;

            if (!cart || cart === undefined) {
                console.log("You must be logged in to buy");
                throw new StatusError("You must be logged in to buy", 401);
            }

            if (!product || product === undefined) {
                const newCart = new cartModel({ products: [{ productId: product, quantity }] });
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                await newCart.save();
                return newCart;
            } else {
                const existingCart = await cartModel.findOne({ _id: cartId });
                if (quantity <= 0) {
                    throw new StatusError("Quantity must be greater than 0", 400);
                }
                existingCart.products.push({ productId: product, quantity });
                await existingCart.save();
                return existingCart;
            }
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async findAll() {
        try {
            const response = await cartModel.find().populate("products.productId").lean();
            if (response.length === 0) {
                throw new StatusError("Cart empty", 404);
            }
            return response;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async findCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate("products.productId");
            if (!cart) {
                throw new StatusError("Cart not found", 404);
            }

            return cart;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }
}

export const cartMongo = new CartMongo();
