import { logInfo } from "../loggers/index.js";
const logRouteAccess = (req, res, next) => {
    const { method, originalUrl } = req;
    const message = `Ruta accedida: ${method} ${originalUrl}`;
    logInfo(message);
    next();
};

export default logRouteAccess;