import { Router } from "express";

import productsRouter from "./products.router.js";
import cartRouter from "./cart.router.js";
import viewsRouter from "./views.router.js";
import sessionsRouter from "./sessions.router.js";
import usersRouter from "./users.router.js";


const router = Router();

// Rutas 
router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", usersRouter);


export default router;