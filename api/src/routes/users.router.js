import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { ticketController } from "../controllers/ticket.controller.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import passport from "passport";

const router = Router();

// [GET] 🌐/api/users/current
router.get("/current", jwtValidation, passport.authenticate("jwt", { session: false }),AuthMiddleware.authorize(["user"]),userController.current);

// [GET] 🌐/api/users/tickets
router.get("/tickets", ticketController.getAllTickets);

// [GET] 🌐/api/users/premium/:id
router.get("/premium/:id", userController.updatePremium);

// [GET] 🌐/api/users
router.get("/", passport.authenticate("jwt", { session: false }),AuthMiddleware.authorize(["admin"]), userController.getAllUsers);

// [POST] 🌐/api/users/:id/documents
router.post("/:id/documents", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'dni', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'bank', maxCount: 1 },
])
,userController.uploadDocument);


// [DELETE] 🌐/api/users/
router.delete("/"
,passport.authenticate("jwt", { session: false }),AuthMiddleware.authorize(["admin"])
,userController.deleteOldUsers);

export default router;