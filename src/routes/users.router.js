import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { ticketController } from "../controllers/ticket.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

// [GET] 🌐/api/users/current
router.get("/current", jwtValidation, passport.authenticate("jwt", { session: false }),authMiddleware(["user"]),userController.current);

// [GET] 🌐/api/users/tickets
router.get("/tickets", ticketController.getAllTickets);

// [PUT] 🌐/api/users/premium/:id
// router.put("/premium/:id", userController.updatePremium);

export default router;