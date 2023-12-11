import { Router } from "express";
import { userController } from "../controllers/db.controllers/user.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();


router.get("/current", jwtValidation, passport.authenticate("jwt", { session: false }),authMiddleware(["user"]),userController.current);

export default router;