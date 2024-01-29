import { Router } from "express";
import { sessionControler } from "../controllers/session.controllers.js";
import passport from "passport";

const router = Router();

// [POST] 🌐/api/sessions/signup
router.post("/signup", sessionControler.signup);

// [POST] 🌐/api/sessions/login
router.post("/login", sessionControler.login);

// [GET] 🌐/api/sessions/auth/github
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// [GET] 🌐/api/sessions/callback
router.get("/callback", passport.authenticate("github", { failureRedirect: "/error" }), sessionControler.callback);

// [GET] 🌐/api/sessions/signout
router.get("/signout", sessionControler.signout);

// [POST] 🌐/api/sessions/changepw
router.post("/changepw", sessionControler.changePw);

// [POST] 🌐/api/sessions/restore
router.post("/restore", sessionControler.restore)

// [POST] 🌐/api/sessions/restart/:id
router.post("/restart/:id", sessionControler.restart)


export default router;
