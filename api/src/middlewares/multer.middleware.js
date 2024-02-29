import multer from "multer";
import { __dirname } from "../utils/utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (file.fieldname === "avatar") {
                return cb(null, `${__dirname}/docs/profiles`);
            } else if (file.fieldname === "dni") {
                return cb(null, `${__dirname}/docs/documents`);
            } else if (file.fieldname === "address") {
                return cb(null, `${__dirname}/docs/documents`);
            } else if (file.fieldname === "bank") {
                return cb(null, `${__dirname}/docs/documents`);
            } else {
                return cb(null, `${__dirname}/docs/documents`);
            }
        } catch (error) {
            return cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        try {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix);
        } catch (error) {
            return cb(error, null);
        }
    },
});

const upload = multer({ storage: storage });

export default upload;
