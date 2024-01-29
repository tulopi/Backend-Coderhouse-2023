import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { ticketController } from "../controllers/ticket.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

// [GET] 🌐/api/users/current
router.get("/current", jwtValidation, passport.authenticate("jwt", { session: false }),AuthMiddleware.authorize(["user"]),userController.current);

// [GET] 🌐/api/users/tickets
router.get("/tickets", ticketController.getAllTickets);

// [GET] 🌐/api/users/premium/:id
router.get("/premium/:id", userController.updatePremium);

export default router;