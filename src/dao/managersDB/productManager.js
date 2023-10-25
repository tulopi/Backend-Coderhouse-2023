import {productsModel} from "../../db/models/product.model.js"

class ProductManager {
    async findAll() {
        try {
            const response = await productsModel.find().lean();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const response = await productsModel.findById(id);
            return response
        } catch (error) {
            throw error;
        }
    }

    async createOne(product) {
            const response = await productsModel.create(product);
            return response;
    }

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

export const productManager = new ProductManager();