import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    secret_jwt: process.env.SECRET_JWT,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
};