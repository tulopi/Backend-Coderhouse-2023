import { productService } from "../services/product.services.js";
import { StatusError } from "../utils/statusError.js";
import { logError, logWarning } from "../loggers/index.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { userServices } from "../services/user.services.js";
import { productMongo } from "../DAL/dao/product.dao.js";

export class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.findAllLean();
      res.status(200).json({ message: "Products found", products });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async createProduct(req, res) {
    try {
      const user = req.user;
      const productData = req.body;
      const newProduct = await productService.createProduct(user, productData);
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }
  async deleteProduct(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const productId = req.params.id;
      const product = await productMongo.findById(productId);
      if (product.owner !== userId && userRole !== "admin")
        throw new StatusError("Only the owner can delete this item", 403);
      const deletedProduct = await productMongo.delete(productId);
      res.status(200).json({ message: "Product deleted", deletedProduct });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.findById(id);
      res.status(200).json({ message: "Product found", product });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async addProductToCart(req, res) {
    try {
        const user = req.user;
        const { pid } = req.params;
        const { quantity } = req.body;
        const userFromDB = await userServices.findById(user);
        const product = await productService.findById(pid);
        if (product.owner === userFromDB._id) {
            throw new StatusError("The owner can't purchase his own products", 403);
        }

        const cid = userFromDB.cart;

        const updatedCart = await productService.addProductToCart(cid, pid, quantity);

        res.status(200).json({ message: "Product added to cart", cart: updatedCart });
    } catch (error) {
        handleServerError(res, error, req);
    }
}

  async removeProductFromCart(req, res) {
    const {cid, pid} = req.params;
    try {
      const updatedCart = await productService.removeProductFromCart(cid, pid);
      res
        .status(200)
        .json({ message: "Product removed from cart", cart: updatedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async updateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const updatedCart = await productService.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      res
        .status(200)
        .json({
          message: "Product quantity updated in cart",
          cart: updatedCart,
        });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async clearCart(req, res) {
    const { cid } = req.params;
    try {
      const clearedCart = await productService.clearCartByCid(cid);
      res.status(200).json({ message: "Cart cleared", cart: clearedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async deleteCart(req, res) {
    const { cid } = req.params;
    try {
      const deletedCart = await productService.deleteCartByCid(cid);
      res.status(200).json({ message: "Cart deleted", cart: deletedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }

  async mockingProducts(req, res, next) {
    try {
      const amount = 100;
      const mocking = productService.mocking(amount);
      res
        .status(200)
        .json({ message: `${amount} Products mocked successfully!`, mocking });
    } catch (error) {
      handleServerError(res, error, req);
    }
  }
}

export const productController = new ProductController();
