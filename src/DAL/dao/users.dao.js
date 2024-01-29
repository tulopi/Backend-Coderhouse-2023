import { userModel } from "../../models/user.model.js";
import { StatusError } from "../../utils/statusError.js";
import BasicMongo from "./basic.dao.js";

class UsersMongo extends BasicMongo {
    constructor() {
        super(userModel);
    }

    async findOneByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            throw new StatusError("Error finding user by email", 500);
        }
    }

    async findById(id) {
        try {
            const user = await userModel.findById(id).populate("cart");
            if (!user) {
                throw new StatusError(`User with ID ${id} not found`, 404);
            }
            return user;
        } catch (error) {
            throw new StatusError("Error finding user by ID", 500);
        }
    }

    async getUserById(id) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new StatusError(`User with ID ${id} not found`, 404);
            }
            return user;
        } catch (error) {
            throw new StatusError("Error finding user by ID", 500);
        }
    }
    async createUser(user) {
        try {
            const response = await userModel.create(user);
            return response;
        } catch (error) {
            throw new StatusError("Error creating user", 500);
        }
    }

    async updatePremium(id) {
        try {
            const userFromDb = await userModel.findById(id);
            if (!userFromDb) throw new StatusError("user not found", 404);
    
            const newRole =
                userFromDb.role === "user"
                    ? "premium"
                    : userFromDb.role === "premium"
                        ? "user"
                        : userFromDb.role;
    
            const updatedUser = await userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
            return updatedUser;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }
    
}

export const usersMongo = new UsersMongo();
