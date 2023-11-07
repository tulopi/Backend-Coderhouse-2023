import { Router } from "express";
import { userManager } from "../dao/managersDB/userManager.js"
import { hashData, compareData } from "../utils.js";

const router = Router();

router.post("/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await userManager.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
    }
    try {
        const hashedPassword = await hashData(password);
        await userManager.createOne({
            ...req.body,
            password: hashedPassword,
        });
        res.redirect("/products");
    } catch (error) {
        res.status(500).json(console.log(error));
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await userManager.findByEmail(email);
        if (!user) {
            return res.redirect("/signup");
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is not valid" });
        }
        const sessionInfo =
            email === "adminCoder@coder.com" && password === "adminCod3r123"
                ? { email, first_name: user.first_name, role: "admin" }
                : { email, first_name: user.first_name, role: "user" };
        req.session.user = sessionInfo;
        res.redirect("/products");
    } catch (error) {
        res.status(500).json(console.log(error));
    }
});

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.post("/restore", async (req,res) => {
    const { email, password} = req.body;
    try {
        const user = await userManager.findByEmail(email);
        if (!user) {
            return res.redirect("/login")
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Password updated"});
    } catch (error) {
        res.status(500).json({message: error});
    }
})

export default router;