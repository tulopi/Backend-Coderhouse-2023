import { handleServerError } from "../loggers/errorHandler.js";

export const authMiddleware = ([roles]) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(403).json("Not authorized: User role not found or not logged in");
            }
            if (roles.includes("admin" || "premium") || roles.includes(req.user.role)) {
                return next();
            }
            return res.status(403).json("Not authorized: User role not permitted");
        } catch (error) {
            handleServerError(res, error, req);
            next(error);
        }
    };
};