import { productsModel } from "../../models/product.model.js"
import BasicMongo from "./basic.dao.js";

class ProductMongo extends BasicMongo {
    constructor(){
        super(productsModel)
    }

    async findAll(obj) {
        try {
            const { limit = 9, page = 1, sortField } = obj;
            const sortOptions = await this.getSortedQuery(sortField);
            const query = {};

            const options = {
                page: page,
                limit: limit,
                sort: sortOptions
            };

            const response = await productsModel.paginate(query, options);
            return {
                status: "success",
                payload: response.docs,
                totalPages: response.totalPages,
                prevPage: response.prevPage,
                nextPage: response.nextPage,
                page: page,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                prevLink: response.hasPrevPage ? `/products?page=${response.prevPage}&limit=${limit}` : null,
                nextLink: response.hasNextPage ? `/products?page=${response.nextPage}&limit=${limit}` : null
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
    };

    async findById(id) {
        try{
            const product = await productsModel.findById(id);
            return product;
        } catch (error) {
            throw error;
        }
    }
    async createOne(product) {
        try {
            const newProduct = await productsModel.create(product);
            return newProduct;
        } catch (error) {
            throw error;
        }
    };

    async findAllLean() {
        try {
            const products = await productsModel.find().lean();
            return products;
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
    };
};

export const productMongo = new ProductMongo();