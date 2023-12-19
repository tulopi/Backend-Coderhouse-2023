import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { resolve } from "path";

const SECRETJWT = "jwtSecret";

const currentFilePath = fileURLToPath(import.meta.url);
const srcDirectory = resolve(dirname(currentFilePath), '../');

export const __dirname = srcDirectory;

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
};

export const generateToken = (user) => {
    console.log("se genera el token");
    return jwt.sign(user , SECRETJWT, { expiresIn: '1h' });
};