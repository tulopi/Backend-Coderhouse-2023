import { cartModel } from "../../models/cart.model.js"
import BasicMongo from "./basic.dao.js"
import { productMongo } from "./product.dao.js";

class CartMongo extends BasicMongo {
    constructor() {
        super(cartModel)
    };

    async updateProductQuantity(id, productId, quantity) {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) throw new Error("Cart not found");
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (productIndex === -1) throw new Error("Product not found in the cart");
            cart.products[productIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    };


    async createNewCart() {
        const cart = await cartModel.create();
        console.log(cart)
        return cart;
    };
    async createCart(body) {
        try {
            const product = body.product;
            const id = body.id;
            const quantity = body.quantity || 1;
            if (!id || id === undefined) {
                const newCart = new cartModel({ products: [{ productId: product, quantity }] });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                await newCart.save();
                return { status: 200, newCart };
            } else {
                const cart = await cartModel.findOne({ _id: id });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products.push({ product, quantity });
                await cart.save();
                return { status: 200, cart };
            }
        } catch (error) {
            throw error;
        }
    };

    async createSocketCart(req) {
        try {
            const product = await productMongo.findById(req.product);
            const cartId = req.cid;
            const cart = await cartModel.findById(cartId);
            const quantity = req.quantity || 1;
    
            if (!cart || cart === undefined) {
                console.log("You must be logged in to buy");
                throw new Error("You must be logged in to buy");
            }
    
            if (!product || product === undefined) {
                const newCart = new cartModel({ products: [{ productId: product, quantity }] });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                await newCart.save();
                return newCart;
            } else {
                const existingCart = await cartModel.findOne({ _id: cartId });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                existingCart.products.push({ productId: product, quantity });
                await existingCart.save();
                return existingCart;
            }
        } catch (error) {
            throw error;
        }
    };

    async findAll() {
        try {
            const response = await cartModel.find().populate("products.productId").lean();
            if (response.lenght == 0) {
                throw {
                    error: "Cart empty"
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    async findCartById(id) {
        try {
            const cart = await cartModel
                .findById(id)
                .populate("products.productId");
            if (!cart) {
                throw new Error("Cart not found");
            }

            return cart;
        } catch (error) {
            throw error;
        }
    };
};

export const cartMongo = new CartMongo();