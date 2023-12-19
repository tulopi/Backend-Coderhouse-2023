import { userModel } from "../../models/user.model.js"
import BasicMongo from "./basic.dao.js";

class UsersMongo extends BasicMongo {
    constructor(){
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
};

export const usersMongo = new UsersMongo();