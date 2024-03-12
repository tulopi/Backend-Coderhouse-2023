import { userServices } from "../services/user.services.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { StatusError } from "../utils/statusError.js";
import { usersMongo } from "../DAL/dao/users.dao.js";

export const userController = {
  current: async (req, res) => {
    try {
      const user = req.user;
      const userFromDB = await userServices.findById(user._id);
      res.json({ message: "User", userFromDB });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },
  updatePremium: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await userServices.updatePremium(id);
      res.json({ message: data });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  uploadDocument: async (req, res) => {
      
      try {
          const { id } = req.params;
          if(!req.files) throw new StatusError("No req file", 400);
          const { avatar, dni, address, bank } = req.files;
      const data = await userServices.upload(id, avatar, dni, address, bank);
      return res.status(200).json({ message: data});
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  getAllUsers: async (req, res) => {
    try{
      const data = await usersMongo.getAllUsers();
      return res.status(200).json(data);
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  deleteOldUsers: async (req, res) => {
    try {
      const data = await usersMongo.softDelete();
      return res.status(200).json(data)
    }  catch (error) {
      handleServerError(res, error, req);
    }
  }
};
