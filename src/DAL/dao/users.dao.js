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

    async createUser(user) {
        try {
            const response = await userModel.create(user);
            return response;
        } catch (error) {
            throw new StatusError("Error creating user", 500);
        }
    }
}

export const usersMongo = new UsersMongo();
