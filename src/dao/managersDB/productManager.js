import { productsModel } from "../../db/models/product.model.js"

class ProductManager {
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
    }

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
    }
    async findAllLean() {
        try {
            const products = await productsModel.find().lean();
            return products;
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