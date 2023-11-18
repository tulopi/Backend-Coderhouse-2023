import { Router } from "express";
import { userManager } from "../dao/managersDB/userManager.js";
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const router = Router();

// local

router.post(
    "/signup",
    async (req, res, next) => {
        try {
            passport.authenticate("signup", {
                successRedirect: "/profile",
                failureRedirect: "/error",
            })(req, res, next);
        } catch (error) {
            res.status(500).json({ message: "Error during signup: " + error.message });
        }
    }
);

router.post(
    "/login",
    async (req, res, next) => {
        try {
            passport.authenticate("login", {
                successRedirect: "/profile",
                failureRedirect: "/error",
            })(req, res, next);
        }
        catch (error) {
            res.status(500).json({ message: "Error during login: " + error.message });
        }
    }
);

// github 

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));


router.get("/callback", passport.authenticate("github", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/profile");
});

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
router.post("/restore", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userManager.findByEmail(email);
        if (!user) {
            return res.redirect("/login");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: "Error during password restoration: " + error.message });
    }
});

export default router;