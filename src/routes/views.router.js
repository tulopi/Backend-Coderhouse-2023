import { Router } from "express";
import { manager as productManager } from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    const productsData = await productManager.getProducts();
    res.render("home", { products: productsData });
});

router.get("/realTimeProducts", async (req, res) => {
    const productsData = await productManager.getProducts();
    res.render("realTimeProducts", { products: productsData });
})

export default router;