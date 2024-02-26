import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    secret_jwt: process.env.SECRET_JWT,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    secret_session: process.env.SECRET_SESSION,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_password: process.env.NODEMAILER_PASSWORD
};