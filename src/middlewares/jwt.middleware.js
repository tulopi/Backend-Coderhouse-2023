import jwt from "jsonwebtoken";
const SECRETJWT = "jwtSecret";

export const jwtValidation = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const userToken = jwt.verify(token, SECRETJWT);
        req.user = userToken;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};