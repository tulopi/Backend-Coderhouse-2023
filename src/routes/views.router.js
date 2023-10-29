import { Router } from "express";
import { productManager } from "../dao/managersDB/productManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const productsData = await productManager.findAll();
        res.render("home", { products: productsData });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.get("/chat", async (req, res) => {
    res.render("chat");
})

// RealTimeProducts //
// router.get("/realTimeProducts", async (req, res) => {
//     try {
//         const productsData = await productManager.getProducts();
//         res.render("realTimeProducts", { products: productsData });
//     } catch (error) {
//         res.status(404).json({message: error.message});
//     }
// })

export default router;