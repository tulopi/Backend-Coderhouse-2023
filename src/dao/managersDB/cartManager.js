import { cartModel } from "../../db/models/cart.model.js";
import { productsModel } from "../../db/models/product.model.js";

class CartManager {

    async updateCart(id, products) {
        try {
            const cart = await cartModel.findOneAndUpdate({ _id: id }, { products }, { new: true });
            return cart;
        } catch (error) {
            throw error;
        }
    }

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

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error("Cart not found")
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (productIndex === -1) {
                const product = await productsModel.findById(productId);
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
        try {
            const { product, id, quantity = 1 } = body;
            if (!id) {
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
    }
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
    }

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
    }

    async updateOne(id, product) {
        try {
            const response = await cartModel.updateOne({ _id: id }, product);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(id) {
        try {
            const response = await cartModel.deleteOne({ _id: id });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
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

    async clearCartByCid(id) {
        try {
            const cart = await cartModel.findById({ _id: id });
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = [];
            const clearedCart = await cart.save();
            return clearedCart;
        } catch (error) {
            throw error;
        }
    }
}

export const cartManager = new CartManager();