import { Router } from "express";
import { userManager } from "../dao/managersDB/userManager.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();


router.get("/current", jwtValidation, passport.authenticate("jwt", { session: false }),
    authMiddleware(["user"]),
    async(req, res) => {
        try {
            const user = req.user;
            const userFromDB = await userManager.findById(user._id);
            res.json({ message: "User", userFromDB });
        } catch (error) {
            console.log(error);
            res.status(401).json("Not authorized", error)
        }
    }
);

export default router;