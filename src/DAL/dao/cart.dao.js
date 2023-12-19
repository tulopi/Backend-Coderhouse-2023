import { cartModel } from "../../models/cart.model.js"
import BasicMongo from "./basic.dao.js"

class CartMongo extends BasicMongo {
    constructor(){
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
            const product = req.product;
            const id = req.id;
            const quantity = req.quantity || 1;
            if (!id || id === undefined) {
                const newCart = new cartModel({ products: [{ productId: product, quantity }] });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                await newCart.save();
                return newCart;
            } else {
                const cart = await cartModel.findOne({ _id: id });
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products.push({ product, quantity });
                await cart.save();
                return cart;
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