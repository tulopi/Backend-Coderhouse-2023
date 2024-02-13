import { productMongo } from "../DAL/dao/product.dao.js";
import { cartMongo } from "../DAL/dao/cart.dao.js";
import mongoose from "mongoose";
import { MockingProducts } from "../mocks/products.mocks.js";
import { StatusError } from "../utils/statusError.js";
import { isValidObjectId } from "mongoose";
import { productsModel } from "../models/product.model.js";

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

  async createProduct(user, productData) {
    try {
      if (!user || (user.role !== "premium" && user.role !== "admin")) {
        throw new StatusError("User does not have the required role.", 403);
      }

      if (!isValidObjectId(productData.owner)) {
        throw new StatusError("Owner is not a valid objectId", 400);
      }

      const newProduct = await productsModel.create(productData);
      return newProduct;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw new StatusError("Error creating product", error.status || 500);
    }
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
      const product = await productsModel.findById(id);
      return product;
    } catch (error) {
      throw new StatusError("Error finding product", 500);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const cart = await cartMongo.getById(cid);
      const product = await productMongo.findById(pid);

      if (!cart || !product) {
        throw new StatusError("Cart or Product not found", 404);
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === pid
      );

      if (existingProductIndex === -1) {
        cart.products.push({
          productId: pid,
          quantity: quantity > 0 ? quantity : 1,
        });
      } else {
        cart.products[existingProductIndex].quantity +=
          quantity > 0 ? quantity : 1;
      }

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new StatusError("Invalid product ID", 400);
      }

      throw error;
    }
  }
  async removeProductFromCart(cid, pid) {
    try {
      const cart = await cartMongo.getById(cid);
      
      if (!cart) {
        throw new StatusError("Cart not found", 404);
      }
  
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === pid
      );
  
      if (productIndex === -1) {
        throw new StatusError("Product not found in the cart", 404);
      }
  
      cart.products.splice(productIndex, 1);
  
      const updatedCart = await cart.save();
      return updatedCart;
  
    } catch (error) {
      if (error instanceof StatusError) {
        throw error;
      } else {
        console.error("Error removing product from cart:", error);
        throw new StatusError("Internal Server Error", 500);
      }
    }
  }
  async updateOne(id, product) {
    return productMongo.updateOne(id, product);
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartMongo.getById(cid);

      if (!cart) {
        throw new StatusError("Cart not found", 404);
      }

      const product = cart.products.find(
        (item) => item.productId.toString() === pid
      );

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
