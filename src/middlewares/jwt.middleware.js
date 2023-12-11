import jwt from "jsonwebtoken";
import config from "../config/config.js";;

export const jwtValidation = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const userToken = jwt.verify(token, config.secret_jwt);
        req.user = userToken;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};