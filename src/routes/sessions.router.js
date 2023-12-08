import { Router } from "express";
import { userManager } from "../dao/managersDB/userManager.js";
import { hashData, compareData } from "../utils.js";
import { generateToken } from "../utils.js";
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

router.post("/login", async (req, res, next) => {
    passport.authenticate("login", { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            req.login(user, { session: false }, async (error) => {
                if (error) {
                    return next(error);
                }
                console.log(user);
                const { first_name, last_name, role, _id } = user;
                const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
                res.status(200)
                    .cookie("token", token, { httpOnly: true })
                    .json({ token })
            });
        } catch (error) {
            res.status(500).json({ message: "Error during login: " + error.message });
        }
    })(req, res, next);
});


// github

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));


router.get("/callback", passport.authenticate("github", { failureRedirect: "/error" }), (req, res) => {
    const { first_name, last_name, role, _id } = req.user;
    const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
    res.status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ token });
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