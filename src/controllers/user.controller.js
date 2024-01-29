import { userServices } from "../services/user.services.js"
import { handleServerError } from "../loggers/errorHandler.js";

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
        const {id} = req.params
        try {
            const data = await userServices.updatePremium(id);
            res.json({message: data});
        } catch (error) {
            console.log(error);
        }
    }
};