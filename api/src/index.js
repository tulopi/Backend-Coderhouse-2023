// index.js
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.js";
import MongoStore from "connect-mongo";
import config from "./config/config.js";
import "./config/db/configDB.js";
import "./config/passport.js";
import router from "./routes/index.routes.js"
import notFoundRouter from "./routes/notFOund.router.js";
import logRouteAccess from "./utils/statusInfo.js";




const app = express();
const MONGODB_URI = config.mongoUrl;
const SECRET_SESSION = config.secret_session;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(logRouteAccess);
// Configurar los encabezados CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos
    next();
});


// Session setup
app.use(
    session({
        store: new MongoStore({
            mongoUrl: MONGODB_URI,
        }),
        secret: SECRET_SESSION,
        cookie: { maxAge: 6000000 },
    })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Handlebars setup
app.engine('handlebars', engine({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Routes
app.use(router);
// Not found Routes
app.use(notFoundRouter);


// Error handler
app.use((error, req, res, next) => {
    const statusError = error;
    const status = statusError.status || 500;
    const message = statusError.message;
    return res.status(status).json({ status, message });
});



export default app;
