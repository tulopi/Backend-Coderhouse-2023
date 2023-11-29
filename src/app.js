import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import cookieParser from "cookie-parser";
import sessionsRouter from "./routes/sessions.router.js"
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import session from "express-session";
// RealTimeProducts // import { manager as productManager } from "./dao/managersFS/ProductManager.js";
import "./db/configDB.js";
import socketChatServer from "./listeners/socketChatServer.js";
import socketCartServer from "./listeners/socketCartServer.js";
import MongoStore from "connect-mongo";
import "./passport.js";
import passport from "passport";

const port = 8080;
const app = express();
const URI = "mongodb+srv://tulonv:NdxkT2wswrH7xIBU@cluster0.1rcs8eo.mongodb.net/ecommerce?retryWrites=true&w=majority";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());



// session
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }),
        secret: "secretSession",
        cookie: { maxAge: 6000000 },
    })
)


// passport
app.use(passport.initialize());
app.use(passport.session());

// handlebars 

app.engine('handlebars', engine({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// routes

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter)


const httpServer = app.listen(port, () => {
    console.log("Listening on port 8080");
});

const socketServer = new Server(httpServer);
socketChatServer(socketServer);
socketCartServer(socketServer);


// Real Time Products //
// socketServer.on("connection", (socket) => {
//     console.log(`Client Connected: ${socket.id}`);

//     socket.on("addProduct", (product) => {
//         try {
//             productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock);
//             socketServer.emit("productUpdate");
//         } catch (error) {
//             console.log(error);
//         }
//     });

//     socket.on("delById", (id) => {
//         productManager.deleteProduct(id);
//         socketServer.emit("productUpdate");
//     });

//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });

//     socket.on("error", (error) => {
//         console.error("Error WebSocket:", error);
//     });
// });
