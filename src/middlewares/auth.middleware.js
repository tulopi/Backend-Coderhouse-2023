import { handleServerError } from "../loggers/errorHandler.js";

export class AuthMiddleware {
    static authorize(allowedRoles) {
        return (req, res, next) => {
            try {
                if (!req.user || !req.user.role) {
                    return res
                        .status(403)
                        .json("Not authorized: User role not found or not logged in");
                }

                const userRoles = Array.isArray(req.user.role)
                    ? req.user.role
                    : [req.user.role];

                const allowedRolesArray = Array.isArray(allowedRoles)
                    ? allowedRoles
                    : [allowedRoles];

                const allowed = allowedRolesArray.some((role) =>
                    userRoles.includes(role)
                );

                if (allowed) {
                    return next();
                }

                return res.status(403).json("Not authorized: User role not permitted");
            } catch (error) {
                handleServerError(res, error, req);
                next(error);
            }
        };
    }
}
