import { Router } from "express";

import productsRouter from "./products.router.js";
import cartRouter from "./cart.router.js";
import viewsRouter from "./views.router.js";
import sessionsRouter from "./sessions.router.js";
import usersRouter from "./users.router.js";
import { swaggerSetup } from "../config/swagger.js";
import swaggerUI from "swagger-ui-express";


const router = Router();

// Rutas 
router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", usersRouter);

// Swagger
router.use("/api/docs", swaggerUI.serve,swaggerUI.setup(swaggerSetup));


export default router;