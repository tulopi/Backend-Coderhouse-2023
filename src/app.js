import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
// import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



// Handlebars
// app.engine("handlebars", engine());
// app.set("view",__dirname+"/views");
// app.set("view engine", "handlebars");

// routes

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, () => {
    console.log("Listening on port 8080");
})
