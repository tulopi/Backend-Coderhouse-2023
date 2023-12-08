export const authMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(403).json("Not authorized: User role not found");
            }
            if (roles.includes("user") || roles.includes(req.user.role)) {
                return next();
            }
            return res.status(403).json("Not authorized: User role not permitted");
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};