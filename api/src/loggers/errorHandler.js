import { logError, logWarning } from "../loggers/index.js";
import { StatusError } from "../utils/statusError.js";

const handleServerError = (res, error, req) => {
    console.log(req, error ,res);
    logError(error);
    logWarning(`${req.method} ${req.originalUrl} ${res.statusCode}`);

    if (error instanceof StatusError) {
        res.status(error.statusCode).json({ message: error.message });
    } else {
        const statusError = new StatusError("Internal Server Error: " + error.message, 500);
        res.status(statusError.statusCode).json({ message: statusError.message });
    }
};

export { handleServerError };