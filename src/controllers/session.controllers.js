import passport from "passport";
import { generateToken } from "../utils/utils.js";
import { userServices } from "../services/user.services.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { hashData} from "../utils/utils.js"

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
        passport.authenticate("login", { session: false }, async (err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(401).json({ message: "Authentication failed" });
                }
                req.login(user, { session: false }, async (error) => {
                    if (error) {
                        return next(error);
                    }
                    const { first_name, last_name, role, _id } = user;
                    const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
                    res.status(200)
                        .cookie("token", token, { httpOnly: true })
                        .json({ token })
                });
            } catch (error) {
                handleServerError(res, error, req);
            }
        })(req, res, next);
    },
    signout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    },
    callback: (req, res) => {
        const { first_name, last_name, role, _id } = req.user;
        const token = generateToken({ first_name, last_name, role, _id: _id.toString() });
        res.status(200)
            .cookie("token", token, { httpOnly: true })
            .json({ token });
    },
    restore: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userServices.findByEmail(email);
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
    }
};