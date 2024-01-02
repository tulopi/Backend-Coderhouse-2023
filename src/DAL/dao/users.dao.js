import { userModel } from "../../models/user.model.js"
import BasicMongo from "./basic.dao.js";

class UsersMongo extends BasicMongo {
    constructor() {
        super(userModel)
    };
    async findOneByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    };
    async findById(id) {
        try {
            const user = await userModel.findById(id).populate("cart");
            return user;
        } catch (error) {
            throw error;
        }
    };

    async createUser(user) {
        const response = await userModel.create(user);
        return response;
    };
};

export const usersMongo = new UsersMongo();