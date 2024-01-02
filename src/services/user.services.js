import { usersMongo } from "../DAL/dao/users.dao.js";
import { cartModel } from "../models/cart.model.js";

class UserManager {
    async findById(id) {
        return usersMongo.getById(id);
    }

    async findOneByEmail(email) {
        return usersMongo.findOneByEmail(email);
    }

    async createOne(user) {
        const createdCart = new cartModel();
        await createdCart.save();
        const createdUser = await usersMongo.createUser({
            ...user,
            cart: createdCart._id,
        });
        return createdUser;
    }
}

export const userServices = new UserManager();