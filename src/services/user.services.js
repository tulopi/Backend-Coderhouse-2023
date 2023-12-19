import { usersMongo } from "../DAL/dao/users.dao.js";

class UserManager {
    async findById(id) {
        return usersMongo.getById(id);
    }

    async findOneByEmail(email) {
        return usersMongo.findOneByEmail(email);
    }

    async createOne(obj) {
        return usersMongo.create(obj);
    }
}

export const userServices = new UserManager();