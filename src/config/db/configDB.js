import mongoose from "mongoose";
import config from "../config.js";
import { logError, logInfo } from "../../loggers/index.js";

const URI = config.mongoUrl;

mongoose.connect(URI)
    .then(() => {
        logInfo(`🛜  Connected to MongoDB 🛜`);
    }).catch((error) => logError(`Error en el servidor" ${error}`));

