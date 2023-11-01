import { Router } from "express";
import { productManager } from "../dao/managersDB/productManager.js";
import { cartManager } from "../dao/managersDB/cartManager.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const sortParam = req.query.sort;
        const query = await productManager.getSortedQuery(sortParam);
        const object = await productManager.findAll({
            limit: req.query.limit,
            page: req.query.page,
            sortField: req.query.sort,
        });
        res.render("home", { object });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.findById(pid);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } 
        res.render("products", { product });
    } catch (error) {
        res.status(500).json(message.error)
    }
})

router.get("/chat", async (req, res) => {
    res.render("chat");
})

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.findCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.render("carts", { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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