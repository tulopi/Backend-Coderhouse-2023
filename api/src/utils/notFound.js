import { logWarning } from "../loggers/index.js";

export const notFound = (req, res, next) => {
    logWarning(`${req.method} ${req.originalUrl} - Route not found`);
    return res.status(404).json({ message: "Oops, Route not found..." });
};