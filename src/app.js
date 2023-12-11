import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import config from "./config/config.js";
import "./config/db/configDB.js";
import "./config/passport.js";
import { __dirname } from "./utils/utils.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import socketChatServer from "./listeners/socket.ChatServer.js";
import socketCartServer from "./listeners/socket.CartServer.js";

const app = express();
const port = parseInt(config.port);
const MONGODB_URI = config.mongoUrl;
const SECRET_SESSION = config.secret_session;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

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
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

// Server setup
const httpServer = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Socket setup
const socketServer = new Server(httpServer);
socketChatServer(socketServer);
socketCartServer(socketServer);