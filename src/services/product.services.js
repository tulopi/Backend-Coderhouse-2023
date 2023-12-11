import { productsModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";

export class ProductService {
    async findAll(obj) {
        try {
            const { limit = 9, page = 1, sortField } = obj;
            const sortOptions = await this.getSortedQuery(sortField);
            const query = {};
            const response = await productsModel.paginate(query, { limit, page, sort: sortOptions });

            const totalPages = response.totalPages;
            const prevPage = response.prevPage;
            const nextPage = response.nextPage;
            const hasPrevPage = response.hasPrevPage;
            const hasNextPage = response.hasNextPage;
            const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;

            return {
                status: "success",
                payload: response.docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            };
        } catch (error) {
            throw error;
        }
    };
    async getSortedQuery(sortField) {
        const sortOptions = {};
        switch (sortField) {
            case 'price':
                sortOptions.price = 1;
                break;
            case 'category':
                sortOptions.category = 1;
                break;
            default:
                sortOptions.defaultField = 1;
        }
        return sortOptions;
    };

    async createOne(product) {
        try {
            const newProduct = await productsModel.create(product);
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async findAllLean() {
        try {
            const products = await productsModel.find().lean();
            return products;
        } catch (error) {
            throw error;
        }
    };
    async findById(id) {
        try {
            const response = await productsModel.findById(id);
            return response;
        } catch (error) {
            throw error;
        }
    };

    async addProductToCart(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productsModel.findById(pid);

            if (!cart || !product) {
                throw new Error("Cart or Product not found");
            }

            const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === pid);

            if (existingProductIndex === -1) {
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products.push({ productId: pid, quantity });
            } else {
                if (quantity <= 0) {
                    throw new Error("Quantity must be greater than 0");
                }
                cart.products[existingProductIndex].quantity += quantity;
            }

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);

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

    async updateOne(id, product) {
        try {
            const response = await productsModel.updateOne({ _id: id }, product);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);

            if (!cart) {
                throw new Error("Cart not found");
            }

            const product = cart.products.find(item => item.productId.toString() === pid);

            if (!product) {
                throw new Error("Product not found in the cart");
            }

            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0");
            }

            product.quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    };

    async clearCartByCid(cid) {
        try {
            const cart = await cartModel.findById(cid);

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

    async deleteCartByCid(cid) {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(cid);

            if (!deletedCart) {
                throw new Error("Cart not found");
            }

            return deletedCart;
        } catch (error) {
            throw error;
        }
    };

    async updateOne(id, product) {
        try {
            const response = await productsModel.updateOne({ _id: id }, product);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(id) {
        try {
            const response = await productsModel.deleteOne({ _id: id });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const productService = new ProductService();