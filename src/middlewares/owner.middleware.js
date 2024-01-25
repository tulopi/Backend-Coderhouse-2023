import { handleServerError } from "../loggers/errorHandler.js"
import { StatusError } from "../utils/statusError.js";

export const ownerMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(403).json("Not authorized: User role not found");
            }
            if (roles.includes("owner") || roles.includes(req.user.role)) {
                throw new StatusError("Owner can't buy his own products", 401);
            }
            next();
        } catch (error) {
            handleServerError(res, error, req);
            next(error);
        }
    };
};