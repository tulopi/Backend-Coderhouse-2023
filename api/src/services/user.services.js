import { isValidObjectId } from "mongoose";
import { usersMongo } from "../DAL/dao/users.dao.js";
import { userModel } from "../models/user.model.js";
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

  async upload(id, avatar, dni, address, bank) {
    try {
      if (!isValidObjectId(id)) {
        throw new StatusError("User ID is not valid", 400);
      }

      const userFromDb = await userModel.findById(id);
      if (!userFromDb) {
        throw new StatusError("User not found", 404);
      }

      const saveDocuments = await userModel.updateOne({_id: id}, {
        documents: [
          { name: "dni", ref: dni[0].path },
          { name: "address", ref: address[0].path },
          { name: "avatar", ref: avatar[0].path },
          { name: "bank", ref: bank[0].path },
        ],
      });
      if (saveDocuments.nModified === 0) {
        throw new StatusError("No changes made", 400);
      }

      return saveDocuments;
    } catch (error) {
        throw new StatusError(error.message, 500);
      }
  }
}

export const userServices = new UserManager();
