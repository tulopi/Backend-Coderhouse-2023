import { cartModel } from "../../db/models/cart.model.js";
import { productsModel } from "../../db/models/product.model.js";

class CartManager {

    async createCart(body) {
        try {
            const { product, id, quantity = 1 } = body;
            const productStock = await productsModel.findOne({ _id: product });
            if (quantity > productStock.stock) {
                throw {
                    error: "stock > quantity"
                }
            }
            if (!id) {
                const response = await cartModel.create({ products: [{ productId: product, quantity }] });
                return response
            } else {
                const cart = await cartModel.findOne({ _id: id }).lean();
                const productIndex = cart.products.findIndex((item) => item.productId == product);
                if (productIndex !== -1) {
                    if (cart.products[productIndex].quantity + quantity > productStock.stock) {
                        throw {
                            error: "Validation stock < cart.lenght + quantity"
                        }
                    }
                    cart.products[productIndex].quantity += quantity
                } else {
                    cart.products = [...[{ productId: product, quantity }]]
                }
                const update = await cartModel.findOneAndUpdate({ _id: id }, cart,{new:true});
                return update;
            }
        } catch (error) {
            console.log(error)
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

    async findById(id) {
        try {
            const response = await cartModel.findById(id);
            return response
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