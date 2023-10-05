import { Router } from "express";
import { manager as productManager } from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const productsData = await productManager.getProducts();
        res.render("home", { products: productsData });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const productsData = await productManager.getProducts();
        res.render("realTimeProducts", { products: productsData });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

export default router;