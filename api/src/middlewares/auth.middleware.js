import { handleServerError } from "../loggers/errorHandler.js";

export class AuthMiddleware {
    static authorize(allowedRoles) {
        return (req, res, next) => {
            const { user } = req;

            if (!user || !user.role) {
                return res.status(403).json({ error: "Not authorized", message: "User role not found or not logged in" });
            }
            const userRoles = Array.isArray(user.role) ? user.role : [user.role];
            const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            const isAllowed = allowedRolesArray.some((role) => userRoles.includes(role));

            if (isAllowed) {
                return next();
            }

            return res.status(403).json({ error: "Not authorized", message: "User role not permitted" });
        };
    }
}