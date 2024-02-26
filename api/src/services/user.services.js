import { usersMongo } from "../DAL/dao/users.dao.js";
import { cartModel } from "../models/cart.model.js";
import { StatusError } from "../utils/statusError.js";

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

    async updatePremium(id) {
        try {
            const userFromDb = await usersMongo.getUserById(id);
            if (!userFromDb) throw new StatusError("user not found", 404);
            const newRole =
                userFromDb.role === "user"
                    ? "premium"
                    : userFromDb.role === "premium"
                        ? "user"
                        : userFromDb.role;
            const data = await usersMongo.updatePremium(id, { role: newRole });
            return data;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }
}

export const userServices = new UserManager();
