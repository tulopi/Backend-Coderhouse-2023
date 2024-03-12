import passport from "passport";
import { compareData, generateToken } from "../utils/utils.js";
import { userServices } from "../services/user.services.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { transporter } from "../utils/nodemailer.js";
import { hashData } from "../utils/utils.js"
import { StatusError } from "../utils/statusError.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { usersMongo } from "../DAL/dao/users.dao.js";

export const sessionControler = {
    signup: async (req, res, next) => {
        try {
            passport.authenticate("signup", {
                successRedirect: "/profile",
                failureRedirect: "/error",
            })(req, res, next);
        } catch (error) {
            handleServerError(res, error, req);
        }
    },
    login: async (req, res, next) => {
        passport.authenticate("login", async (err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(401).json({ message: "Authentication failed" });
                }
                req.login(user, async (error) => {
                    if (error) {
                        return next(error);
                    }
                    const { first_name, last_name, role, _id } = user;
                    const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
                    const newDate = new Date()
                    const userFromDb =  await usersMongo.getById(req.user._id);
                    userFromDb.last_connection = newDate;
                    await userFromDb.save()
                    res.status(200)
                        .cookie("token", token, { httpOnly: true })
                        .redirect("/profile");
                });
            } catch (error) {
                handleServerError(res, error, req);
            }
        })(req, res, next);
    },
    signout: async (req, res) => {
        try {
            const newDate = new Date();
    
            const userFromDb = await usersMongo.getById(req.user._id);
            userFromDb.last_connection = newDate;
            await userFromDb.save();
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.redirect("/login");
                }
            });
        } catch (error) {
            console.error('Error during signout:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ,
    callback: (req, res) => {
        const { first_name, last_name, role, _id } = req.user;
        const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
        res.status(200)
            .cookie("token", token, { httpOnly: true })
            .redirect("/profile");
    },
    changePw: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userServices.getByEmail(email);
            if (!user) {
                return res.redirect("/login");
            }
            const hashedPassword = await hashData(password);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({ message: "Password updated" });
        } catch (error) {
            handleServerError(res, error, req);
        }
    },

    restore: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userServices.findOneByEmail(email);
            if (!user) throw new StatusError("User doesn't exist with the email provided", 400);
            await transporter.sendMail({
                from: "tulo.nv@gmail.com",
                to: email,
                subject: "Restore password",
                html: `<b>Please click on the link below</b>
                <a href="http://localhost:8080/restart/${user._id}">Restore password</a>
        `,
            })
            const recoveryToken = generateToken({ email });
            res
                .cookie("recoveryToken", recoveryToken, { maxAge: 3600000, httpOnly: true })
                .status(200)
                .json({ message: "Recovery email sent" });
        } catch (error) {
            handleServerError(res, error, req);
        }
    },

    restart: async (req, res) => {
        const { id } = req.params;
        const { pass, repeat } = req.body
        const user = await userServices.findById(id);
        if (req.cookies.token) {
            try {
                if (pass !== repeat) {
                    return res.json({ message: "Passwords must match" });
                }
                const isPassRepeated = await compareData(pass, user.password)
                if (isPassRepeated) {
                    return res.json({ message: "This password is not allowed" });
                }
                const newHashedPassword = await hashData(pass);
                user.password = newHashedPassword;
                await user.save();
                res.status(200).json({ message: "Password updated", user });
            } catch (error) {
                handleServerError(res, error, req);
            }
        } else {
            return res.redirect("/restore");
        }
    }
};