import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";

import { manager as productManager } from "./ProductManager.js";

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



// Handlebars
app.engine("handlebars", engine());
app.set("views",__dirname + "/views");
app.set("view engine", "handlebars");

// routes

app.use("/api/views", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const httpServer = app.listen(port, () => {
    console.log("Listening on port 8080");
});


// websocket

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    socket.on("addProduct", (product) => {
        productManager.addProduct(product);
        socketServer.emit("productUpdate");
    });
    socket.on("delById", (id) => {
        console.log(id);
        productManager.deleteProduct(id);
        socketServer.emit("productUpdate");
    })
});