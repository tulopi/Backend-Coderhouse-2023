import { StatusError } from "../../utils/statusError.js";
export default class BasicMongo {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        try {
            const items = await this.model.find();
            return items;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async getById(id) {
        try {
            const item = await this.model.findById(id);
            if (!item) {
                throw new StatusError(`Item with ID ${id} not found`, 404);
            }
            return item;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async create(data) {
        try {
            const newItem = await this.model.create(data);
            return newItem;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async update(id, data) {
        try {
            const updatedItem = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedItem) {
                throw new StatusError(`Item with ID ${id} not found`, 404);
            }
            return updatedItem;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

    async delete(id) {
        try {
            const deletedItem = await this.model.findByIdAndDelete(id);
            if (!deletedItem) {
                throw new StatusError(`Item with ID ${id} not found`, 404);
            }
            return deletedItem;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }
}